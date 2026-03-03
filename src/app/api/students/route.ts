import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studentSchema } from "@/lib/validation/student";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = studentSchema.parse(json);

    const student = await db.student.create({
      data: {
        registrationId: parsed.registrationId,
        name: parsed.name,
        class: parsed.class,
        section: parsed.section,
        bloodGroup: parsed.bloodGroup,
        dob: parsed.dob ? new Date(parsed.dob) : null,
        phone: parsed.phone,
        address: parsed.address,
        parentName: parsed.parentName,
      },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error("Error creating student", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 400 },
    );
  }
}

