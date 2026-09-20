"use client";

import {
  Activity, ArrowRight, BarChart3, Bell, Brain, Building2, ChevronDown, Command, Cpu, Database,
  Home as HomeIcon, Menu, Network, Search, Server, Settings, Sparkles, Star, TrendingDown, TrendingUp, Trophy,
} from "lucide-react";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gpuIndices, ramIndices, tokenIndices, type IndexDefinition } from "@/app/data/indices";
import { tokenHistory } from "@/app/data/token-history";

const historyRanges = { "7D": 7, "30D": 30, "90D": 90, "全部": Infinity } as const;
type HistoryRange = keyof typeof historyRanges;

const capabilityLeaders = [
  { name: "GPT-6 Astra", score: 166, owner: "OpenAI", type: "综合能力" },
  { name: "Claude 4.5 Opus", score: 154, owner: "Anthropic", type: "推理" },
  { name: "Gemini 3 Pro", score: 149, owner: "Google", type: "多模态" },
  { name: "Grok 5", score: 141, owner: "xAI", type: "通用模型" },
  { name: "DeepSeek R2", score: 132, owner: "DeepSeek", type: "开源权重" },
];

const computePoints = [
  { name: "AlexNet", year: 2012, compute: 8, lab: "University of Toronto" },
  { name: "Transformer", year: 2017, compute: 26, lab: "Google" },
  { name: "GPT-3", year: 2020, compute: 58, lab: "OpenAI" },
  { name: "PaLM", year: 2022, compute: 70, lab: "Google" },
  { name: "GPT-4", year: 2023, compute: 82, lab: "OpenAI" },
  { name: "Llama 3.1 405B", year: 2024, compute: 76, lab: "Meta" },
  { name: "Gemini Ultra", year: 2024, compute: 88, lab: "Google" },
  { name: "Frontier 2026", year: 2026, compute: 96, lab: "Frontier labs" },
];

const dataCenterLeaders = [
  { name: "Colossus 2", owner: "SpaceXAI", location: "Memphis, USA", value: 1112 },
  { name: "Fairwater Atlanta", owner: "Microsoft", location: "Georgia, USA", value: 769 },
  { name: "New Carlisle", owner: "Amazon", location: "Indiana, USA", value: 686 },
  { name: "Prometheus", owner: "Meta", location: "Ohio, USA", value: 680 },
  { name: "Pryor North", owner: "Google", location: "Oklahoma, USA", value: 637 },
];

const chipOwners = [
  { name: "Microsoft", value: 28, color: "#52d6b0" },
  { name: "Meta", value: 22, color: "#70a7ff" },
  { name: "Google", value: 18, color: "#f3c969" },
  { name: "Amazon", value: 16, color: "#c8a7ff" },
  { name: "xAI", value: 10, color: "#ff716b" },
  { name: "其他", value: 6, color: "#6f807a" },
];

const companySignals = [
  { name: "OpenAI", revenue: "$18.4B", funding: "$57B+", staff: "6.8k", trend: "收入领先" },
  { name: "Anthropic", revenue: "$6.2B", funding: "$25B+", staff: "2.9k", trend: "企业客户增长" },
  { name: "xAI", revenue: "$1.8B", funding: "$18B+", staff: "1.2k", trend: "算力扩张" },
  { name: "Mistral AI", revenue: "$0.6B", funding: "$2.2B+", staff: "0.7k", trend: "欧洲开源生态" },
];

function CapabilityPanel() {
  return (
    <article className="epoch-panel capability-panel" id="capability-ranking">
      <div className="epoch-panel-head"><div><p className="eyebrow">EPOCH CAPABILITIES INDEX</p><h4>知名 AI 能力排行</h4></div><span>166 Top ECI</span></div>
      <div className="rank-list">{capabilityLeaders.map((item, index) => <div className="rank-row" key={item.name}><span>{index + 1}</span><div><strong>{item.name}</strong><small>{item.owner} · {item.type}</small></div><b>{item.score}</b><i style={{ width: `${(item.score / 166) * 100}%` }} /></div>)}</div>
    </article>
  );
}

function ComputeScatter() {
  return (
    <article className="epoch-panel compute-panel" id="model-compute">
      <div className="epoch-panel-head"><div><p className="eyebrow">TRAINING COMPUTE</p><h4>知名 AI 模型训练算力</h4></div><span>1950-2026</span></div>
      <div className="compute-chart" role="img" aria-label="知名 AI 模型训练算力趋势散点图">
        <svg viewBox="0 0 680 310" preserveAspectRatio="none">
          {[54, 118, 182, 246].map((y) => <line key={y} x1="28" x2="660" y1={y} y2={y} className="grid-line" />)}
          {[120, 245, 370, 495, 620].map((x) => <line key={x} x1={x} x2={x} y1="28" y2="276" className="grid-line" />)}
          <path d="M34 268 C170 234 280 198 395 146 C485 105 560 72 650 42" fill="none" stroke="#6f8790" strokeDasharray="7 8" strokeWidth="2" />
          {computePoints.map((point) => {
            const x = 36 + ((point.year - 2012) / 14) * 608;
            const y = 270 - (point.compute / 100) * 225;
            return <g key={point.name}><circle cx={x} cy={y} r="7" fill="#52d6b0" fillOpacity=".72" stroke="#9df5df" /><text x={Math.min(x + 12, 575)} y={y - 9}>{point.name}</text></g>;
          })}
        </svg>
        <div className="compute-axis"><span>2012</span><span>2017</span><span>2022</span><span>2026</span></div>
      </div>
    </article>
  );
}

