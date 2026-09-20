"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ranges = { "7D": 7, "30D": 30, "90D": 90, "全部": Infinity } as const;
type Range = keyof typeof ranges;

export function IndexHistoryChart({ history, name }: { history: Array<{ date: string; value: number }>; name: string }) {
  const [range, setRange] = useState<Range>("7D");
  const visible = useMemo(() => {
    const days = ranges[range];
    if (!Number.isFinite(days)) return history;
    const latest = new Date(`${history.at(-1)?.date}T00:00:00Z`).getTime();
    const cutoff = latest - (days - 1) * 86400000;
    return history.filter((point) => new Date(`${point.date}T00:00:00Z`).getTime() >= cutoff);
  }, [history, range]);
  const values = visible.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, 0.02);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const points = visible.map((point, index) => ({
    ...point,
    x: visible.length === 1 ? 460 : (index / (visible.length - 1)) * 920,
    y: 250 - ((point.value - chartMin) / (chartMax - chartMin)) * 210,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const labels = [0, 0.25, 0.5, 0.75, 1].map((ratio) => visible[Math.round((visible.length - 1) * ratio)]);
  const start = visible.at(0)?.date.replaceAll("-", ".");
  const end = visible.at(-1)?.date.replaceAll("-", ".");

  return (
    <>
      <div className="detail-chart-controls">
        <span>{start} 至 {end}</span>
        <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
          <TabsList>{Object.keys(ranges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList>
        </Tabs>
      </div>
      <div className="detail-chart-wrap">
        <div className="detail-y"><span>{chartMax.toFixed(2)}</span><span>{((chartMax + chartMin) / 2).toFixed(2)}</span><span>{chartMin.toFixed(2)}</span></div>
        <svg viewBox="0 0 920 270" preserveAspectRatio="none" role="img" aria-label={`${name} ${range} 历史走势`}>
          <defs><linearGradient id="detail-index-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52d6b0" stopOpacity="0.25" /><stop offset="1" stopColor="#52d6b0" stopOpacity="0" /></linearGradient></defs>
          {[40, 145, 250].map((y) => <line key={y} x1="0" y1={y} x2="920" y2={y} className="grid-line" />)}
          <polygon points={`0,260 ${line} 920,260`} fill="url(#detail-index-area)" />
          <polyline points={line} fill="none" stroke="#52d6b0" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="920" y1="30" x2="920" y2="260" stroke="#52d6b0" strokeDasharray="4 5" opacity=".45" />
          <circle cx={points.at(-1)?.x} cy={points.at(-1)?.y} r="5" fill="#08120f" stroke="#52d6b0" strokeWidth="2.5" />
        </svg>
        <div className="detail-x">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{point.date.replaceAll("-", ".")}</span>)}</div>
        <div className="detail-chart-stats"><span>{visible.length} 个数据点</span><span>区间最低 <b>${min.toFixed(3)}</b></span><span>区间最高 <b>${max.toFixed(3)}</b></span></div>
      </div>
    </>
  );
}
