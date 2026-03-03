import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const student = await db.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Error fetching student", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 },
    );
  }
}

