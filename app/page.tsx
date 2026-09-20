"use client";

import {
  Activity, ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleHelp, Command, Cpu, Database,
  Download, FileText, Home as HomeIcon, LayoutDashboard, Menu, Search, Settings, SlidersHorizontal, Sparkles, Star,
  TrendingDown, TrendingUp, WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const indices = [
  { name: "H100", code: "SDH100RT", value: "$2.63", unit: "/GPU·h", change: -0.4 },
  { name: "H100 Hyperscaler（超大规模云）", code: "H100-HYP", value: "$7.20", unit: "/GPU·h", change: 0.1 },
  { name: "A100", code: "SDA100RT", value: "$1.58", unit: "/GPU·h", change: -0.6 },
  { name: "B200", code: "SDB200RT", value: "$5.73", unit: "/GPU·h", change: 0.5 },
];

const tokenIndices = [
  { name: "AI算力CPI", code: "SDLLMTK", value: "$1.01", unit: "/M tokens", change: 3.4 },
  { name: "Open LLM", code: "SDLLM-OPEN", value: "$0.50", unit: "/M tokens", change: -5.3 },
  { name: "Proprietary LLM", code: "SDLLM-PROP", value: "$1.85", unit: "/M tokens", change: 3.5 },
];

const ramIndices = [
  { name: "GDDR6", code: "SDGDDR6", value: "$19.06", unit: "/GB", change: 1.0 },
];

function DataPendingChart() {
  return (
    <div className="data-pending" role="status">
      <span className="pending-icon"><FileText /></span>
      <strong>历史走势待数据接口接入</strong>
      <p>当前仅展示 Silicon Data 官方最新读数，不生成未经验证的历史点位。</p>
      <div><span>用量加权</span><span>输入 / 输出归一化</span><span>每日独立验证</span></div>
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

  const renderIndexCard = (item: (typeof indices)[number]) => (
    <article className="index-card" key={item.code}>
      <div className="card-top"><div><h4>{item.name}</h4><span>{item.code}</span></div><button className={favorites.includes(item.name) ? "is-favorite" : ""} onClick={() => toggleFavorite(item.name)} aria-label={`收藏 ${item.name}`} aria-pressed={favorites.includes(item.name)}><Star /></button></div>
      <div className="card-value"><div><strong>{item.value}</strong><span>{item.unit}</span><p className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? <TrendingUp /> : <TrendingDown />}{Math.abs(item.change)}% <em>vs 7D</em></p></div><span className="source-badge">官方读数</span></div>
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
        <div className="sidebar-foot"><button><CircleHelp />方法论</button><button><Settings />设置</button><div className="account"><span>JW</span><div><strong>Jiajing Wen</strong><small>Pro · 专业版</small></div><ChevronDown /></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><Button className="mobile-menu" variant="ghost" size="icon" onClick={() => setNavOpen(!navOpen)} aria-label="打开导航"><Menu /></Button><div><p className="eyebrow">MARKET OVERVIEW</p><h1>AI 算力市场</h1></div></div>
          <div className="topbar-actions"><button className="search"><Search /><span>搜索指数、GPU 或代码</span><kbd><Command />K</kbd></button><Button variant="outline" size="icon" aria-label="通知"><Bell /></Button><span className="live"><i />数据已更新</span></div>
        </header>

        <main id="overview" className="content">
          <section className="market-head">
            <div><div className="market-title"><span className="index-chip">AI 推理价格基准</span><span>截至 2026.09.18 · 工作日更新</span></div><h2>AI算力CPI <button className={favorites.includes("AI算力CPI") ? "is-favorite" : ""} onClick={() => toggleFavorite("AI算力CPI")} aria-label="收藏 AI算力CPI" aria-pressed={favorites.includes("AI算力CPI")}><Star /></button></h2><p>基于 Silicon Data SDLLMTK，衡量活跃 LLM 市场每百万 Token 的实际支出水平。</p></div>
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
            <div className="hero-chart"><div className="chart-toolbar"><div className="legend"><span><i className="dot cpi" />SDLLMTK · 广义市场</span></div><span className="verified-label">Silicon Data 官方读数</span></div><DataPendingChart /></div>
            <aside className="drivers"><div className="drivers-head"><span>指数变动因素</span></div><div className="driver"><span className="driver-icon gpu"><WalletCards /></span><div><strong>定价变化</strong><small>模型供应商调整 Token 价格</small></div></div><div className="driver"><span className="driver-icon token"><Sparkles /></span><div><strong>使用结构</strong><small>需求转向更贵或更便宜的模型</small></div></div><div className="driver"><span className="driver-icon ram"><Activity /></span><div><strong>篮子构成</strong><small>活跃模型与输入输出比例变化</small></div></div></aside>
          </section>

          <section id="gpu" className="section-block">
            <div className="section-head"><div><p className="eyebrow">GPU RENTAL MARKET</p><h3>GPU 租赁价格</h3></div><a href="#all-gpu">查看全部 <span>→</span></a></div>
            <div className="index-grid">
              {indices.map(renderIndexCard)}
            </div>
          </section>

          <section id="token" className="section-block data-band token-band">
            <div className="section-head"><div><p className="eyebrow">LLM TOKEN EXPENDITURE INDEX FAMILY</p><h3>AI 推理价格基准</h3></div><div className="section-actions"><span>用量加权 · USD / 百万 Tokens</span><a href="#methodology">方法论 <ArrowUpRight /></a></div></div>
            <div className="token-layout"><div className="index-grid token-grid">{tokenIndices.map(renderIndexCard)}</div><aside className="insight definition-card"><Sparkles /><p>命名口径</p><strong>AI算力CPI = SDLLMTK</strong><span>中文产品名指向 Silicon Data 的广义 LLM Token Expenditure Index，不与 GPU 或 RAM 指数混合加权。</span></aside></div>
          </section>

          <section id="ram" className="section-block">
            <div className="section-head"><div><p className="eyebrow">MEMORY MARKET</p><h3>RAM / 高带宽内存</h3></div><a href="#all-ram">查看全部 <span>→</span></a></div>
            <div className="ram-layout"><div className="index-grid ram-grid">{ramIndices.map(renderIndexCard)}</div><div className="related-note"><Database /><div><strong>独立关联指标</strong><p>RAM 指数用于观察内存市场价格，不参与 AI算力CPI 的计算。</p></div></div></div>
          </section>

          <section id="methodology" className="methodology">
            <div><FileText /><span><strong>AI算力CPI 方法论</strong><small>SDLLMTK 按真实消费量加权，统一处理输入 / 输出 Token 与上下文窗口，并筛选具有持续使用和市场支出的模型。</small></span></div><div className="method-actions"><span><CalendarDays />工作日更新</span><Button variant="outline"><Download />导出日报</Button></div>
          </section>
          <p className="data-note">最新读数来自 Silicon Data 公开页面（截至 2026.09.18）；历史序列需在获得授权数据接口后展示。</p>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端导航"><a className="active" href="#overview"><HomeIcon /><span>总览</span></a><a href="#gpu"><Cpu /><span>指数</span></a><a href="#watch"><Star /><span>自选</span></a><a href="#alerts"><Bell /><span>预警</span></a><a href="#settings"><SlidersHorizontal /><span>我的</span></a></nav>
    </div>
  );
}
