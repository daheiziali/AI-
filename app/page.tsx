"use client";

import {
  Activity, ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleHelp, Command, Cpu, Database,
  Download, FileText, Home as HomeIcon, LayoutDashboard, Menu, Search, Settings, SlidersHorizontal, Sparkles, Star,
  TrendingDown, TrendingUp, WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ranges = {
  "7D": [96.8, 97.2, 97.1, 98.4, 99.2, 100.1, 101.8, 102.4, 103.6, 104.2, 104.8, 104.6],
  "30D": [92.4, 93.8, 94.1, 95.6, 96.3, 97.9, 97.1, 99.2, 100.4, 101.7, 103.8, 104.6],
  "90D": [108.2, 105.4, 101.2, 98.6, 96.4, 94.8, 96.1, 98.2, 99.4, 101.6, 103.2, 104.6],
  "1Y": [82.6, 87.4, 91.8, 89.6, 94.2, 97.8, 96.1, 100.4, 102.1, 101.6, 103.4, 104.6],
};

const indices = [
  { name: "H100", code: "SDH100RT", value: "$2.63", unit: "/GPU·h", change: -0.4, path: "M0 28 L16 10 L36 10 L53 10 L70 20 L86 20 L100 38" },
  { name: "H100 Hyperscaler（超大规模云）", code: "H100-HYP", value: "$7.20", unit: "/GPU·h", change: 0.1, path: "M0 24 L16 38 L34 28 L51 28 L68 10 L100 10" },
  { name: "A100", code: "SDA100RT", value: "$1.58", unit: "/GPU·h", change: -0.6, path: "M0 8 L18 32 L42 32 L68 32 L100 32" },
  { name: "B200", code: "SDB200RT", value: "$5.73", unit: "/GPU·h", change: 0.5, path: "M0 36 L15 20 L32 10 L50 10 L68 28 L100 12" },
];

const tokenIndices = [
  { name: "LLM Token", code: "SDLLMTK", value: "$1.01", unit: "/M tokens", change: 3.4, path: "M0 18 L18 22 L34 30 L65 32 L82 29 L100 7" },
  { name: "Open LLM", code: "SDLLM-OPEN", value: "$0.50", unit: "/M tokens", change: -5.3, path: "M0 8 L17 9 L35 15 L54 24 L75 30 L100 40" },
  { name: "Proprietary LLM", code: "SDLLM-PROP", value: "$1.85", unit: "/M tokens", change: 3.5, path: "M0 12 L17 22 L34 31 L55 32 L72 29 L100 8" },
];

const ramIndices = [
  { name: "GDDR6", code: "SDGDDR6", value: "$19.06", unit: "/GB", change: 1.0, path: "M0 36 L16 36 L32 10 L58 10 L80 10 L100 10" },
  { name: "HBM3e", code: "SDHBM3E", value: "$14.80", unit: "/GB", change: 2.2, path: "M0 33 L18 30 L36 31 L55 20 L76 18 L100 9" },
];

function Sparkline({ path, positive }: { path: string; positive: boolean }) {
  const color = positive ? "#52d6b0" : "#ff716b";
  return (
    <svg viewBox="0 0 100 46" className="h-12 w-28 overflow-visible" aria-hidden="true">
      <path d={`${path} L100 46 L0 46 Z`} fill={color} opacity="0.07" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy={positive ? 12 : 32} r="2.5" fill="#07110f" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function MarketChart({ range }: { range: keyof typeof ranges }) {
  const values = ranges[range];
  const points = useMemo(() => {
    const min = Math.min(...values) - 2;
    const max = Math.max(...values) + 2;
    return values.map((value, index) => [(index / (values.length - 1)) * 760, 214 - ((value - min) / (max - min)) * 176]);
  }, [values]);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className="chart-shell">
      <div className="chart-y-labels" aria-hidden="true"><span>110</span><span>100</span><span>90</span><span>80</span></div>
      <svg viewBox="0 0 760 240" role="img" aria-label={`AI 算力 CPI ${range} 走势`}>
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52d6b0" stopOpacity="0.24" /><stop offset="1" stopColor="#52d6b0" stopOpacity="0" /></linearGradient></defs>
        {[42, 92, 142, 192].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} className="grid-line" />)}
        <polygon points={`0,230 ${line} 760,230`} fill="url(#area)" />
        <polyline points={line} fill="none" stroke="#52d6b0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <line x1="760" y1="18" x2="760" y2="230" stroke="#52d6b0" strokeDasharray="4 5" opacity=".45" />
        <circle cx={points.at(-1)?.[0]} cy={points.at(-1)?.[1]} r="5" fill="#08120f" stroke="#52d6b0" strokeWidth="3" />
      </svg>
      <div className="chart-x-labels" aria-hidden="true"><span>08/18</span><span>08/25</span><span>09/01</span><span>09/08</span><span>09/15</span></div>
    </div>
  );
}

