import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

type Body = {
  imageBase64: string;
  brightness?: number;
  width?: number;
  height?: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const { imageBase64, brightness = 1, width = 400, height = 600 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 },
      );
    }

    const matches = imageBase64.match(/^data:.+;base64,(.*)$/);
    const base64Data = matches ? matches[1] : imageBase64;
    const buffer = Buffer.from(base64Data, "base64");

    const processed = await sharp(buffer)
      .resize(width, height, { fit: "cover" })
      .modulate({ brightness })
      .toFormat("jpeg")
      .toBuffer();

    const filename = `${randomUUID()}.jpg`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, processed);

    const url = `/uploads/${filename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Error processing image", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}

