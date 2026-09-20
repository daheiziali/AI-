import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, Database, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { getIndexDefinition, indexDefinitions } from "@/app/data/indices";
import { tokenHistory } from "@/app/data/token-history";

export function generateStaticParams() {
  return indexDefinitions.map((item) => ({ slug: item.slug }));
}

function HistoryChart({ history, name }: { history: Array<{ date: string; value: number }>; name: string }) {
  const values = history.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, 0.02);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const points = history.map((point, index) => ({
    ...point,
    x: (index / (history.length - 1)) * 920,
    y: 250 - ((point.value - chartMin) / (chartMax - chartMin)) * 210,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const labels = [0, 0.25, 0.5, 0.75, 1].map((ratio) => history[Math.round((history.length - 1) * ratio)]);

  return (
    <div className="detail-chart-wrap">
      <div className="detail-y"><span>{chartMax.toFixed(2)}</span><span>{((chartMax + chartMin) / 2).toFixed(2)}</span><span>{chartMin.toFixed(2)}</span></div>
      <svg viewBox="0 0 920 270" role="img" aria-label={`${name}历史走势`}>
        <defs><linearGradient id="detail-token-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52d6b0" stopOpacity="0.25" /><stop offset="1" stopColor="#52d6b0" stopOpacity="0" /></linearGradient></defs>
        {[40, 145, 250].map((y) => <line key={y} x1="0" y1={y} x2="920" y2={y} className="grid-line" />)}
        <polygon points={`0,260 ${line} 920,260`} fill="url(#detail-token-area)" />
        <polyline points={line} fill="none" stroke="#52d6b0" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        <line x1="920" y1="30" x2="920" y2="260" stroke="#52d6b0" strokeDasharray="4 5" opacity=".45" />
        <circle cx={points.at(-1)?.x} cy={points.at(-1)?.y} r="5" fill="#08120f" stroke="#52d6b0" strokeWidth="2.5" />
      </svg>
      <div className="detail-x">{labels.map((point) => <span key={point.date}>{point.date.replaceAll("-", ".")}</span>)}</div>
      <div className="detail-chart-stats"><span>{history.length} 个数据点</span><span>区间最低 <b>${min.toFixed(3)}</b></span><span>区间最高 <b>${max.toFixed(3)}</b></span></div>
    </div>
  );
}

export default async function IndexDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getIndexDefinition(slug);
  if (!item) notFound();
  const related = indexDefinitions.filter((candidate) => candidate.category === item.category && candidate.slug !== item.slug).slice(0, 3);
  const history = item.slug === "llm-token-expenditure" ? tokenHistory : item.history ?? [];
  const historyStart = history.at(0)?.date.replaceAll("-", ".");
  const historyEnd = history.at(-1)?.date.replaceAll("-", ".");

  return (
    <div className="detail-page">
      <header className="detail-topbar">
        <a className="detail-brand" href="/"><span className="brand-mark"><LineChart /></span><strong>算力温度计</strong></a>
        <a className="detail-back" href="/"><ArrowLeft />返回总览</a>
      </header>

      <main className="detail-content">
        <div className="detail-breadcrumb"><span>{item.category === "token" ? "TOKEN 指数" : item.category === "gpu" ? "GPU 指数" : "RAM 指数"}</span><i />{item.code}</div>
        <section className="detail-heading">
          <div><h1>{item.name}</h1><p>{item.description}</p></div>
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">Silicon Data <ArrowUpRight /></a>
        </section>

        <section className="detail-quote">
          <div className="detail-current"><span>当前报价</span><div><strong>{item.value}</strong><small>{item.unit}</small></div><p className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? <TrendingUp /> : <TrendingDown />}{Math.abs(item.change)}% <em>近 7 日</em></p></div>
          <div className="detail-meta"><div><CalendarDays /><span>最新更新<strong>{item.updatedAt}</strong></span></div><div><Clock3 /><span>更新时间<strong>{item.updateSchedule ?? "以最新更新日期为准"}</strong></span></div><div><Database /><span>报价单位<strong>{item.unit.replace("/", "")}</strong></span></div></div>
        </section>

        <section className="detail-history">
          <div className="detail-section-head"><div><p className="eyebrow">PRICE HISTORY</p><h2>历史走势</h2></div><span>{historyStart} 至 {historyEnd}</span></div>
          <HistoryChart history={history} name={item.name} />
        </section>

        <section className="detail-about"><p className="eyebrow">ABOUT THIS INDEX</p><h2>指数说明</h2><p>{item.description}</p></section>

        {related.length > 0 && <section className="detail-related"><p className="eyebrow">RELATED INDICES</p><h2>同类指数</h2><div>{related.map((candidate) => <a key={candidate.slug} href={`/indices/${candidate.slug}`}><span>{candidate.name}<small>{candidate.code}</small></span><strong>{candidate.value}</strong><ArrowUpRight /></a>)}</div></section>}
      </main>
    </div>
  );
}