export default function Home() {
  const [range, setRange] = useState<keyof typeof ranges>("30D");
  const [navOpen, setNavOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["AI算力CPI", "H100"]);
  const [alertSaved, setAlertSaved] = useState(false);

  const toggleFavorite = (name: string) => {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const renderIndexCard = (item: (typeof indices)[number]) => (
    <article className="index-card" key={item.code}>
      <div className="card-top"><div><h4>{item.name}</h4><span>{item.code}</span></div><button className={favorites.includes(item.name) ? "is-favorite" : ""} onClick={() => toggleFavorite(item.name)} aria-label={`收藏 ${item.name}`} aria-pressed={favorites.includes(item.name)}><Star /></button></div>
      <div className="card-value"><div><strong>{item.value}</strong><span>{item.unit}</span><p className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? <TrendingUp /> : <TrendingDown />}{Math.abs(item.change)}% <em>vs 7D</em></p></div><Sparkline path={item.path} positive={item.change >= 0} /></div>
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
          <a className="nav-item" href="#token"><Sparkles />Token 指数</a>
          <a className="nav-item" href="#ram"><Database />RAM 指数</a>
          <p className="nav-label nav-label-spaced">TOOLS</p>
          <a className="nav-item" href="#watch"><Star />自选</a>
          <a className="nav-item" href="#alerts"><Bell />价格预警<span className="nav-count">3</span></a>
        </nav>
        <div className="sidebar-foot"><button><CircleHelp />方法论</button><button><Settings />设置</button><div className="account"><span>JW</span><div><strong>Jiajing Wen</strong><small>Pro · 专业版</small></div><ChevronDown /></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><Button className="mobile-menu" variant="ghost" size="icon" onClick={() => setNavOpen(!navOpen)} aria-label="打开导航"><Menu /></Button><div><p className="eyebrow">MARKET OVERVIEW</p><h1>AI 算力市场</h1></div></div>
          <div className="topbar-actions"><button className="search"><Search /><span>搜索指数、GPU 或代码</span><kbd><Command />K</kbd></button><Button variant="outline" size="icon" aria-label="通知"><Bell /></Button><span className="live"><i />数据已更新</span></div>
        </header>

        <main id="overview" className="content">
          <section className="market-head">
            <div><div className="market-title"><span className="index-chip">综合指数</span><span>截至 2026.09.18 · 工作日更新</span></div><h2>AI算力CPI <button className={favorites.includes("AI算力CPI") ? "is-favorite" : ""} onClick={() => toggleFavorite("AI算力CPI")} aria-label="收藏 AI算力CPI" aria-pressed={favorites.includes("AI算力CPI")}><Star /></button></h2><p>综合衡量 GPU 租赁、LLM Token 与内存成本的 AI 算力价格水平。</p></div>
            <Dialog onOpenChange={(open) => open && setAlertSaved(false)}>
              <DialogTrigger asChild><Button className="alert-button"><Bell />设置预警</Button></DialogTrigger>
              <DialogContent className="alert-dialog">
                <DialogHeader><DialogTitle>设置 AI Compute CPI 预警</DialogTitle><DialogDescription>指数达到条件后，通过 App 推送和邮件提醒。</DialogDescription></DialogHeader>
                {alertSaved ? <div className="alert-success"><Bell /><strong>预警已开启</strong><span>当指数高于 108.0 时提醒你</span></div> : <div className="alert-form"><label>触发条件<div className="condition-row"><span>高于</span><Input defaultValue="108.0" inputMode="decimal" /></div></label><label className="switch-row"><span><strong>App 推送</strong><small>实时接收价格变化</small></span><Switch defaultChecked /></label><label className="switch-row"><span><strong>邮件摘要</strong><small>工作日收盘后发送</small></span><Switch defaultChecked /></label></div>}
                <DialogFooter>{!alertSaved && <Button onClick={() => setAlertSaved(true)}>保存预警</Button>}</DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          <section className="hero-grid">
            <div className="hero-metric"><p>当前指数</p><strong>104.6</strong><div><span className="positive"><TrendingUp />1.8%</span><span>近 30 日</span></div><small>基期 = 100</small></div>
            <div className="hero-chart"><div className="chart-toolbar"><div className="legend"><span><i className="dot cpi" />AI Compute CPI</span><span><i className="dot base" />基准线</span></div><Tabs value={range} onValueChange={(value) => setRange(value as keyof typeof ranges)}><TabsList>{Object.keys(ranges).map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></Tabs></div><MarketChart range={range} /></div>
            <aside className="drivers"><div className="drivers-head"><span>指数贡献</span><span>权重</span></div><div className="driver"><span className="driver-icon gpu"><Cpu /></span><div><strong>GPU 租赁</strong><small>50% 权重</small></div><b className="positive">+2.4%</b></div><div className="driver"><span className="driver-icon token"><Sparkles /></span><div><strong>Token 支出</strong><small>35% 权重</small></div><b className="negative">−0.7%</b></div><div className="driver"><span className="driver-icon ram"><Database /></span><div><strong>RAM / 内存</strong><small>15% 权重</small></div><b className="positive">+0.3%</b></div></aside>
          </section>

          <section id="gpu" className="section-block">
            <div className="section-head"><div><p className="eyebrow">GPU RENTAL MARKET</p><h3>GPU 租赁价格</h3></div><a href="#all-gpu">查看全部 <span>→</span></a></div>
            <div className="index-grid">
              {indices.map(renderIndexCard)}
            </div>
          </section>

          <section id="token" className="section-block data-band token-band">
            <div className="section-head"><div><p className="eyebrow">AI COMPUTE CPI · TOKEN LAYER</p><h3>Token 支出价格指数</h3></div><div className="section-actions"><span>用量加权 · USD / 百万 tokens</span><a href="#methodology">方法论 <ArrowUpRight /></a></div></div>
            <div className="token-layout"><div className="index-grid token-grid">{tokenIndices.map(renderIndexCard)}</div><aside className="insight"><Sparkles /><p>本周洞察</p><strong>开源模型推理成本加速下行</strong><span>Open LLM 指数 7 日下降 5.3%，而专有模型价格反弹，二者价差扩大至 $1.35 / M tokens。</span><button>查看分析 <ArrowUpRight /></button></aside></div>
          </section>

          <section id="ram" className="section-block">
            <div className="section-head"><div><p className="eyebrow">MEMORY MARKET</p><h3>RAM / 高带宽内存</h3></div><a href="#all-ram">查看全部 <span>→</span></a></div>
            <div className="ram-layout"><div className="index-grid ram-grid">{ramIndices.map(renderIndexCard)}</div><div className="market-pulse"><div><span>市场温度</span><strong>偏热</strong></div><div className="pulse-track"><i /></div><p>HBM3e 供应趋紧，连续 4 个工作日上涨</p></div></div>
          </section>

          <section className="section-block signal-section">
            <div className="section-head"><div><p className="eyebrow">MARKET SIGNALS</p><h3>今日市场信号</h3></div><span className="updated"><i />16:00 更新</span></div>
            <div className="signal-table" role="table" aria-label="今日市场信号">
              <div className="signal-row signal-header" role="row"><span>信号</span><span>当前</span><span>变化</span><span>影响</span></div>
              <div className="signal-row" role="row"><span><i className="signal-icon up"><TrendingUp /></i><b>H100 超大规模溢价</b></span><span>+173.8%</span><span className="positive">扩大 1.2pp</span><span><em className="tag warning">训练成本上行</em></span></div>
              <div className="signal-row" role="row"><span><i className="signal-icon down"><TrendingDown /></i><b>开源 / 专有 Token 价差</b></span><span>$1.35</span><span className="positive">扩大 8.6%</span><span><em className="tag good">推理迁移窗口</em></span></div>
              <div className="signal-row" role="row"><span><i className="signal-icon flat"><Activity /></i><b>GPU 综合波动率</b></span><span>12.4%</span><span>持平</span><span><em className="tag neutral">市场稳定</em></span></div>
            </div>
          </section>

          <section id="methodology" className="methodology">
            <div><FileText /><span><strong>数据与方法论</strong><small>基于 Silicon Data 指数框架：价格标准化、异常值过滤、基差调整与供应商加权聚合。</small></span></div><div className="method-actions"><span><CalendarDays />下次更新：09.21 16:00</span><Button variant="outline"><Download />导出日报</Button></div>
          </section>
          <p className="data-note">当前页面为产品设计原型，行情用于界面演示，不构成投资或采购建议。</p>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>总览</span></a><a href="#gpu"><Cpu /><span>指数</span></a><a href="#watch"><Star /><span>自选</span></a><a href="#alerts"><Bell /><span>预警</span></a><a href="#settings"><SlidersHorizontal /><span>我的</span></a></nav>
    </div>
  );
}
