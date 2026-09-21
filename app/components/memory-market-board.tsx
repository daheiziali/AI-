"use client";

import { Database, HardDrive } from "lucide-react";
import { useState } from "react";

type MemoryMarket = "dram" | "nand";
type MemoryQuote = { product: string; specification: string; high: string; low: string; average: string; change: number | null };
type QuoteCategory = { id: string; label: string; title: string; updatedAt: string; schedule?: string; quotes: MemoryQuote[] };

const dramCategories: QuoteCategory[] = [
  { id: "spot", label: "DRAM 现货", title: "DRAM现货报价", schedule: "每日更新时间：10:50、14:20", updatedAt: "最新更新时间：2026年9月21日 11:00", quotes: [
    { product: "DDR5 16Gb", specification: "2Gx8 · 4800/5600", high: "$68.00", low: "$41.50", average: "$56.417", change: 0.75 },
    { product: "DDR5 16Gb eTT", specification: "2Gx8", high: "$25.80", low: "$23.70", average: "$24.80", change: 0.81 },
    { product: "DDR4 16Gb", specification: "2Gx8 · 3200", high: "$119.50", low: "$45.50", average: "$85.00", change: -0.88 },
    { product: "DDR4 16Gb eTT", specification: "2Gx8", high: "$14.40", low: "$13.00", average: "$13.35", change: 0.95 },
    { product: "DDR4 8Gb", specification: "1Gx8 · 3200", high: "$83.00", low: "$23.90", average: "$46.036", change: 0 },
    { product: "DDR4 8Gb eTT", specification: "1Gx8", high: "$6.45", low: "$5.75", average: "$5.87", change: 1.73 },
    { product: "DDR3 4Gb", specification: "512Mx8 · 1600/1866", high: "$19.70", low: "$9.70", average: "$13.78", change: 0 },
  ] },
  { id: "contract", label: "DRAM 合约", title: "DRAM合约报价", updatedAt: "最新更新时间：2026年7月31日 15:00", quotes: [
    { product: "DDR5 8GB SO-DIMM", specification: "PC Client", high: "$138.00", low: "$116.00", average: "$130.00", change: 13.04 },
    { product: "DDR4 16GB SO-DIMM", specification: "PC Client", high: "$285.00", low: "$235.00", average: "$265.00", change: 16.74 },
    { product: "DDR4 8GB SO-DIMM", specification: "PC Client", high: "$145.00", low: "$118.00", average: "$139.00", change: 16.81 },
    { product: "DDR4 16Gb", specification: "2Gx8", high: "$57.00", low: "$45.00", average: "$48.00", change: 14.29 },
    { product: "DDR4 8Gb", specification: "1Gx8", high: "$33.00", low: "$21.50", average: "$24.00", change: 14.29 },
    { product: "DDR4 4Gb", specification: "256Mx16", high: "$16.50", low: "$12.00", average: "$14.50", change: 11.54 },
    { product: "DDR3 4Gb", specification: "256Mx16", high: "$16.50", low: "$12.00", average: "$14.50", change: 16 },
  ] },
  { id: "module-spot", label: "模组现货", title: "DRAM模组现货报价", updatedAt: "最新更新时间：2026年9月7日 14:40", quotes: [
    { product: "DDR5 UDIMM 16GB", specification: "4800/5600", high: "$265.00", low: "$220.00", average: "$234.00", change: 1.74 },
    { product: "DDR5 RDIMM 32GB", specification: "4800/5600", high: "$2,300.00", low: "$1,800.00", average: "$1,900.00", change: 5.56 },
    { product: "DDR4 UDIMM 16GB", specification: "3200", high: "$185.00", low: "$153.00", average: "$163.70", change: 0 },
  ] },
  { id: "gddr-spot", label: "GDDR 现货", title: "GDDR现货报价", updatedAt: "最新更新时间：2026年9月7日 14:40", quotes: [
    { product: "GDDR5 8Gb", specification: "显存颗粒", high: "$17.50", low: "$9.50", average: "$11.818", change: 0.38 },
    { product: "GDDR6 8Gb", specification: "显存颗粒", high: "$18.00", low: "$9.30", average: "$11.844", change: 0.48 },
  ] },
  { id: "lpddr-spot", label: "LPDDR 现货", title: "LPDDR现货报价", updatedAt: "示例报价 · 待正式数据接入", quotes: [
    { product: "LPDDR4 32Gb", specification: "移动内存", high: "$22.80", low: "$20.40", average: "$21.60", change: 1.12 },
    { product: "LPDDR4 16Gb", specification: "移动内存", high: "$12.40", low: "$10.90", average: "$11.65", change: 0.87 },
    { product: "LPDDR4 8Gb", specification: "移动内存", high: "$6.70", low: "$5.80", average: "$6.22", change: 0.65 },
    { product: "LPDDR3 32Gb", specification: "移动内存", high: "$18.60", low: "$16.20", average: "$17.40", change: -0.35 },
    { product: "LPDDR3 16Gb", specification: "移动内存", high: "$9.80", low: "$8.50", average: "$9.10", change: 0 },
    { product: "LPDDR3 8Gb", specification: "移动内存", high: "$5.20", low: "$4.40", average: "$4.82", change: -0.21 },
  ] },
  { id: "mobile-contract", label: "移动 DRAM 合约", title: "移动DRAM合约报价", updatedAt: "示例报价 · 待正式数据接入", quotes: [
    { product: "LPDDR5X 16GB", specification: "Mobile", high: "$78.00", low: "$70.00", average: "$74.00", change: 4.23 },
    { product: "LPDDR5X 12GB", specification: "Mobile", high: "$62.00", low: "$55.00", average: "$58.50", change: 3.54 },
    { product: "LPDDR5X 8GB", specification: "Mobile", high: "$44.00", low: "$38.00", average: "$41.00", change: 2.76 },
    { product: "LPDDR4X 8GB", specification: "Mobile", high: "$35.00", low: "$30.00", average: "$32.50", change: 1.56 },
    { product: "LPDDR4X 4GB", specification: "Mobile", high: "$19.00", low: "$16.00", average: "$17.50", change: 0.92 },
  ] },
];

