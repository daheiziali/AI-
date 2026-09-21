"use client";

import { Activity, BarChart3, Cpu, Database, Layers } from "lucide-react";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";

type SignalKey = "spot-contract" | "gddr-ddr" | "dram-nand" | "gpu-memory" | "token-hardware";

type SignalDefinition = {
  key: SignalKey;
  name: string;
  status: string;
  change: string;
  tone: "positive" | "warning" | "neutral";
  summary: string;
  primaryLabel: string;
  secondaryLabel: string;
  lowerLabel: string;
  lowerUnit: string;
  icon: typeof Activity;
  primary: number[];
  secondary: number[];
  lower: number[];
};

const dates = ["06/30", "07/07", "07/14", "07/21", "07/28", "08/04", "08/11", "08/18", "08/25", "09/01", "09/08", "09/15"];

const signals: SignalDefinition[] = [
  {
    key: "spot-contract",
    name: "现货－合约价差",
    status: "价差扩大",
    change: "+4.2%",
    tone: "warning",
    summary: "现货价格领先合约价上行，短期采购成本压力增强。",
    primaryLabel: "DRAM现货",
    secondaryLabel: "DRAM合约",
    lowerLabel: "现货溢价",
    lowerUnit: "%",
    icon: Layers,
    primary: [100, 99, 101, 103, 105, 108, 110, 111, 114, 118, 121, 124],
    secondary: [100, 100, 100, 101, 102, 103, 104, 106, 107, 109, 111, 113],
    lower: [0, -1, 1, 2, 3, 5, 6, 5, 7, 9, 10, 11],
  },
  {
    key: "gddr-ddr",
    name: "GDDR6－DDR5相对走势",
    status: "显存走强",
    change: "+2.8%",
    tone: "positive",
    summary: "显存价格表现强于服务器内存，AI硬件需求仍更集中。",
    primaryLabel: "GDDR6",
    secondaryLabel: "DDR5",
    lowerLabel: "相对强弱",
    lowerUnit: "",
    icon: Cpu,
    primary: [100, 101, 102, 104, 103, 106, 109, 111, 113, 114, 117, 120],
    secondary: [100, 100, 101, 102, 103, 104, 105, 106, 108, 109, 110, 111],
    lower: [100, 101, 101, 102, 100, 102, 104, 105, 105, 105, 106, 108],
  },
  {
    key: "dram-nand",
    name: "DRAM－NAND相对走势",
    status: "出现背离",
    change: "DRAM更强",
    tone: "warning",
    summary: "内存与闪存周期开始分化，DRAM价格动能暂时领先。",
    primaryLabel: "DRAM",
    secondaryLabel: "NAND",
    lowerLabel: "周期差",
    lowerUnit: "点",
    icon: Database,
    primary: [100, 101, 103, 105, 104, 107, 109, 112, 115, 118, 121, 123],
    secondary: [100, 102, 104, 105, 106, 106, 105, 104, 103, 104, 105, 106],
    lower: [0, -1, -1, 0, -2, 1, 4, 8, 12, 14, 16, 17],
  },
  {
    key: "gpu-memory",
    name: "GPU租赁－内存成本联动",
    status: "联动增强",
    change: "0.63",
    tone: "neutral",
    summary: "GPU租赁价格与内存成本同向变化，成本传导迹象增强。",
    primaryLabel: "GPU租赁",
    secondaryLabel: "内存成本",
    lowerLabel: "90日相关系数",
    lowerUnit: "",
    icon: Activity,
    primary: [100, 102, 101, 104, 106, 105, 109, 111, 110, 114, 116, 119],
    secondary: [100, 99, 101, 102, 105, 104, 107, 109, 111, 112, 115, 118],
    lower: [0.18, 0.22, 0.25, 0.31, 0.39, 0.42, 0.48, 0.52, 0.55, 0.58, 0.61, 0.63],
  },
  {
    key: "token-hardware",
    name: "Token价格－硬件成本背离",
    status: "降价快于硬件",
    change: "−7.4%",
    tone: "positive",
    summary: "推理价格继续下行，但底层硬件成本尚未同步下降。",
    primaryLabel: "Token价格",
    secondaryLabel: "硬件成本",
    lowerLabel: "背离度",
    lowerUnit: "%",
    icon: BarChart3,
    primary: [100, 98, 96, 95, 93, 91, 90, 88, 87, 85, 84, 82],
    secondary: [100, 101, 100, 102, 103, 104, 105, 105, 106, 108, 109, 110],
    lower: [0, -1, -2, -3, -4, -5, -5.5, -6, -6.2, -6.7, -7, -7.4],
  },
];

const linePoints = (values: number[], min: number, max: number, top: number, height: number) =>
  values.map((value, index) => `${48 + (index / (values.length - 1)) * 780},${top + height - ((value - min) / (max - min || 1)) * height}`).join(" ");

