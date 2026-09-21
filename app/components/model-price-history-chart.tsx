"use client";

import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ModelPricePoint } from "@/app/data/llm-models";

const ranges = { "3D": 3, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "全部": Infinity } as const;
type Range = keyof typeof ranges;
type PriceMode = "effective" | "listed";
type Direction = "input" | "output";

const priceKey: Record<`${PriceMode}-${Direction}`, keyof ModelPricePoint> = {
  "effective-input": "effectiveInput",
  "effective-output": "effectiveOutput",
  "listed-input": "listedInput",
  "listed-output": "listedOutput",
};

export function ModelPriceHistoryChart({ history, name }: { history: ModelPricePoint[]; name: string }) {
  const [range, setRange] = useState<Range>("1W");
  const [mode, setMode] = useState<PriceMode>("effective");
  const [direction, setDirection] = useState<Direction>("input");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const key = priceKey[`${mode}-${direction}`];
  const visible = useMemo(() => {
    const days = ranges[range];
    if (!Number.isFinite(days)) return history;
    const latest = new Date(`${history.at(-1)?.date}T00:00:00Z`).getTime();
    const cutoff = latest - (days - 1) * 86400000;
    return history.filter((point) => new Date(`${point.date}T00:00:00Z`).getTime() >= cutoff);
  }, [history, range]);
  const values = visible.map((point) => Number(point[key]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.16, 0.01);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const points = visible.map((point, index) => ({
    ...point,
    value: Number(point[key]),
    x: visible.length === 1 ? 460 : (index / (visible.length - 1)) * 920,
    y: 250 - ((Number(point[key]) - chartMin) / (chartMax - chartMin)) * 210,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const labels = [0, 0.5, 1].map((ratio) => visible[Math.round((visible.length - 1) * ratio)]);
  const selected = hoveredIndex === null ? points.at(-1) : points[hoveredIndex];
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    setHoveredIndex(Math.round(ratio * (points.length - 1)));
  };

  return (
    <>
      <div className="model-price-toolbar">
        <div className="model-mode-tabs" aria-label="价格口径">
          <button className={mode === "effective" ? "active" : ""} onClick={() => setMode("effective")}>Effective<span>有效价</span></button>
          <button className={mode === "listed" ? "active" : ""} onClick={() => setMode("listed")}>Listed<span>挂牌价</span></button>
        </div>
        <div className="model-mode-tabs" aria-label="Token方向">
          <button className={direction === "input" ? "active" : ""} onClick={() => setDirection("input")}>Input<span>输入</span></button>
          <button className={direction === "output" ? "active" : ""} onClick={() => setDirection("output")}>Output<span>输出</span></button>
        </div>
        <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
          <TabsList>{Object.keys(ranges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList>
        </Tabs>
      </div>
      <div className="detail-chart-wrap model-price-wrap">
        <div className="detail-y"><span>{chartMax.toFixed(2)}</span><span>{((chartMax + chartMin) / 2).toFixed(2)}</span><span>{chartMin.toFixed(2)}</span></div>
        <svg viewBox="0 0 920 270" preserveAspectRatio="none" role="img" aria-label={`${name} 价格历史`} onPointerMove={handlePointerMove} onPointerLeave={() => setHoveredIndex(null)}>
          {[40, 145, 250].map((y) => <line key={y} x1="0" y1={y} x2="920" y2={y} className="grid-line" />)}
          <polygon points={`0,260 ${line} 920,260`} fill="#1487ba" opacity="0.10" />
          <polyline points={line} fill="none" stroke="#1487ba" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          {hoveredIndex !== null && <line x1={selected?.x} y1="30" x2={selected?.x} y2="260" stroke="#d2b4ff" strokeDasharray="3 4" opacity=".65" />}
          <circle cx={selected?.x} cy={selected?.y} r={hoveredIndex === null ? 4 : 5} fill="#08110f" stroke="#d2b4ff" strokeWidth="2.5" />
        </svg>
        {hoveredIndex !== null && selected && <div className={`chart-tooltip detail-tooltip purple ${selected.x > 736 ? "align-right" : ""}`} style={{ left: `${(selected.x / 920) * 100}%`, top: `${(selected.y / 270) * 100}%` }}><span>{selected.date.replaceAll("-", ".")}</span><strong>{selected.value.toFixed(4)}</strong><small>美元/百万Tokens</small></div>}
        <div className="detail-x">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{point.date.slice(5).replace("-", "/")}</span>)}</div>
        <div className="detail-chart-stats"><span>{visible.length} 个价格点</span><span>区间最低 <b>{min.toFixed(3)}</b></span><span>区间最高 <b>{max.toFixed(3)}</b></span></div>
      </div>
    </>
  );
}
