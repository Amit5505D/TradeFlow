import { NextResponse } from "next/server";
import { getQuote } from "@/lib/actions/finnhub.actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const data = await getQuote(symbol);

  return NextResponse.json(data);
}
