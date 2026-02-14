'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

/* ----------------------------------------
   GET WATCHLIST SYMBOLS (for emails etc.)
-----------------------------------------*/
export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    await connectToDatabase();

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db
      .collection('user')
      .findOne<{ _id: unknown; id?: string }>({ email });

    if (!user) return [];

    const userId =
      typeof user.id === 'string'
        ? user.id
        : user._id?.toString();

    if (!userId) return [];

    const items = await Watchlist.find(
      { userId },
      { symbol: 1, _id: 0 }
    ).lean();

    return items.map((item) => item.symbol);
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

/* ----------------------------------------
   TOGGLE WATCHLIST (Add / Remove)
-----------------------------------------*/
export async function toggleWatchlist(symbol: string, company: string) {
  await connectToDatabase();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await Watchlist.findOne({ userId, symbol });

  if (existing) {
    await Watchlist.deleteOne({ userId, symbol });
    return { added: false };
  }

  await Watchlist.create({
    userId,
    symbol,
    company,
  });

  return { added: true };
}
