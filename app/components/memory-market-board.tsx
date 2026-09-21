"use client";

import { Database, HardDrive } from "lucide-react";
import { useState } from "react";

type MemoryMarket = "dram" | "nand";
type QuoteType = "spot" | "contract";

type MemoryQuote = {
  product: string;
  specification: string;
  high: string;
  low: string;
  average: string;
  change: number;
};

const quotes: Record<MemoryMarket, Record<QuoteType, MemoryQuote[]>> = {
  dram: {
    spot: [
      { product: "DDR5 16Gb", specification: "2Gx8 · 4800/5600", high: "$67.00", low: "$40.80", average: "$56.00", change: 1.39 },
      { product: "DDR5 16Gb eTT", specification: "2Gx8", high: "$25.60", low: "$23.50", average: "$24.60", change: 0.41 },
      { product: "DDR4 16Gb", specification: "2Gx8 · 3200", high: "$120.00", low: "$45.00", average: "$85.75", change: -0.29 },
      { product: "DDR4 16Gb eTT", specification: "2Gx8", high: "$14.20", low: "$12.80", average: "$13.23", change: 1.34 },
      { product: "DDR4 8Gb", specification: "1Gx8 · 3200", high: "$82.00", low: "$24.00", average: "$46.04", change: -0.23 },
      { product: "DDR4 8Gb eTT", specification: "1Gx8", high: "$6.40", low: "$5.65", average: "$5.77", change: 1.59 },
      { product: "DDR3 4Gb", specification: "512Mx8 · 1600/1866", high: "$19.80", low: "$9.75", average: "$13.78", change: -0.08 },
    ],
    contract: [
      { product: "DDR5 16GB SO-DIMM", specification: "PC Client", high: "$148.00", low: "$126.00", average: "$138.00", change: 6.15 },
      { product: "DDR5 8GB SO-DIMM", specification: "PC Client", high: "$138.00", low: "$116.00", average: "$130.00", change: 13.04 },
      { product: "DDR4 16GB SO-DIMM", specification: "PC Client", high: "$285.00", low: "$235.00", average: "$265.00", change: 16.74 },
      { product: "DDR4 8GB SO-DIMM", specification: "PC Client", high: "$145.00", low: "$118.00", average: "$139.00", change: 16.81 },
      { product: "DDR4 16Gb", specification: "2Gx8", high: "$57.00", low: "$45.00", average: "$48.00", change: 14.29 },
      { product: "DDR4 8Gb", specification: "1Gx8", high: "$33.00", low: "$21.50", average: "$24.00", change: 14.29 },
    ],
  },
  nand: {
    spot: [
      { product: "NAND 512Gb TLC", specification: "Wafer", high: "$22.80", low: "$19.40", average: "$21.13", change: 4.97 },
      { product: "NAND 256Gb TLC", specification: "Wafer", high: "$11.40", low: "$9.80", average: "$10.62", change: 2.12 },
      { product: "NAND 128Gb MLC", specification: "Wafer", high: "$8.10", low: "$6.85", average: "$7.48", change: 0.81 },
      { product: "NAND 64Gb MLC", specification: "Wafer", high: "$4.75", low: "$3.92", average: "$4.31", change: -0.46 },
      { product: "NAND 32Gb MLC", specification: "Wafer", high: "$2.80", low: "$2.25", average: "$2.53", change: -0.78 },
    ],
    contract: [
      { product: "NAND 512Gb TLC", specification: "Enterprise", high: "$24.20", low: "$21.50", average: "$22.80", change: 3.64 },
      { product: "NAND 256Gb TLC", specification: "Client", high: "$12.20", low: "$10.70", average: "$11.45", change: 2.23 },
      { product: "NAND 128Gb MLC", specification: "Embedded", high: "$8.60", low: "$7.40", average: "$8.05", change: 1.13 },
      { product: "NAND 64Gb MLC", specification: "Embedded", high: "$5.10", low: "$4.30", average: "$4.68", change: 0.43 },
      { product: "NAND 32Gb MLC", specification: "Embedded", high: "$3.05", low: "$2.55", average: "$2.80", change: 0.00 },
    ],
  },
};

export function MemoryMarketBoard() {
  const [market, setMarket] = useState<MemoryMarket>("dram");
  const [quoteType, setQuoteType] = useState<QuoteType>("spot");
  const currentQuotes = quotes[market][quoteType];
  const updateLabel = quoteType === "spot" ? "日终报价 · 18:10" : "当前有效合约期";

  return (
    <div className="memory-board">
      <div className="memory-board-toolbar">
        <div className="memory-market-tabs" role="tablist" aria-label="内存市场">
          <button className={market === "dram" ? "active" : ""} onClick={() => setMarket("dram")} role="tab" aria-selected={market === "dram"}><Database />DRAM</button>
          <button className={market === "nand" ? "active" : ""} onClick={() => setMarket("nand")} role="tab" aria-selected={market === "nand"}><HardDrive />NAND Flash</button>
        </div>
        <div className="memory-quote-tabs" role="tablist" aria-label="报价类型">
          <button className={quoteType === "spot" ? "active" : ""} onClick={() => setQuoteType("spot")} role="tab" aria-selected={quoteType === "spot"}>现货</button>
          <button className={quoteType === "contract" ? "active" : ""} onClick={() => setQuoteType("contract")} role="tab" aria-selected={quoteType === "contract"}>合约</button>
        </div>
      </div>
      <div className="memory-board-meta"><strong>{market === "dram" ? "DRAM" : "NAND Flash"}{quoteType === "spot" ? "现货报价" : "合约报价"}</strong><span>{updateLabel} · 北京时间</span></div>
      <div className="memory-table-scroll">
        <div className="memory-table">
          <div className="memory-table-row memory-table-head"><span>产品</span><span>最高</span><span>最低</span><span>均价</span><span>涨跌</span></div>
          {currentQuotes.map((quote) => (
            <div className="memory-table-row" key={`${market}-${quoteType}-${quote.product}-${quote.specification}`}>
              <span><strong>{quote.product}</strong><small>{quote.specification}</small></span>
              <span>{quote.high}</span>
              <span>{quote.low}</span>
              <span className="memory-average">{quote.average}</span>
              <span className={quote.change >= 0 ? "positive" : "negative"}>{quote.change > 0 ? "+" : ""}{quote.change.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className="memory-demo-note">Demo 报价 · 正式数据接入后按产品规格与有效报价期同步更新</p>
    </div>
  );
}
