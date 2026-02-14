import { NextResponse } from "next/server";
import { Portfolio } from "@/database/models/Portfolio";
import { connectToDatabase } from "@/database/mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const newItem = await Portfolio.create(body);

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json(
      { error: "Failed to add portfolio item" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const items = await Portfolio.find();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
