"use client";

import { useState } from "react";

export default function AddPortfolio() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user",
        symbol,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
      }),
    });

    location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        placeholder="AAPL"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="border p-2"
      />
      <input
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2"
      />
      <input
        placeholder="Buy Price"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-yellow-400 px-4 rounded">
        Add
      </button>
    </form>
  );
}
