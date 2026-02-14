"use client";

import { useEffect, useRef } from "react";

interface MiniChartProps {
  symbol: string;
}

export default function MiniChart({ symbol }: MiniChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol: `NASDAQ:${symbol}`,
      width: "100%",
      height: "120",
      locale: "en",
      dateRange: "1M",
      colorTheme: "dark",
      trendLineColor: "#FDD458",
      underLineColor: "rgba(253, 212, 88, 0.2)",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="mt-4">
      <div ref={container} />
    </div>
  );
}
