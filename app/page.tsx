"use client";

import {
  Activity, ArrowRight, BarChart3, Bell, ChevronDown, Command, Cpu, Database,
  Home as HomeIcon, Menu, Search, Server, Settings, Sparkles, Star, TrendingDown, TrendingUp,
} from "lucide-react";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrossMarketSignals } from "@/app/components/cross-market-signals";
import { gpuIndices, ramIndices, tokenIndices, type IndexDefinition } from "@/app/data/indices";
import { getRankedModels, modelRankingWindows, type ModelRankingWindow } from "@/app/data/llm-models";
import { tokenHistory } from "@/app/data/token-history";

const historyRanges = { "7D": 7, "30D": 30, "90D": 90, "全部": Infinity } as const;
type HistoryRange = keyof typeof historyRanges;

type DataCenterMetric = "compute" | "power" | "cost";

const dataCenterMetrics: Record<DataCenterMetric, { label: string; short: string; unit: string }> = {
  compute: { label: "算力", short: "H100 等效", unit: "H100e" },
  power: { label: "IT 实力", short: "IT Power", unit: "MW" },
  cost: { label: "成本", short: "建设成本", unit: "USD" },
};

const dataCenterRankings = [
  { name: "Colossus 2", owner: "xAI", country: "United States", year: "2026", compute: 1110, power: 946, cost: 35.8, computeLabel: "1.11M", powerLabel: "946MW", costLabel: "$35.8B" },
  { name: "Microsoft Fairwater Atlanta", owner: "Microsoft", country: "United States", year: "2026", compute: 769, power: 636, cost: 24.1, computeLabel: "769k", powerLabel: "636MW", costLabel: "$24.1B" },
  { name: "Anthropic-Amazon New Carlisle", owner: "Amazon", country: "United States", year: "2026", compute: 686, power: 910, cost: 34.5, computeLabel: "686k", powerLabel: "910MW", costLabel: "$34.5B" },
  { name: "Meta Prometheus", owner: "Meta", country: "United States", year: "2026", compute: 680, power: 562, cost: 21.3, computeLabel: "680k", powerLabel: "562MW", costLabel: "$21.3B" },
  { name: "Google Pryor North", owner: "Google", country: "United States", year: "2026", compute: 637, power: 368, cost: 13.9, computeLabel: "637k", powerLabel: "368MW", costLabel: "$13.9B" },
  { name: "OpenAI Stargate Abilene", owner: "Oracle", country: "United States", year: "2026", compute: 509, power: 421, cost: 15.9, computeLabel: "509k", powerLabel: "421MW", costLabel: "$15.9B" },
  { name: "Meta Hyperion", owner: "Meta", country: "United States", year: "2025", compute: 402, power: 351, cost: 11.6, computeLabel: "402k", powerLabel: "351MW", costLabel: "$11.6B" },
  { name: "Google Fort Wayne", owner: "Google", country: "United States", year: "2025", compute: 365, power: 285, cost: 9.8, computeLabel: "365k", powerLabel: "285MW", costLabel: "$9.8B" },
  { name: "Microsoft Wisconsin AI Zone", owner: "Microsoft", country: "United States", year: "2025", compute: 352, power: 328, cost: 10.4, computeLabel: "352k", powerLabel: "328MW", costLabel: "$10.4B" },
  { name: "CoreWeave Lancaster", owner: "CoreWeave", country: "United States", year: "2025", compute: 286, power: 274, cost: 7.8, computeLabel: "286k", powerLabel: "274MW", costLabel: "$7.8B" },
  { name: "Oracle Salt Lake AI", owner: "Oracle", country: "United States", year: "2024", compute: 248, power: 212, cost: 6.2, computeLabel: "248k", powerLabel: "212MW", costLabel: "$6.2B" },
  { name: "Tesla Cortex", owner: "Tesla", country: "United States", year: "2024", compute: 216, power: 186, cost: 5.1, computeLabel: "216k", powerLabel: "186MW", costLabel: "$5.1B" },
];

