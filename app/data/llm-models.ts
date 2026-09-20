export type ModelRankingWindow = "day" | "week" | "month";

export const modelRankingWindows: Record<ModelRankingWindow, string> = {
  day: "日",
  week: "周",
  month: "月",
};

export type ModelPricePoint = {
  date: string;
  effectiveInput: number;
  effectiveOutput: number;
  listedInput: number;
  listedOutput: number;
};

export type ModelTokenPoint = {
  date: string;
  prompt: number;
  reasoning: number;
  completion: number;
  estimated?: boolean;
};

export type LlmModelDefinition = {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  summary: string;
  latestBucket: string;
  sourceUrl: string;
  ranking: Record<ModelRankingWindow, { value: number; display: string; change: number }>;
  tokenActivity: ModelTokenPoint[];
  priceHistory: ModelPricePoint[];
};

const tokenPattern: ModelTokenPoint[] = [
  { date: "2026-09-10", prompt: 6.85, reasoning: 0.06, completion: 0.11 },
  { date: "2026-09-11", prompt: 9.62, reasoning: 0.09, completion: 0.14 },
  { date: "2026-09-12", prompt: 8.86, reasoning: 0.08, completion: 0.13 },
  { date: "2026-09-13", prompt: 7.91, reasoning: 0.07, completion: 0.12 },
  { date: "2026-09-14", prompt: 8.18, reasoning: 0.07, completion: 0.12 },
  { date: "2026-09-15", prompt: 10.44, reasoning: 0.11, completion: 0.16 },
  { date: "2026-09-16", prompt: 12.08, reasoning: 0.14, completion: 0.19 },
  { date: "2026-09-17", prompt: 11.86, reasoning: 0.13, completion: 0.18 },
  { date: "2026-09-18", prompt: 13.05, reasoning: 0.16, completion: 0.21 },
  { date: "2026-09-19", prompt: 14.24, reasoning: 0.17, completion: 0.19 },
  { date: "2026-09-20", prompt: 4.92, reasoning: 0.05, completion: 0.07, estimated: true },
];

const pricePattern: ModelPricePoint[] = [
  { date: "2026-09-10", effectiveInput: 0.198, effectiveOutput: 0.128, listedInput: 0.302, listedOutput: 0.146 },
  { date: "2026-09-11", effectiveInput: 0.162, effectiveOutput: 0.104, listedInput: 0.302, listedOutput: 0.112 },
  { date: "2026-09-12", effectiveInput: 0.141, effectiveOutput: 0.096, listedInput: 0.172, listedOutput: 0.098 },
  { date: "2026-09-13", effectiveInput: 0.112, effectiveOutput: 0.093, listedInput: 0.118, listedOutput: 0.094 },
  { date: "2026-09-14", effectiveInput: 0.090, effectiveOutput: 0.082, listedInput: 0.122, listedOutput: 0.130 },
  { date: "2026-09-15", effectiveInput: 0.071, effectiveOutput: 0.068, listedInput: 0.158, listedOutput: 0.112 },
  { date: "2026-09-16", effectiveInput: 0.066, effectiveOutput: 0.063, listedInput: 0.183, listedOutput: 0.097 },
  { date: "2026-09-17", effectiveInput: 0.071, effectiveOutput: 0.072, listedInput: 0.145, listedOutput: 0.082 },
  { date: "2026-09-18", effectiveInput: 0.084, effectiveOutput: 0.061, listedInput: 0.093, listedOutput: 0.070 },
  { date: "2026-09-19", effectiveInput: 0.080, effectiveOutput: 0.057, listedInput: 0.110, listedOutput: 0.062 },
  { date: "2026-09-20", effectiveInput: 0.087, effectiveOutput: 0.063, listedInput: 0.092, listedOutput: 0.071 },
];

const scaleTokenActivity = (scale: number) =>
  tokenPattern.map((point) => ({
    ...point,
    prompt: Number((point.prompt * scale).toFixed(3)),
    reasoning: Number((point.reasoning * scale).toFixed(3)),
    completion: Number((point.completion * scale).toFixed(3)),
  }));

const scalePriceHistory = (scale: number) =>
  pricePattern.map((point) => ({
    date: point.date,
    effectiveInput: Number((point.effectiveInput * scale).toFixed(4)),
    effectiveOutput: Number((point.effectiveOutput * scale).toFixed(4)),
    listedInput: Number((point.listedInput * scale).toFixed(4)),
    listedOutput: Number((point.listedOutput * scale).toFixed(4)),
  }));

