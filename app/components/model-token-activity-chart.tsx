"use client";

import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTokenVolume, type ModelTokenPoint } from "@/app/data/llm-models";

const ranges = { "3D": 3, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "全部": Infinity } as const;
type Range = keyof typeof ranges;

export function ModelTokenActivityChart({ activity, name }: { activity: ModelTokenPoint[]; name: string }) {
  const [range, setRange] = useState<Range>("1W");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const visible = useMemo(() => {
    const days = ranges[range];
    if (!Number.isFinite(days)) return activity;
    const latest = new Date(`${activity.at(-1)?.date}T00:00:00Z`).getTime();
    const cutoff = latest - (days - 1) * 86400000;
    return activity.filter((point) => new Date(`${point.date}T00:00:00Z`).getTime() >= cutoff);
  }, [activity, range]);
  const totals = visible.map((point) => point.prompt + point.reasoning + point.completion);
  const max = Math.max(...totals);
  const selected = hoveredIndex === null ? visible.at(-1) : visible[hoveredIndex];
  const labels = [0, 0.5, 1].map((ratio) => visible[Math.round((visible.length - 1) * ratio)]);
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    setHoveredIndex(Math.round(ratio * (visible.length - 1)));
  };

  return (
    <>
      <div className="detail-chart-controls model-chart-controls">
        <span>{visible.at(0)?.date.replaceAll("-", ".")} 至 {visible.at(-1)?.date.replaceAll("-", ".")}</span>
        <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
          <TabsList>{Object.keys(ranges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList>
        </Tabs>
      </div>
      <div className="model-token-wrap">
        <div className="token-chart-main">
          <div className="detail-y"><span>{formatTokenVolume(max)}</span><span>{formatTokenVolume(max / 2)}</span><span>0</span></div>
          <svg viewBox="0 0 920 270" preserveAspectRatio="none" role="img" aria-label={`${name} Token 活跃度`} onPointerMove={handlePointerMove} onPointerLeave={() => setHoveredIndex(null)}>
            {[35, 122, 209].map((y) => <line key={y} x1="0" y1={y} x2="920" y2={y} className="grid-line" />)}
            {visible.map((point, index) => {
              const width = Math.min(58, 720 / visible.length);
              const gap = visible.length === 1 ? 0 : (920 - width) / (visible.length - 1);
              const x = visible.length === 1 ? 431 : index * gap;
              const total = point.prompt + point.reasoning + point.completion;
              const totalHeight = (total / max) * 220;
              const promptHeight = (point.prompt / total) * totalHeight;
              const reasoningHeight = (point.reasoning / total) * totalHeight;
              const completionHeight = (point.completion / total) * totalHeight;
              const base = 250;
              return (
                <g key={point.date} opacity={point.estimated ? 0.58 : 1}>
                  <rect x={x} y={base - promptHeight} width={width} height={promptHeight} rx="2" fill="#4b8df7" />
                  <rect x={x} y={base - promptHeight - reasoningHeight} width={width} height={Math.max(2, reasoningHeight)} fill="#ff4f76" />
                  <rect x={x} y={base - promptHeight - reasoningHeight - completionHeight} width={width} height={Math.max(2, completionHeight)} fill="#a766ff" />
                  {hoveredIndex === index && <rect x={x - 4} y={20} width={width + 8} height={240} rx="4" fill="none" stroke="#78e2c3" strokeDasharray="3 4" />}
                </g>
              );
            })}
          </svg>
          {hoveredIndex !== null && selected && <div className="chart-tooltip model-token-tooltip"><span>{selected.date.replaceAll("-", ".")}</span><strong>{formatTokenVolume(selected.prompt + selected.reasoning + selected.completion)}</strong><small>Token 总量{selected.estimated ? " · 估算" : ""}</small></div>}
          <div className="detail-x">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{point.date.slice(5).replace("-", "/")}</span>)}</div>
        </div>
        <aside className="token-legend-panel">
          <p><i className="prompt" />Prompt <b>{selected ? formatTokenVolume(selected.prompt) : "-"}</b></p>
          <p><i className="reasoning" />Reasoning <b>{selected ? formatTokenVolume(selected.reasoning) : "-"}</b></p>
          <p><i className="completion" />Completion <b>{selected ? formatTokenVolume(selected.completion) : "-"}</b></p>
          <small>Prompt 代表输入规模，Reasoning 代表中间推理消耗，Completion 代表输出长度。</small>
        </aside>
      </div>
    </>
  );
}
