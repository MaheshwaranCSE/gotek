import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const template = await db.template.findUnique({
      where: { id: params.id },
    });
    if (!template) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as { fieldsData: unknown };
    const template = await db.template.update({
      where: { id: params.id },
      data: {
        fieldsData: body.fieldsData,
      },
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error updating template", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 },
    );
  }
}