export const llmModels: LlmModelDefinition[] = [
  {
    slug: "deepseek-v41-flash",
    name: "DeepSeek V4.1 Flash",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "面向高吞吐推理场景的通用模型，在 OpenRouter 最新完整日统计中位居 Token 消耗榜首。",
    ranking: { day: { value: 14.6, display: "14.6T", change: 300 }, week: { value: 58.2, display: "58.2T", change: 126 }, month: { value: 182, display: "182T", change: 64 } },
    tokenActivity: tokenPattern,
    priceHistory: pricePattern,
  },
  {
    slug: "glm-53-flash",
    name: "GLM 5.3 Flash",
    provider: "z-ai",
    providerLabel: "Z.ai",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "轻量级高频调用模型，适合成本敏感的对话、摘要和批处理推理需求。",
    ranking: { day: { value: 13, display: "13.0T", change: 8 }, week: { value: 84.5, display: "84.5T", change: 18 }, month: { value: 302, display: "302T", change: 22 } },
    tokenActivity: scaleTokenActivity(0.89),
    priceHistory: scalePriceHistory(0.74),
  },
  {
    slug: "gpt-56-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    providerLabel: "OpenAI",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "综合型大语言模型，兼顾通用任务、代理工作流和多步骤推理应用。",
    ranking: { day: { value: 12.4, display: "12.4T", change: 24 }, week: { value: 72.1, display: "72.1T", change: 21 }, month: { value: 251, display: "251T", change: 19 } },
    tokenActivity: scaleTokenActivity(0.85),
    priceHistory: scalePriceHistory(1.18),
  },
  {
    slug: "hy4-preview",
    name: "Hy4 preview",
    provider: "tencent",
    providerLabel: "Tencent",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "预览版模型近期调用增长较快，适合观察新模型在开发者流量中的扩散速度。",
    ranking: { day: { value: 11.9, display: "11.9T", change: 31 }, week: { value: 52.6, display: "52.6T", change: 45 }, month: { value: 149, display: "149T", change: 38 } },
    tokenActivity: scaleTokenActivity(0.82),
    priceHistory: scalePriceHistory(0.93),
  },
  {
    slug: "deepseek-v4-flash-0731",
    name: "DeepSeek V4 Flash 0731",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "DeepSeek Flash 系列的稳定版本，保持较高 Token 流量与良好的价格敏感度。",
    ranking: { day: { value: 9.77, display: "9.77T", change: 16 }, week: { value: 44.3, display: "44.3T", change: 11 }, month: { value: 133, display: "133T", change: 17 } },
    tokenActivity: scaleTokenActivity(0.67),
    priceHistory: scalePriceHistory(0.88),
  },
  {
    slug: "mimo-v25",
    name: "MiMo-V2.5",
    provider: "xiaomi",
    providerLabel: "Xiaomi",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "高性价比模型，在应用型调用中保持稳定需求。",
    ranking: { day: { value: 7.17, display: "7.17T", change: 4 }, week: { value: 39.8, display: "39.8T", change: 7 }, month: { value: 118, display: "118T", change: 9 } },
    tokenActivity: scaleTokenActivity(0.49),
    priceHistory: scalePriceHistory(0.66),
  },
  {
    slug: "hy3",
    name: "Hy3",
    provider: "tencent",
    providerLabel: "Tencent",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "成熟通用模型，近七日调用仍保持增长。",
    ranking: { day: { value: 4.75, display: "4.75T", change: 30 }, week: { value: 28.6, display: "28.6T", change: 26 }, month: { value: 92.4, display: "92.4T", change: 18 } },
    tokenActivity: scaleTokenActivity(0.33),
    priceHistory: scalePriceHistory(0.79),
  },
  {
    slug: "nemotron-3-ultra-free",
    name: "Nemotron 3 Ultra 550B A55B",
    provider: "nvidia",
    providerLabel: "NVIDIA",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "免费版本带来较高试用流量，适合观察开放入口对模型调用量的放大作用。",
    ranking: { day: { value: 4.19, display: "4.19T", change: 16 }, week: { value: 20.9, display: "20.9T", change: 14 }, month: { value: 61.3, display: "61.3T", change: 10 } },
    tokenActivity: scaleTokenActivity(0.29),
    priceHistory: scalePriceHistory(0.52),
  },
];

export function getRankedModels(window: ModelRankingWindow) {
  return [...llmModels].sort((a, b) => b.ranking[window].value - a.ranking[window].value);
}

export function getLlmModel(slug: string) {
  return llmModels.find((model) => model.slug === slug);
}
