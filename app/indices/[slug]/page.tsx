import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, Database, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { IndexAlertDialog } from "@/app/components/index-alert-dialog";
import { IndexHistoryChart } from "@/app/components/index-history-chart";
import { getIndexDefinition, indexDefinitions } from "@/app/data/indices";
import { tokenHistory } from "@/app/data/token-history";

export function generateStaticParams() {
  return indexDefinitions.map((item) => ({ slug: item.slug }));
}

export default async function IndexDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getIndexDefinition(slug);
  if (!item) notFound();
  const related = indexDefinitions.filter((candidate) => candidate.category === item.category && candidate.slug !== item.slug).slice(0, 3);
  const history = item.slug === "llm-token-expenditure" ? tokenHistory : item.history ?? [];

  return (
    <div className="detail-page">
      <header className="detail-topbar">
        <a className="detail-brand" href="/"><span className="brand-mark"><LineChart /></span><strong>AI Dashboard</strong></a>
        <a className="detail-back" href="/"><ArrowLeft />返回总览</a>
      </header>

      <main className="detail-content">
        <div className="detail-breadcrumb"><span>{item.category === "token" ? "TOKEN 指数" : item.category === "gpu" ? "GPU 指数" : "RAM 指数"}</span><i />{item.code}</div>
        <section className="detail-heading">
          <div><h1>{item.name}</h1><p>{item.description}</p></div>
          <div className="detail-heading-actions"><IndexAlertDialog name={item.name} value={item.value} unit={item.unit} /><a href={item.sourceUrl} target="_blank" rel="noreferrer">Silicon Data <ArrowUpRight /></a></div>
        </section>

        <section className="detail-quote">
          <div className="detail-current"><span>当前报价</span><div><strong>{item.value}</strong><small>{item.unit}</small></div><p className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? <TrendingUp /> : <TrendingDown />}{Math.abs(item.change)}% <em>近 7 日</em></p></div>
          <div className="detail-meta"><div><CalendarDays /><span>最新更新<strong>{item.updatedAt}</strong></span></div><div><Clock3 /><span>更新时间<strong>{item.updateSchedule ?? "以最新更新日期为准"}</strong></span></div><div><Database /><span>报价单位<strong>{item.unit}</strong></span></div></div>
        </section>

        <section className="detail-history">
          <div className="detail-section-head"><div><p className="eyebrow">PRICE HISTORY</p><h2>历史走势</h2></div></div>
          <IndexHistoryChart history={history} name={item.name} />
        </section>

        <section className="detail-about"><p className="eyebrow">ABOUT THIS INDEX</p><h2>指数说明</h2><p>{item.description}</p></section>

        {related.length > 0 && <section className="detail-related"><p className="eyebrow">RELATED INDICES</p><h2>同类指数</h2><div>{related.map((candidate) => <a key={candidate.slug} href={`/indices/${candidate.slug}`}><span>{candidate.name}<small>{candidate.code}</small></span><strong>{candidate.value}</strong><ArrowUpRight /></a>)}</div></section>}
      </main>
    </div>
  );
}