const nandCategories: QuoteCategory[] = [
  { id: "spot", label: "NAND Flash 现货", title: "NAND Flash现货报价", updatedAt: "最新更新时间：2026年9月7日 14:40", quotes: [
    { product: "SLC 2Gb", specification: "256MBx8", high: "$4.55", low: "$4.15", average: "$4.313", change: 0.89 },
    { product: "SLC 1Gb", specification: "128MBx8", high: "$3.68", low: "$2.90", average: "$3.40", change: 0 },
    { product: "MLC 64Gb", specification: "8GBx8", high: "$54.00", low: "$33.00", average: "$39.25", change: 1.72 },
    { product: "MLC 32Gb", specification: "4GBx8", high: "$20.50", low: "$18.00", average: "$18.938", change: 1.61 },
  ] },
  { id: "contract", label: "NAND Flash 合约", title: "NAND Flash合约报价", updatedAt: "最新更新时间：2026年7月31日 09:00", quotes: [
    { product: "NAND 128Gb MLC", specification: "16Gx8", high: "$30.20", low: "$29.60", average: "$30.048", change: 4.26 },
    { product: "NAND 64Gb MLC", specification: "8Gx8", high: "$23.30", low: "$22.80", average: "$23.11", change: 8.17 },
    { product: "NAND 32Gb MLC", specification: "4Gx8", high: "$18.20", low: "$17.55", average: "$17.865", change: 4.63 },
  ] },
  { id: "wafer-spot", label: "晶圆现货", title: "NAND Flash晶圆现货报价", updatedAt: "最新更新时间：2026年9月7日 14:40", quotes: [
    { product: "512Gb TLC", specification: "Wafer", high: "$22.50", low: "$17.50", average: "$20.146", change: -2.71 },
    { product: "256Gb TLC", specification: "Wafer", high: "$19.00", low: "$14.00", average: "$16.808", change: 0 },
    { product: "128Gb TLC", specification: "Wafer", high: "$15.00", low: "$8.00", average: "$9.967", change: 0 },
  ] },
  { id: "memory-card-spot", label: "存储卡现货", title: "存储卡现货报价", updatedAt: "最新更新时间：2026年9月7日 14:40", quotes: [
    { product: "MicroSD 16GB", specification: "Memory Card", high: "$3.20", low: "$2.85", average: "$2.965", change: 0 },
    { product: "MicroSD 32GB", specification: "Memory Card", high: "$4.90", low: "$3.90", average: "$4.23", change: 0.12 },
    { product: "MicroSD 64GB", specification: "Memory Card", high: "$7.00", low: "$6.00", average: "$6.45", change: 0 },
    { product: "MicroSD 128GB", specification: "Memory Card", high: "$13.00", low: "$12.00", average: "$12.29", change: 0.12 },
  ] },
  { id: "client-ssd-contract", label: "PC 客户端 OEM SSD 合约", title: "PC客户端OEM SSD合约报价", updatedAt: "最新更新时间：2026年8月5日 11:00", quotes: [
    { product: "1TB mSATA/M.2 TLC", specification: "PCIe · Value Grade", high: "$385.00", low: "$265.00", average: "$321.00", change: null },
    { product: "512GB mSATA/M.2 TLC", specification: "PCIe · Value Grade", high: "$210.00", low: "$165.00", average: "$201.13", change: null },
    { product: "256GB mSATA/M.2 TLC", specification: "PCIe · Value Grade", high: "$160.00", low: "$110.00", average: "$128.38", change: null },
  ] },
  { id: "ssd-street", label: "SSD 零售", title: "SSD零售报价", updatedAt: "最新更新时间：2026年9月11日 13:00", quotes: [
    { product: "ADATA Ultimate SU650", specification: "SATA 6.0 Gb/s · 960GB", high: "$180.48", low: "$180.38", average: "$180.43", change: 0.09 },
    { product: "KIMTIGO TP5000", specification: "PCIe 4.0 · 1TB", high: "$150.30", low: "$115.70", average: "$133.00", change: 0 },
    { product: "Samsung 990 Pro", specification: "PCIe 4.0 x4 · 1TB", high: "$239.99", low: "$239.99", average: "$239.99", change: 0 },
    { product: "PNY CS2150", specification: "PCIe 5.0 x4 · 2TB", high: "$390.00", low: "$390.00", average: "$390.00", change: 0 },
    { product: "Silicon Power US75", specification: "PCIe 4.0 x4 · 1TB", high: "$189.97", low: "$189.97", average: "$189.97", change: 7.04 },
  ] },
  { id: "wafer-contract", label: "晶圆合约", title: "NAND Flash晶圆合约报价", updatedAt: "示例报价 · 待正式数据接入", quotes: [
    { product: "TLC 1Tb", specification: "Wafer Contract", high: "$42.00", low: "$38.00", average: "$40.10", change: 3.62 },
    { product: "TLC 512Gb", specification: "Wafer Contract", high: "$23.00", low: "$20.00", average: "$21.55", change: 2.38 },
    { product: "TLC 256Gb", specification: "Wafer Contract", high: "$17.50", low: "$14.50", average: "$15.90", change: 1.92 },
    { product: "QLC 1Tb", specification: "Wafer Contract", high: "$34.00", low: "$30.00", average: "$31.80", change: 2.25 },
  ] },
  { id: "emmc-spot", label: "eMMC 现货", title: "eMMC现货报价", updatedAt: "示例报价 · 待正式数据接入", quotes: [
    { product: "eMMC 128GB", specification: "Embedded", high: "$18.50", low: "$16.20", average: "$17.35", change: 1.76 },
    { product: "eMMC 64GB", specification: "Embedded", high: "$10.20", low: "$8.90", average: "$9.55", change: 1.17 },
    { product: "eMMC 32GB", specification: "Embedded", high: "$6.40", low: "$5.50", average: "$5.92", change: 0.68 },
    { product: "eMMC 16GB", specification: "Embedded", high: "$4.20", low: "$3.60", average: "$3.88", change: 0 },
    { product: "eMMC 8GB", specification: "Embedded", high: "$3.10", low: "$2.65", average: "$2.84", change: -0.35 },
    { product: "eMMC 4GB", specification: "Embedded", high: "$2.20", low: "$1.85", average: "$2.03", change: -0.49 },
  ] },
  { id: "emmc-ufs-contract", label: "eMMC/UFS 合约", title: "eMMC/UFS合约报价", updatedAt: "示例报价 · 待正式数据接入", quotes: [
    { product: "UFS 256GB", specification: "Mobile Contract", high: "$24.00", low: "$21.00", average: "$22.50", change: 3.45 },
    { product: "UFS 128GB", specification: "Mobile Contract", high: "$14.00", low: "$12.00", average: "$13.10", change: 2.34 },
    { product: "eMMC 64GB TLC", specification: "Embedded Contract", high: "$10.50", low: "$9.00", average: "$9.75", change: 1.56 },
    { product: "eMMC 32GB TLC", specification: "Embedded Contract", high: "$6.50", low: "$5.60", average: "$6.05", change: 1.17 },
    { product: "eMMC 16GB MLC", specification: "Embedded Contract", high: "$5.00", low: "$4.20", average: "$4.60", change: 0.88 },
    { product: "eMMC 8GB MLC", specification: "Embedded Contract", high: "$3.40", low: "$2.90", average: "$3.15", change: 0 },
  ] },
];

