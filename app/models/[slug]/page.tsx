import { ArrowLeft, ArrowUpRight, BarChart3, CalendarDays, Database, LineChart, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { ModelPriceHistoryChart } from "@/app/components/model-price-history-chart";
import { ModelTokenActivityChart } from "@/app/components/model-token-activity-chart";
import { getLlmModel, llmModels } from "@/app/data/llm-models";

export function generateStaticParams() {
  return llmModels.map((model) => ({ slug: model.slug }));
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getLlmModel(slug);
  if (!model) notFound();
  const related = llmModels.filter((item) => item.slug !== model.slug).slice(0, 3);
  const daily = model.ranking.day;
  const latestActivity = [...model.tokenActivity].reverse().find((point) => !point.estimated) ?? model.tokenActivity.at(-1);

  return (
    <div className="detail-page model-detail-page">
      <header className="detail-topbar">
        <a className="detail-brand" href="/#llm-models"><span className="brand-mark"><LineChart /></span><strong>AI Dashboard</strong></a>
        <a className="detail-back" href="/#llm-models"><ArrowLeft />返回模型排行</a>
      </header>

      <main className="detail-content">
        <div className="detail-breadcrumb"><span>OPENROUTER MODEL</span><i />{model.provider}</div>
        <section className="detail-heading">
          <div><h1>{model.name}</h1><p>{model.summary}</p></div>
          <div className="detail-heading-actions"><a href={model.sourceUrl} target="_blank" rel="noreferrer">OpenRouter <ArrowUpRight /></a></div>
        </section>

        <section className="detail-quote model-quote">
          <div className="detail-current"><span>日 Token 消耗</span><div><strong>{daily.display}</strong><small>tokens</small></div><p className="positive"><TrendingUp />{daily.change}% <em>近 7 日</em></p></div>
          <div className="detail-meta">
            <div><Database /><span>模型提供方<strong>{model.providerLabel}</strong></span></div>
            <div><CalendarDays /><span>最新数据桶<strong>{model.latestBucket}</strong></span></div>
            <div><BarChart3 /><span>当前观测<strong>{latestActivity ? `${(latestActivity.prompt + latestActivity.reasoning + latestActivity.completion).toFixed(2)}T tokens` : daily.display}</strong></span></div>
          </div>
        </section>

        <section className="detail-history model-detail-section">
          <div className="detail-section-head"><div><p className="eyebrow">MODEL ACTIVITY</p><h2>Token 活跃度</h2></div></div>
          <ModelTokenActivityChart activity={model.tokenActivity} name={model.name} />
        </section>

        <section className="detail-history model-detail-section">
          <div className="detail-section-head"><div><p className="eyebrow">PRICE HISTORY</p><h2>价格历史</h2></div></div>
          <ModelPriceHistoryChart history={model.priceHistory} name={model.name} />
        </section>

        <section className="detail-about"><p className="eyebrow">MODEL PROFILE</p><h2>模型简介</h2><p>{model.summary}</p></section>

        <section className="detail-related"><p className="eyebrow">RELATED MODELS</p><h2>同类模型</h2><div>{related.map((candidate) => <a key={candidate.slug} href={`/models/${candidate.slug}`}><span>{candidate.name}<small>{candidate.providerLabel}</small></span><strong>{candidate.ranking.day.display}</strong><ArrowUpRight /></a>)}</div></section>
      </main>
    </div>
  );
}
