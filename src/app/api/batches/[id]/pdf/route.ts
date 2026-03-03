import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { db } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

type Params = {
  params: {
    id: string;
  };
};

// A3 size in points (portrait)
const A3_WIDTH = 841.89;
const A3_HEIGHT = 1190.55;

const COLS = 3;
const ROWS = 4;

export async function POST(_request: Request, { params }: Params) {
  try {
    const batch = await db.batch.findUnique({
      where: { id: params.id },
      include: {
        template: true,
        batchCards: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const cards = batch.batchCards.slice(0, 100);

    const filename = `${randomUUID()}.pdf`;
    const outputDir = path.join(process.cwd(), "public", "pdfs");
    await fs.mkdir(outputDir, { recursive: true });
    const filePath = path.join(outputDir, filename);

    const doc = new PDFDocument({
      size: [A3_WIDTH, A3_HEIGHT],
      margin: 36,
    });

    const stream = doc.pipe(await fs.createWriteStream(filePath));

    const cardWidth = (A3_WIDTH - doc.page.margins.left - doc.page.margins.right) / COLS;
    const cardHeight = (A3_HEIGHT - doc.page.margins.top - doc.page.margins.bottom) / ROWS;

    cards.forEach((card, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS) % ROWS;

      if (index > 0 && index % (COLS * ROWS) === 0) {
        doc.addPage();
      }

      const x = doc.page.margins.left + col * cardWidth;
      const y = doc.page.margins.top + row * cardHeight;

      doc
        .roundedRect(x + 8, y + 8, cardWidth - 16, cardHeight - 16, 12)
        .stroke("#0f172a");

      doc
        .fontSize(10)
        .fillColor("#0ea5e9")
        .text(batch.template.name, x + 20, y + 18, {
          width: cardWidth - 40,
          align: "left",
        });

      doc
        .fontSize(9)
        .fillColor("#e5e7eb")
        .text(card.student.name, x + 20, y + 48);

      doc
        .fontSize(8)
        .fillColor("#94a3b8")
        .text(`Reg: ${card.student.registrationId ?? "-"}`, x + 20, y + 66);

      doc
        .fontSize(8)
        .fillColor("#94a3b8")
        .text(
          `Class: ${card.student.class ?? "-"}  Section: ${
            card.student.section ?? "-"
          }`,
          x + 20,
          y + 82,
        );
    });

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    const pdfUrl = `/pdfs/${filename}`;

    const printJob = await db.printJob.create({
      data: {
        batchId: batch.id,
        pdfUrl,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ pdfUrl, printJobId: printJob.id });
  } catch (error) {
    console.error("Error generating batch PDF", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}