function MiniTrend({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 92},${28 - ((value - min) / (max - min || 1)) * 24}`).join(" ");
  return <svg viewBox="0 0 92 32" aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CompositeChart({ signal }: { signal: SignalDefinition }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const primaryMin = Math.min(...signal.primary, ...signal.secondary);
  const primaryMax = Math.max(...signal.primary, ...signal.secondary);
  const margin = Math.max((primaryMax - primaryMin) * 0.12, 2);
  const chartMin = primaryMin - margin;
  const chartMax = primaryMax + margin;
  const lowerMin = Math.min(0, ...signal.lower);
  const lowerMax = Math.max(0, ...signal.lower);
  const selectedIndex = hovered ?? signal.primary.length - 1;
  const selectedX = 48 + (selectedIndex / (signal.primary.length - 1)) * 780;
  const primaryLine = useMemo(() => linePoints(signal.primary, chartMin, chartMax, 32, 148), [signal, chartMin, chartMax]);
  const secondaryLine = useMemo(() => linePoints(signal.secondary, chartMin, chartMax, 32, 148), [signal, chartMin, chartMax]);
  const lowerLine = useMemo(() => linePoints(signal.lower, lowerMin, lowerMax, 220, 52), [signal, lowerMin, lowerMax]);
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    setHovered(Math.round(ratio * (signal.primary.length - 1)));
  };

  return (
    <div className="cross-chart-shell">
      <div className="cross-chart-head">
        <div><span><i className="line-a" />{signal.primaryLabel}</span><span><i className="line-b" />{signal.secondaryLabel}</span></div>
        <p>{signal.summary}</p>
      </div>
      <div className="cross-chart">
        <svg viewBox="0 0 860 300" preserveAspectRatio="none" onPointerMove={handlePointerMove} onPointerLeave={() => setHovered(null)} role="img" aria-label={`${signal.name}近90日复合走势`}>
          {[32, 106, 180].map((y) => <line key={y} x1="48" x2="828" y1={y} y2={y} className="cross-grid" />)}
          <line x1="48" x2="828" y1="211" y2="211" className="cross-divider" />
          <polyline points={primaryLine} className="cross-primary" />
          <polyline points={secondaryLine} className="cross-secondary" />
          <polyline points={lowerLine} className="cross-lower" />
          {hovered !== null && <line x1={selectedX} x2={selectedX} y1="25" y2="278" className="cross-cursor" />}
          <circle cx={selectedX} cy={32 + 148 - ((signal.primary[selectedIndex] - chartMin) / (chartMax - chartMin)) * 148} r="4" className="cross-point-a" />
          <circle cx={selectedX} cy={32 + 148 - ((signal.secondary[selectedIndex] - chartMin) / (chartMax - chartMin)) * 148} r="4" className="cross-point-b" />
        </svg>
        <span className="cross-y-label top">基期 100</span>
        <span className="cross-y-label lower">{signal.lowerLabel}</span>
        <div className="cross-dates"><span>{dates[0]}</span><span>{dates[3]}</span><span>{dates[6]}</span><span>{dates[9]}</span><span>{dates[11]}</span></div>
        {hovered !== null && (
          <div className={`cross-tooltip ${selectedIndex > 7 ? "align-right" : ""}`} style={{ left: `${(selectedX / 860) * 100}%` }}>
            <span>2026/{dates[selectedIndex]}</span>
            <strong>{signal.primaryLabel} {signal.primary[selectedIndex].toFixed(1)}</strong>
            <b>{signal.secondaryLabel} {signal.secondary[selectedIndex].toFixed(1)}</b>
            <small>{signal.lowerLabel} {signal.lower[selectedIndex]}{signal.lowerUnit}</small>
          </div>
        )}
      </div>
      <div className="cross-chart-foot"><span>近90日</span><span>最新：{signal.change}</span><span>2026.09.19 更新</span></div>
    </div>
  );
}

export function CrossMarketSignals() {
  const [active, setActive] = useState<SignalKey>("spot-contract");
  const selected = signals.find((signal) => signal.key === active) ?? signals[0];

  return (
    <section id="cross-market" className="section-block cross-market-section">
      <div className="section-head cross-market-head">
        <div><p className="eyebrow">CROSS-MARKET SIGNALS</p><h3>跨市场信号</h3></div>
        <span><i />Demo 数据 · 2026.09.19</span>
      </div>
      <div className="cross-signal-grid" role="tablist" aria-label="跨市场信号">
        {signals.map((signal) => {
          const Icon = signal.icon;
          return (
            <button key={signal.key} className={active === signal.key ? "active" : ""} onClick={() => setActive(signal.key)} role="tab" aria-selected={active === signal.key}>
              <span className="cross-card-top"><i><Icon /></i><em className={signal.tone}>{signal.status}</em></span>
              <strong>{signal.name}</strong>
              <span className="cross-card-bottom"><b>{signal.change}</b><MiniTrend values={signal.lower} /></span>
            </button>
          );
        })}
      </div>
      <CompositeChart signal={selected} />
    </section>
  );
}
