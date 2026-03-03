import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bulkStudentSchema } from "@/lib/validation/student";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bulkStudentSchema.parse(json);

    const created = await db.$transaction(
      parsed.rows.map((row) =>
        db.student.create({
          data: {
            registrationId: row.registrationId,
            name: row.name,
            class: row.class,
            section: row.section,
            bloodGroup: row.bloodGroup,
            dob: row.dob ? new Date(row.dob) : null,
            phone: row.phone,
            address: row.address,
            parentName: row.parentName,
          },
        }),
      ),
    );

    return NextResponse.json({ count: created.length }, { status: 201 });
  } catch (error) {
    console.error("Error in bulk student upload", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 400 },
    );
  }
}