function DataCenterPanel() {
  const [metric, setMetric] = useState<DataCenterMetric>("compute");
  const [expanded, setExpanded] = useState(false);
  const ranked = [...dataCenterRankings].sort((a, b) => b[metric] - a[metric]);
  const visible = expanded ? ranked : ranked.slice(0, 10);
  const max = ranked[0][metric];
  const labelFor = (item: (typeof dataCenterRankings)[number]) => metric === "compute" ? item.computeLabel : metric === "power" ? item.powerLabel : item.costLabel;
  const axisMax = metric === "compute" ? "1.5M" : metric === "power" ? "1GW" : "$40B";
  const axisMid = metric === "compute" ? "750K" : metric === "power" ? "500MW" : "$20B";

  return (
    <article className="epoch-panel data-center-panel" id="data-centers">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI DATA CENTER RANKING</p><h4>AI数据中心排行</h4></div><span>日更观察</span></div>
      <div className="ranking-tabs dc-tabs" aria-label="数据中心维度">{(Object.keys(dataCenterMetrics) as DataCenterMetric[]).map((key) => <button key={key} className={metric === key ? "active" : ""} onClick={() => setMetric(key)}>{dataCenterMetrics[key].label}</button>)}</div>
      <div className="dc-chart-scroll">
        <div className="dc-bar-chart">
          <div className="dc-axis-title">{dataCenterMetrics[metric].short}（{dataCenterMetrics[metric].unit}）</div>
          <div className="dc-value-axis"><span>0</span><span>{axisMid}</span><span>{axisMax}</span></div>
          <div className="dc-bars" aria-label={`${dataCenterMetrics[metric].label}排行`}>
            {visible.map((item, index) => (
              <div className="dc-bar-row" key={`${metric}-${item.name}`}>
                <div className="dc-bar-name"><b>{index + 1}</b><span>{item.name}<small>{item.owner} · {item.year}</small></span></div>
                <div className="dc-bar-lane">
                  <i style={{ width: `${Math.max(8, (item[metric] / max) * 100)}%` }} />
                  <strong>{labelFor(item)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="dc-time-axis">
            <button aria-label="播放时间轴"><span /></button>
            <div><strong>Q1 2023</strong><i><em style={{ left: "50%" }} /></i><strong>Q1 2030</strong></div>
          </div>
          <div className="dc-year-axis"><span>2023</span><span>2024</span><span>2025</span><span>今日</span><span>2027</span><span>2028</span><span>2029</span><span>2030</span></div>
        </div>
      </div>
      <div className="dc-panel-actions"><button onClick={() => setExpanded((current) => !current)}>{expanded ? "收起" : "展开全部"} <ArrowRight /></button></div>
    </article>
  );
}

const modelLogoText = (name: string) => name.split(/[\s.-]+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function ModelLogo({ name, provider }: { name: string; provider: string }) {
  return (
    <span className={`model-logo provider-${provider.replace(/[^a-z0-9]/g, "")}`}>{modelLogoText(name)}</span>
  );
}

function LlmModelPanel({ window, setWindow }: { window: ModelRankingWindow; setWindow: (value: ModelRankingWindow) => void }) {
  const [expanded, setExpanded] = useState(false);
  const models = getRankedModels(window);
  const visible = expanded ? models : models.slice(0, 20);
  const columns = [visible.filter((_, index) => index % 2 === 0), visible.filter((_, index) => index % 2 === 1)];
  return (
    <article className="epoch-panel model-panel" id="llm-models">
      <div className="epoch-panel-head">
        <div><p className="eyebrow">LLM MODEL RANKING</p><h4>LLM模型算力消耗排行</h4></div>
        <span>OpenRouter</span>
      </div>
      <div className="model-ranking-top">
        <Tabs value={window} onValueChange={(value) => setWindow(value as ModelRankingWindow)}>
          <TabsList>{Object.entries(modelRankingWindows).map(([key, label]) => <TabsTrigger key={key} value={key}>{label}</TabsTrigger>)}</TabsList>
        </Tabs>
        <p>按 Token 消耗量排序，默认展示最近完整日数据。</p>
      </div>
      <div className="model-board">
        {columns.map((column, columnIndex) => (
          <div className="model-column" key={columnIndex}>
            {column.map((model, localIndex) => {
              const rank = localIndex * 2 + columnIndex + 1;
              return (
                <a className="model-board-row" href={`/models/${model.slug}`} key={model.slug}>
                  <b>{rank}</b>
                  <ModelLogo name={model.name} provider={model.provider} />
                  <span><strong>{model.name}</strong><small>{model.providerLabel}</small></span>
                  <em>{model.ranking[window].display}</em>
                  <i className={model.ranking[window].change >= 0 ? "positive" : "negative"}>{model.ranking[window].change >= 0 ? "+" : ""}{model.ranking[window].change}%</i>
                </a>
              );
            })}
          </div>
        ))}
      </div>
      {models.length > 20 && <div className="dc-panel-actions"><button onClick={() => setExpanded((current) => !current)}>{expanded ? "收起" : "展示全部"} <ArrowRight /></button></div>}
    </article>
  );
}

function TokenHistoryChart() {
  const [range, setRange] = useState<HistoryRange>("30D");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const visible = useMemo(() => {
    const days = historyRanges[range];
    if (!Number.isFinite(days)) return tokenHistory;
    const latest = new Date(`${tokenHistory.at(-1)?.date}T00:00:00Z`).getTime();
    const cutoff = latest - (days - 1) * 86400000;
    return tokenHistory.filter((point) => new Date(`${point.date}T00:00:00Z`).getTime() >= cutoff);
  }, [range]);
  const values = visible.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.14, 0.015);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const points = visible.map((point, index) => ({
    ...point,
    x: visible.length === 1 ? 380 : (index / (visible.length - 1)) * 760,
    y: 205 - ((point.value - chartMin) / (chartMax - chartMin)) * 175,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const labels = [0, 0.25, 0.5, 0.75, 1].map((ratio) => visible[Math.min(visible.length - 1, Math.round((visible.length - 1) * ratio))]);
  const formatDate = (date: string) => date.slice(5).replace("-", "/");
  const selected = hoveredIndex === null ? points.at(-1) : points[hoveredIndex];
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    setHoveredIndex(Math.round(ratio * (points.length - 1)));
  };

  return (
    <div className="history-chart">
      <div className="chart-toolbar">
        <div className="legend"><span><i className="dot cpi" />AI算力CPI · 美元/百万Tokens</span></div>
        <Tabs value={range} onValueChange={(value) => setRange(value as HistoryRange)}><TabsList>{Object.keys(historyRanges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></Tabs>
      </div>
      <div className="history-plot">
        <div className="history-y" aria-hidden="true"><span>{chartMax.toFixed(2)}</span><span>{((chartMax + chartMin) / 2).toFixed(2)}</span><span>{chartMin.toFixed(2)}</span></div>
        <svg viewBox="0 0 760 225" preserveAspectRatio="none" role="img" aria-label={`AI算力CPI ${range} 历史价格走势，最新值 ${points.at(-1)?.value.toFixed(4)}`} onPointerMove={handlePointerMove} onPointerLeave={() => setHoveredIndex(null)}>
          <defs><linearGradient id="token-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52d6b0" stopOpacity="0.22" /><stop offset="1" stopColor="#52d6b0" stopOpacity="0" /></linearGradient></defs>
          {[30, 117.5, 205].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} className="grid-line" />)}
          <polygon points={`0,215 ${line} 760,215`} fill="url(#token-area)" />
          <polyline points={line} fill="none" stroke="#52d6b0" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          {hoveredIndex !== null && <line x1={selected?.x} y1="20" x2={selected?.x} y2="215" stroke="#78e2c3" strokeDasharray="3 4" opacity=".65" />}
          <circle cx={selected?.x} cy={selected?.y} r={hoveredIndex === null ? 4 : 5} fill="#08120f" stroke="#78e2c3" strokeWidth="2.5" />
        </svg>
        {hoveredIndex !== null && selected && <div className={`chart-tooltip ${selected.x > 600 ? "align-right" : ""}`} style={{ left: `${(selected.x / 760) * 100}%`, top: `${(selected.y / 225) * 100}%` }}><span>{selected.date.replaceAll("-", ".")}</span><strong>${selected.value.toFixed(4)}</strong><small>美元/百万Tokens</small></div>}
        <div className="history-x" aria-hidden="true">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{formatDate(point.date)}</span>)}</div>
      </div>
      <div className="chart-summary"><span>{visible.length} 个观测值</span><span>区间最低 <b>${min.toFixed(3)}</b></span><span>区间最高 <b>${max.toFixed(3)}</b></span></div>
    </div>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["AI算力CPI", "H100"]);
  const [modelWindow, setModelWindow] = useState<ModelRankingWindow>("day");

  const toggleFavorite = (name: string) => {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const renderIndexCard = (item: IndexDefinition) => (
    <article className="index-card" key={item.code}>
      <div className="card-top"><div><h4>{item.name}</h4><span>{item.code}</span></div><button className={favorites.includes(item.name) ? "is-favorite" : ""} onClick={() => toggleFavorite(item.name)} aria-label={`收藏 ${item.name}`} aria-pressed={favorites.includes(item.name)}><Star /></button></div>
      <div className="card-value"><div><strong>{item.value}</strong><span>{item.unit}</span><p className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? <TrendingUp /> : <TrendingDown />}{Math.abs(item.change)}% <em>vs 7D</em></p></div><a className="card-detail-link" href={`/indices/${item.slug}`}>详情 <ArrowRight /></a></div>
    </article>
  );

  return (
    <div className="app-frame">
      <aside className={`sidebar ${navOpen ? "is-open" : ""}`}>
        <div className="brand"><span className="brand-mark"><Activity /></span><span>AI Dashboard</span></div>
        <nav aria-label="主要导航">
          <p className="nav-label">AI算力市场</p>
          <a className="nav-item active" href="#overview"><Sparkles />AI算力CPI</a>
          <a className="nav-item" href="#gpu"><Cpu />GPU租赁价格</a>
          <a className="nav-item" href="#ram"><Database />RAM内存指数</a>
          <a className="nav-item" href="#cross-market"><Activity />跨市场信号</a>
          <p className="nav-label nav-label-spaced">AI排行榜</p>
          <a className="nav-item" href="#data-centers"><Server />AI数据中心</a>
          <a className="nav-item" href="#llm-models"><BarChart3 />LLM模型排行</a>
          <p className="nav-label nav-label-spaced">TOOLS</p>
          <a className="nav-item" href="#watch"><Star />自选</a>
          <a className="nav-item" href="#alerts"><Bell />价格预警<span className="nav-count">3</span></a>
        </nav>
        <div className="sidebar-foot"><button><Settings />设置</button><div className="account"><span>JW</span><div><strong>Jiajing Wen</strong><small>Pro · 专业版</small></div><ChevronDown /></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><Button className="mobile-menu" variant="ghost" size="icon" onClick={() => setNavOpen(!navOpen)} aria-label="打开导航"><Menu /></Button><div><p className="eyebrow">MARKET OVERVIEW</p><h1>AI 算力市场</h1></div></div>
          <div className="topbar-actions"><button className="search"><Search /><span>搜索指数、模型或数据中心</span><kbd><Command />K</kbd></button><Button variant="outline" size="icon" aria-label="通知"><Bell /></Button><span className="live"><i />数据已更新</span></div>
        </header>

        <main id="overview" className="content">
          <section className="market-head">
            <div><div className="market-title"><span className="index-chip">AI 推理价格基准</span><span>截至 2026.09.18 · 工作日更新</span></div><h2>AI算力CPI <button className={favorites.includes("AI算力CPI") ? "is-favorite" : ""} onClick={() => toggleFavorite("AI算力CPI")} aria-label="收藏 AI算力CPI" aria-pressed={favorites.includes("AI算力CPI")}><Star /></button></h2><p>以 LLM Token 支出衡量真实推理成本，覆盖模型调用的核心算力消耗，是观察 AI 推理价格变化的市场基准。</p></div>
          </section>

          <section className="hero-grid">
            <div className="hero-metric"><div className="hero-index"><span>LLM Token支出指数</span><small>SDLLMTK</small></div><p>当前价格</p><strong>$1.01</strong><div><span className="positive"><TrendingUp />3.4%</span><span>近 7 日</span></div><small>单位：美元/百万Tokens</small><a href="/indices/llm-token-expenditure">查看指数详情 <ArrowRight /></a></div>
            <div className="hero-chart"><TokenHistoryChart /></div>
          </section>

          <section id="token" className="section-block data-band token-band">
            <div className="section-head"><div><p className="eyebrow">LLM TOKEN EXPENDITURE INDEX</p><h3>开源与闭源市场</h3></div></div>
            <div className="index-grid token-grid">{tokenIndices.filter((item) => item.slug !== "llm-token-expenditure").map(renderIndexCard)}</div>
          </section>

          <section id="gpu" className="section-block">
            <div className="section-head"><div><p className="eyebrow">GPU RENTAL MARKET</p><h3>GPU 租赁价格</h3></div></div>
            <div className="index-grid">{gpuIndices.map(renderIndexCard)}</div>
          </section>

          <section id="ram" className="section-block">
            <div className="section-head"><div><p className="eyebrow">MEMORY MARKET</p><h3>RAM内存指数</h3></div></div>
            <div className="index-grid ram-grid">{ramIndices.map(renderIndexCard)}</div>
          </section>

          <section id="ai-brief" className="section-block ai-brief">
            <div className="ai-brief-head"><div><p className="eyebrow">AI MARKET INTERPRETATION</p><h3><Sparkles />AI算力解读</h3></div><span>基于全部 11 个指数 · 2026.09.19</span></div>
            <div className="ai-brief-summary"><strong>推理价格短期反弹，GPU 与显存成本整体偏强</strong><p>LLM Token支出指数近7日上涨 3.4%，但开源与闭源市场出现明显分化。GPU 租赁指数多数上涨，RAM价格同步走强，当前算力成本压力主要集中在闭源推理与高端硬件环节。</p></div>
            <div className="ai-brief-grid"><div><span>推理成本</span><strong>开源下降，闭源上涨</strong><p>开源LLM Token支出下降 5.3%，闭源指数上涨 3.5%，两类模型的成本走势分化。</p></div><div><span>GPU租赁</span><strong>高端型号普遍偏强</strong><p>H200、B200 与 MI300X 均录得上涨，H200近7日涨幅在GPU指数中居前。</p></div><div><span>内存市场</span><strong>GDDR6价格上涨</strong><p>RAM内存指数近7日上涨 1.0%，硬件成本尚未出现同步回落。</p></div></div>
            <p className="ai-brief-note">本解读仅依据当前看板数据生成，不对未接入的新闻、供需事件作原因判断。</p>
          </section>

          <CrossMarketSignals />

          <section id="ai-landscape" className="section-block epoch-workspace">
            <div className="section-head landscape-head">
              <div><p className="eyebrow">AI INFRASTRUCTURE & MODEL RANKING</p><h2>AI排行榜</h2><p className="landscape-summary">跟踪 AI 数据中心供给与模型 Token 消耗变化。</p><small className="source-note">数据参考：Epoch AI 历史数据、OpenRouter 模型排行</small></div>
            </div>
            <div className="epoch-grid">
              <DataCenterPanel />
              <LlmModelPanel window={modelWindow} setWindow={setModelWindow} />
            </div>
          </section>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>CPI</span></a><a href="#gpu"><Cpu /><span>GPU</span></a><a href="#ram"><Database /><span>RAM</span></a><a href="#ai-landscape"><BarChart3 /><span>排行</span></a><a href="#alerts"><Bell /><span>预警</span></a></nav>
    </div>
  );
}
