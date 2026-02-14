"use client";

import { useEffect, useState } from "react";

interface Props {
  symbol: string;
  initialPrice: number;
  initialChange: number;
}

export default function LivePrice({
  symbol,
  initialPrice,
  initialChange,
}: Props) {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(initialChange);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${symbol}`);
        const data = await res.json();

        setPrice(data.c ?? 0);
        setChange(data.dp ?? 0);
      } catch (err) {
        console.error("Price refresh failed");
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  const isPositive = change >= 0;

  return (
    <div className="text-right">
      <p className="text-2xl font-semibold tracking-tight">
        ${price.toFixed(2)}
      </p>

      <p
        className={`text-sm font-medium ${
          isPositive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {isPositive ? "+" : ""}
        {change.toFixed(2)}%
      </p>
    </div>
  );
}
