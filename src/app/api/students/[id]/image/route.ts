import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { enhancedImage } = (await request.json()) as { enhancedImage: string };

    const student = await db.student.update({
      where: { id: params.id },
      data: {
        enhancedImage,
      },
    });

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Error updating student image", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}