function DataCenterPanel() {
  return (
    <article className="epoch-panel data-center-panel" id="data-centers">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI DATA CENTERS</p><h4>数据中心</h4></div><span>H100-eq</span></div>
      <div className="dc-summary"><div><strong>86</strong><span>站点覆盖</span></div><div><strong>13.6M</strong><span>H100 等效</span></div><div><strong>13.1GW</strong><span>IT Power</span></div></div>
      <div className="dc-list">{dataCenterLeaders.map((item) => <div key={item.name}><div><strong>{item.name}</strong><small>{item.owner} · {item.location}</small></div><span>{item.value}k</span></div>)}</div>
    </article>
  );
}

function ChipOwnerPanel() {
  const offset = chipOwners.reduce<Array<{ start: number; item: typeof chipOwners[number] }>>((acc, item) => {
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].item.value : 0;
    acc.push({ start, item });
    return acc;
  }, []);

  return (
    <article className="epoch-panel chip-panel" id="chip-owners">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI CHIP OWNERS</p><h4>芯片所有者</h4></div><span>H100 等效份额</span></div>
      <div className="chip-ring" aria-label="芯片所有者份额图">
        <svg viewBox="0 0 42 42">{offset.map(({ start, item }) => <circle key={item.name} cx="21" cy="21" r="15.9" fill="none" stroke={item.color} strokeWidth="6" strokeDasharray={`${item.value} ${100 - item.value}`} strokeDashoffset={25 - start} />)}</svg>
        <strong>Top 5</strong>
      </div>
      <div className="chip-legend">{chipOwners.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<b>{item.value}%</b></span>)}</div>
    </article>
  );
}

function CompanyPanel() {
  return (
    <article className="epoch-panel company-panel" id="ai-companies">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI COMPANIES</p><h4>AI 公司</h4></div><span>Revenue / Funding</span></div>
      <div className="company-table">{companySignals.map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.revenue}</span><span>{item.funding}</span><small>{item.trend}</small></div>)}</div>
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
        <div className="legend"><span><i className="dot cpi" />AI算力CPI · USD / 百万 Tokens</span></div>
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
        {hoveredIndex !== null && selected && <div className={`chart-tooltip ${selected.x > 600 ? "align-right" : ""}`} style={{ left: `${(selected.x / 760) * 100}%`, top: `${(selected.y / 225) * 100}%` }}><span>{selected.date.replaceAll("-", ".")}</span><strong>${selected.value.toFixed(4)}</strong><small>USD / 百万 Tokens</small></div>}
        <div className="history-x" aria-hidden="true">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{formatDate(point.date)}</span>)}</div>
      </div>
      <div className="chart-summary"><span>{visible.length} 个观测值</span><span>区间最低 <b>${min.toFixed(3)}</b></span><span>区间最高 <b>${max.toFixed(3)}</b></span></div>
    </div>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["AI算力CPI", "H100"]);

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
          <p className="nav-label nav-label-spaced">AI能力与基础设施</p>
          <a className="nav-item" href="#capability-ranking"><Trophy />能力排行</a>
          <a className="nav-item" href="#model-compute"><Brain />模型训练算力</a>
          <a className="nav-item" href="#data-centers"><Server />数据中心</a>
          <a className="nav-item" href="#chip-owners"><Network />芯片所有者</a>
          <a className="nav-item" href="#ai-companies"><Building2 />AI公司</a>
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
            <div className="hero-metric"><div className="hero-index"><span>LLM Token支出指数</span><small>SDLLMTK</small></div><p>当前价格</p><strong>$1.01</strong><div><span className="positive"><TrendingUp />3.4%</span><span>近 7 日</span></div><small>USD / 百万 Tokens</small><a href="/indices/llm-token-expenditure">查看指数详情 <ArrowRight /></a></div>
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

          <section id="ai-landscape" className="section-block epoch-workspace">
            <div className="section-head landscape-head">
              <div><p className="eyebrow">AI CAPABILITY & INFRASTRUCTURE</p><h3>AI能力与基础设施</h3></div>
              <div className="landscape-tabs" aria-label="数据视图"><span className="active">图表</span><span>表格</span><span>地图</span></div>
            </div>
            <div className="landscape-hero">
              <div><span className="index-chip">Epoch AI 数据源</span><h3>从模型能力、训练算力到数据中心和公司经营，追踪 AI 产业扩张的关键变量。</h3></div>
              <div className="landscape-stats"><span><strong>5</strong>数据模块</span><span><strong>3.6k+</strong>模型库</span><span><strong>86</strong>数据中心</span></div>
            </div>
            <div className="epoch-grid">
              <CapabilityPanel />
              <ComputeScatter />
              <DataCenterPanel />
              <ChipOwnerPanel />
              <CompanyPanel />
            </div>
          </section>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>CPI</span></a><a href="#gpu"><Cpu /><span>GPU</span></a><a href="#ram"><Database /><span>RAM</span></a><a href="#ai-landscape"><BarChart3 /><span>能力</span></a><a href="#alerts"><Bell /><span>预警</span></a></nav>
    </div>
  );
}