const categories: Record<MemoryMarket, QuoteCategory[]> = { dram: dramCategories, nand: nandCategories };

export function MemoryMarketBoard() {
  const [market, setMarket] = useState<MemoryMarket>("dram");
  const [categoryId, setCategoryId] = useState("spot");
  const currentCategory = categories[market].find((category) => category.id === categoryId) ?? categories[market][0];

  const selectMarket = (nextMarket: MemoryMarket) => {
    setMarket(nextMarket);
    setCategoryId("spot");
  };

  return (
    <div className="memory-board">
      <div className="memory-board-toolbar">
        <div className="memory-market-tabs" role="tablist" aria-label="内存市场">
          <button className={market === "dram" ? "active" : ""} onClick={() => selectMarket("dram")} role="tab" aria-selected={market === "dram"}><Database />DRAM</button>
          <button className={market === "nand" ? "active" : ""} onClick={() => selectMarket("nand")} role="tab" aria-selected={market === "nand"}><HardDrive />NAND Flash</button>
        </div>
      </div>
      <div className="memory-category-scroll">
        <div className="memory-category-tabs" role="tablist" aria-label={`${market === "dram" ? "DRAM" : "NAND Flash"} 报价分类`}>
          {categories[market].map((category) => (
            <button className={currentCategory.id === category.id ? "active" : ""} key={category.id} onClick={() => setCategoryId(category.id)} role="tab" aria-selected={currentCategory.id === category.id}>
              {category.label}
            </button>
          ))}
        </div>
      </div>
      <div className="memory-board-meta">
        <div><strong>{currentCategory.title}</strong>{currentCategory.schedule ? <small>{currentCategory.schedule}</small> : null}</div>
        <span>{currentCategory.updatedAt}</span>
      </div>
      <div className="memory-table-scroll">
        <div className="memory-table">
          <div className="memory-table-row memory-table-head"><span>产品</span><span>最高</span><span>最低</span><span>均价</span><span>涨跌</span></div>
          {currentCategory.quotes.map((quote) => (
            <div className="memory-table-row" key={`${market}-${currentCategory.id}-${quote.product}-${quote.specification}`}>
              <span><strong>{quote.product}</strong><small>{quote.specification}</small></span>
              <span>{quote.high}</span><span>{quote.low}</span><span className="memory-average">{quote.average}</span>
              <span className={quote.change === null ? "" : quote.change >= 0 ? "positive" : "negative"}>{quote.change === null ? "—" : `${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}%`}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="memory-demo-note">Demo 报价 · 正式数据接入后按产品规格与有效报价期同步更新</p>
    </div>
  );
}
