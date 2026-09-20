"use client";

import {
  Activity, ArrowRight, Bell, ChevronDown, Command, Cpu, Database, Home as HomeIcon, LayoutDashboard,
  Menu, Search, Settings, SlidersHorizontal, Sparkles, Star, TrendingDown, TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gpuIndices, ramIndices, tokenIndices, type IndexDefinition } from "@/app/data/indices";
import { tokenHistory } from "@/app/data/token-history";

const historyRanges = { "7D": 7, "30D": 30, "90D": 90, "全部": Infinity } as const;
type HistoryRange = keyof typeof historyRanges;

function TokenHistoryChart() {
  const [range, setRange] = useState<HistoryRange>("30D");
  const visible = useMemo(() => {
    const days = historyRanges[range];
    if (!Number.isFinite(days)) return tokenHistory;
    const latest = new Date(`${tokenHistory.at(-1)?.date}T00:00:00Z`).getTime();
    const cutoff = latest - days * 86400000;
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

  return (
    <div className="history-chart">
      <div className="chart-toolbar">
        <div className="legend"><span><i className="dot cpi" />AI算力CPI · USD / 百万 Tokens</span></div>
        <Tabs value={range} onValueChange={(value) => setRange(value as HistoryRange)}><TabsList>{Object.keys(historyRanges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></Tabs>
      </div>
      <div className="history-plot">
        <div className="history-y" aria-hidden="true"><span>{chartMax.toFixed(2)}</span><span>{((chartMax + chartMin) / 2).toFixed(2)}</span><span>{chartMin.toFixed(2)}</span></div>
        <svg viewBox="0 0 760 225" role="img" aria-label={`AI算力CPI ${range} 历史价格走势，最新值 ${points.at(-1)?.value.toFixed(4)}`}>
          <defs><linearGradient id="token-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52d6b0" stopOpacity="0.22" /><stop offset="1" stopColor="#52d6b0" stopOpacity="0" /></linearGradient></defs>
          {[30, 117.5, 205].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} className="grid-line" />)}
          <polygon points={`0,215 ${line} 760,215`} fill="url(#token-area)" />
          <polyline points={line} fill="none" stroke="#52d6b0" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="760" y1="20" x2="760" y2="215" stroke="#52d6b0" strokeDasharray="4 5" opacity=".45" />
          <circle cx={points.at(-1)?.x} cy={points.at(-1)?.y} r="4.5" fill="#08120f" stroke="#52d6b0" strokeWidth="2.5" />
        </svg>
        <div className="history-x" aria-hidden="true">{labels.map((point, index) => <span key={`${point.date}-${index}`}>{formatDate(point.date)}</span>)}</div>
      </div>
      <div className="chart-summary"><span>{visible.length} 个观测值</span><span>区间最低 <b>${min.toFixed(3)}</b></span><span>区间最高 <b>${max.toFixed(3)}</b></span></div>
    </div>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["AI算力CPI", "H100"]);
  const [alertSaved, setAlertSaved] = useState(false);

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
        <div className="brand"><span className="brand-mark"><Activity /></span><span>算力温度计</span></div>
        <nav aria-label="主要导航">
          <p className="nav-label">WORKSPACE</p>
          <a className="nav-item active" href="#overview"><LayoutDashboard />总览</a>
          <a className="nav-item" href="#gpu"><Cpu />GPU 指数</a>
          <a className="nav-item" href="#token"><Sparkles />AI算力CPI</a>
          <a className="nav-item" href="#ram"><Database />RAM 指数</a>
          <p className="nav-label nav-label-spaced">TOOLS</p>
          <a className="nav-item" href="#watch"><Star />自选</a>
          <a className="nav-item" href="#alerts"><Bell />价格预警<span className="nav-count">3</span></a>
        </nav>
        <div className="sidebar-foot"><button><Settings />设置</button><div className="account"><span>JW</span><div><strong>Jiajing Wen</strong><small>Pro · 专业版</small></div><ChevronDown /></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><Button className="mobile-menu" variant="ghost" size="icon" onClick={() => setNavOpen(!navOpen)} aria-label="打开导航"><Menu /></Button><div><p className="eyebrow">MARKET OVERVIEW</p><h1>AI 算力市场</h1></div></div>
          <div className="topbar-actions"><button className="search"><Search /><span>搜索指数、GPU 或代码</span><kbd><Command />K</kbd></button><Button variant="outline" size="icon" aria-label="通知"><Bell /></Button><span className="live"><i />数据已更新</span></div>
        </header>

        <main id="overview" className="content">
          <section className="market-head">
            <div><div className="market-title"><span className="index-chip">AI 推理价格基准</span><span>截至 2026.09.18 · 工作日更新</span></div><h2>AI算力CPI <button className={favorites.includes("AI算力CPI") ? "is-favorite" : ""} onClick={() => toggleFavorite("AI算力CPI")} aria-label="收藏 AI算力CPI" aria-pressed={favorites.includes("AI算力CPI")}><Star /></button></h2><p>追踪 AI 推理价格变化，快速了解每百万 Token 的市场支出走势。</p></div>
            <Dialog onOpenChange={(open) => open && setAlertSaved(false)}>
              <DialogTrigger asChild><Button className="alert-button"><Bell />设置预警</Button></DialogTrigger>
              <DialogContent className="alert-dialog">
                <DialogHeader><DialogTitle>设置 AI算力CPI 预警</DialogTitle><DialogDescription>每百万 Token 支出达到条件后，通过 App 推送和邮件提醒。</DialogDescription></DialogHeader>
                {alertSaved ? <div className="alert-success"><Bell /><strong>预警已开启</strong><span>当价格高于 $1.10 / M tokens 时提醒你</span></div> : <div className="alert-form"><label>触发条件<div className="condition-row"><span>高于</span><Input defaultValue="1.10" inputMode="decimal" /></div></label><label className="switch-row"><span><strong>App 推送</strong><small>实时接收价格变化</small></span><Switch defaultChecked /></label><label className="switch-row"><span><strong>邮件摘要</strong><small>工作日收盘后发送</small></span><Switch defaultChecked /></label></div>}
                <DialogFooter>{!alertSaved && <Button onClick={() => setAlertSaved(true)}>保存预警</Button>}</DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          <section className="hero-grid">
            <div className="hero-metric"><p>当前价格</p><strong>$1.01</strong><div><span className="positive"><TrendingUp />3.4%</span><span>近 7 日</span></div><small>USD / 百万 Tokens</small></div>
            <div className="hero-chart"><TokenHistoryChart /></div>
          </section>

          <section id="token" className="section-block data-band token-band">
            <div className="section-head"><div><p className="eyebrow">LLM TOKEN EXPENDITURE INDEX</p><h3>AI 推理价格指数</h3></div></div>
            <div className="index-grid token-grid">{tokenIndices.map(renderIndexCard)}</div>
          </section>

          <section id="gpu" className="section-block">
            <div className="section-head"><div><p className="eyebrow">GPU RENTAL MARKET</p><h3>GPU 租赁价格</h3></div></div>
            <div className="index-grid">{gpuIndices.map(renderIndexCard)}</div>
          </section>

          <section id="ram" className="section-block">
            <div className="section-head"><div><p className="eyebrow">MEMORY MARKET</p><h3>RAM内存指数</h3></div></div>
            <div className="index-grid ram-grid">{ramIndices.map(renderIndexCard)}</div>
          </section>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>总览</span></a><a href="#gpu"><Cpu /><span>指数</span></a><a href="#watch"><Star /><span>自选</span></a><a href="#alerts"><Bell /><span>预警</span></a><a href="#settings"><SlidersHorizontal /><span>我的</span></a></nav>
    </div>
  );
}
