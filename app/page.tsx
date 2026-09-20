"use client";

import {
  Activity, ArrowRight, BarChart3, Bell, Building2, ChevronDown, Command, Cpu, Database,
  Home as HomeIcon, Menu, Search, Server, Settings, Sparkles, Star, TrendingDown, TrendingUp,
} from "lucide-react";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gpuIndices, ramIndices, tokenIndices, type IndexDefinition } from "@/app/data/indices";
import { tokenHistory } from "@/app/data/token-history";

const historyRanges = { "7D": 7, "30D": 30, "90D": 90, "全部": Infinity } as const;
type HistoryRange = keyof typeof historyRanges;

const dataCenterRankings = [
  { name: "Colossus 2", owner: "SpaceXAI", country: "United States", compute: "1.11M", power: "946MW", cost: "$35.8B" },
  { name: "Microsoft Fairwater Atlanta", owner: "Microsoft", country: "United States", compute: "769k", power: "636MW", cost: "$24.1B" },
  { name: "Anthropic-Amazon New Carlisle", owner: "Amazon", country: "United States", compute: "686k", power: "910MW", cost: "$34.5B" },
  { name: "Meta Prometheus", owner: "Meta", country: "United States", compute: "680k", power: "562MW", cost: "$21.3B" },
  { name: "Google Pryor North", owner: "Google", country: "United States", compute: "637k", power: "368MW", cost: "$13.9B" },
  { name: "OpenAI Stargate Abilene", owner: "Oracle", country: "United States", compute: "509k", power: "421MW", cost: "$15.9B" },
];

const companyRankingGroups = [
  { title: "营收排行", unit: "Annualized revenue", items: [{ name: "Anthropic", value: "$65.0B" }, { name: "OpenAI", value: "$40.0B" }, { name: "Z.ai", value: "$1.6B" }] },
  { title: "融资排行", unit: "Total equity funding", items: [{ name: "OpenAI", value: "$182.8B" }, { name: "Anthropic", value: "$139.4B" }, { name: "xAI", value: "$37.0B" }] },
  { title: "人员排行", unit: "Staff reports", items: [{ name: "Google", value: "6.0k" }, { name: "OpenAI", value: "4.5k" }, { name: "Meta", value: "3.4k" }] },
  { title: "用户排行", unit: "Active users", items: [{ name: "Meta", value: "1.0B MAU" }, { name: "OpenAI", value: "920M WAU" }, { name: "Google", value: "650M MAU" }] },
  { title: "算力成本", unit: "Compute spend", items: [{ name: "Anthropic", value: "$13.6B" }, { name: "OpenAI", value: "$8.3B" }] },
];

function DataCenterPanel() {
  return (
    <article className="epoch-panel data-center-panel" id="data-centers">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI DATA CENTER RANKING</p><h4>AI数据中心算力排行</h4></div><span>日更观察</span></div>
      <div className="ranking-tabs" aria-label="数据中心维度"><span className="active">算力</span><span>IT Power</span><span>成本</span></div>
      <div className="dc-summary"><div><strong>86</strong><span>站点覆盖</span></div><div><strong>13.6M</strong><span>H100 等效总量</span></div><div><strong>13.1GW</strong><span>IT Power 总量</span></div></div>
      <div className="ranking-table dc-ranking">
        <div className="ranking-header"><span>数据中心</span><span>算力</span><span>IT Power</span><span>成本</span></div>
        {dataCenterRankings.map((item, index) => <div className="ranking-row" key={item.name}><b>{index + 1}</b><div><strong>{item.name}</strong><small>{item.owner} · {item.country}</small></div><span>{item.compute}</span><span>{item.power}</span><span>{item.cost}</span></div>)}
      </div>
    </article>
  );
}

function CompanyPanel() {
  return (
    <article className="epoch-panel company-panel" id="ai-companies">
      <div className="epoch-panel-head"><div><p className="eyebrow">AI COMPANY RANKING</p><h4>AI公司排行</h4></div><span>5 个维度</span></div>
      <div className="company-rank-grid">{companyRankingGroups.map((group) => <div className="company-rank-card" key={group.title}><div><strong>{group.title}</strong><small>{group.unit}</small></div>{group.items.map((item, index) => <p key={item.name}><b>{index + 1}</b><span>{item.name}</span><em>{item.value}</em></p>)}</div>)}</div>
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
          <p className="nav-label nav-label-spaced">AI动态排行</p>
          <a className="nav-item" href="#data-centers"><Server />AI数据中心</a>
          <a className="nav-item" href="#ai-companies"><Building2 />AI公司排行</a>
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
              <div><p className="eyebrow">AI INFRASTRUCTURE & COMPANY RANKING</p><h3>AI动态排行</h3></div>
              <div className="landscape-tabs" aria-label="数据视图"><span className="active">排行</span><span>趋势</span><span>明细</span></div>
            </div>
            <div className="landscape-hero">
              <div><h3>聚焦更动态的基础设施与公司经营数据，跟踪 AI 算力供给、资本投入与商业化变化。</h3><small className="source-note">数据参考：Epoch AI 历史数据</small></div>
              <div className="landscape-stats"><span><strong>2</strong>数据模块</span><span><strong>3</strong>数据中心维度</span><span><strong>5</strong>公司排行维度</span></div>
            </div>
            <div className="epoch-grid">
              <DataCenterPanel />
              <CompanyPanel />
            </div>
          </section>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>CPI</span></a><a href="#gpu"><Cpu /><span>GPU</span></a><a href="#ram"><Database /><span>RAM</span></a><a href="#ai-landscape"><BarChart3 /><span>排行</span></a><a href="#alerts"><Bell /><span>预警</span></a></nav>
    </div>
  );
}
