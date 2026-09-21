export type ModelRankingWindow = "day" | "week" | "month";

export const modelRankingWindows: Record<ModelRankingWindow, string> = {
  day: "当日最新",
  week: "近7日",
  month: "近30日",
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

const weeklyTokenPattern: ModelTokenPoint[] = [
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

const tokenPattern: ModelTokenPoint[] = weeklyTokenPattern.map((point) => ({
  ...point,
  prompt: Number((point.prompt / 7).toFixed(3)),
  reasoning: Number((point.reasoning / 7).toFixed(3)),
  completion: Number((point.completion / 7).toFixed(3)),
}));

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

const llmModelSeeds: LlmModelDefinition[] = [
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
  {
    slug: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "Flash 系列模型，适合高并发、低延迟推理场景。",
    ranking: { day: { value: 3.87, display: "3.87T", change: 13 }, week: { value: 19.4, display: "19.4T", change: 9 }, month: { value: 58.2, display: "58.2T", change: 8 } },
    tokenActivity: scaleTokenActivity(0.265),
    priceHistory: scalePriceHistory(0.7),
  },
  {
    slug: "glm-53",
    name: "GLM 5.3",
    provider: "z-ai",
    providerLabel: "Z.ai",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "通用大语言模型，适用于复杂对话、知识问答与应用集成。",
    ranking: { day: { value: 2.97, display: "2.97T", change: 12 }, week: { value: 17.8, display: "17.8T", change: 10 }, month: { value: 55.9, display: "55.9T", change: 13 } },
    tokenActivity: scaleTokenActivity(0.203),
    priceHistory: scalePriceHistory(0.82),
  },
  {
    slug: "claude-fable-51",
    name: "Claude Fable 5.1",
    provider: "anthropic",
    providerLabel: "Anthropic",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "面向复杂文本生成与代理任务的高阶模型。",
    ranking: { day: { value: 2.52, display: "2.52T", change: 6 }, week: { value: 15.6, display: "15.6T", change: 5 }, month: { value: 48.5, display: "48.5T", change: 7 } },
    tokenActivity: scaleTokenActivity(0.173),
    priceHistory: scalePriceHistory(1.32),
  },
  {
    slug: "qwen38-max",
    name: "Qwen3.8 Max",
    provider: "qwen",
    providerLabel: "Qwen",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "多语言与代码能力均衡的大模型，适合中文场景和工程任务。",
    ranking: { day: { value: 2.31, display: "2.31T", change: 9 }, week: { value: 14.2, display: "14.2T", change: 8 }, month: { value: 46.1, display: "46.1T", change: 10 } },
    tokenActivity: scaleTokenActivity(0.158),
    priceHistory: scalePriceHistory(0.9),
  },
  {
    slug: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "openai",
    providerLabel: "OpenAI",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "面向复杂推理和高价值任务的前沿模型。",
    ranking: { day: { value: 2.08, display: "2.08T", change: 18 }, week: { value: 12.7, display: "12.7T", change: 16 }, month: { value: 43.3, display: "43.3T", change: 21 } },
    tokenActivity: scaleTokenActivity(0.142),
    priceHistory: scalePriceHistory(1.58),
  },
  {
    slug: "grok-46-high",
    name: "Grok 4.6 High",
    provider: "x-ai",
    providerLabel: "xAI",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "偏向实时对话和长上下文交互的模型。",
    ranking: { day: { value: 1.84, display: "1.84T", change: 7 }, week: { value: 11.8, display: "11.8T", change: 6 }, month: { value: 37.2, display: "37.2T", change: 9 } },
    tokenActivity: scaleTokenActivity(0.126),
    priceHistory: scalePriceHistory(1.08),
  },
  {
    slug: "kimi-k3-max",
    name: "Kimi K3 Max",
    provider: "moonshotai",
    providerLabel: "Moonshot AI",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "长文本处理和中文内容场景表现稳定的模型。",
    ranking: { day: { value: 1.68, display: "1.68T", change: 5 }, week: { value: 10.6, display: "10.6T", change: 4 }, month: { value: 34.9, display: "34.9T", change: 6 } },
    tokenActivity: scaleTokenActivity(0.115),
    priceHistory: scalePriceHistory(0.76),
  },
  {
    slug: "llama-31-405b",
    name: "Llama 3.1 405B",
    provider: "meta",
    providerLabel: "Meta",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "开放权重生态中的大型通用模型，适合企业自定义部署评估。",
    ranking: { day: { value: 1.42, display: "1.42T", change: 3 }, week: { value: 9.2, display: "9.2T", change: 2 }, month: { value: 31.4, display: "31.4T", change: 4 } },
    tokenActivity: scaleTokenActivity(0.097),
    priceHistory: scalePriceHistory(0.62),
  },
  {
    slug: "mistral-large-3",
    name: "Mistral Large 3",
    provider: "mistralai",
    providerLabel: "Mistral AI",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "兼顾多语言、代码与低延迟服务的欧洲模型。",
    ranking: { day: { value: 1.26, display: "1.26T", change: 4 }, week: { value: 8.4, display: "8.4T", change: 3 }, month: { value: 28.7, display: "28.7T", change: 5 } },
    tokenActivity: scaleTokenActivity(0.086),
    priceHistory: scalePriceHistory(0.95),
  },
  {
    slug: "gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "google",
    providerLabel: "Google",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "多模态与复杂任务能力较强的通用模型。",
    ranking: { day: { value: 1.12, display: "1.12T", change: 11 }, week: { value: 7.6, display: "7.6T", change: 12 }, month: { value: 25.3, display: "25.3T", change: 15 } },
    tokenActivity: scaleTokenActivity(0.077),
    priceHistory: scalePriceHistory(1.22),
  },
  {
    slug: "phi-5-mini",
    name: "Phi 5 Mini",
    provider: "microsoft",
    providerLabel: "Microsoft",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "小型高效模型，适合轻量级应用和边缘推理评估。",
    ranking: { day: { value: 0.94, display: "940B", change: 2 }, week: { value: 6.2, display: "6.2T", change: 3 }, month: { value: 21.8, display: "21.8T", change: 4 } },
    tokenActivity: scaleTokenActivity(0.064),
    priceHistory: scalePriceHistory(0.48),
  },
  {
    slug: "command-r-plus",
    name: "Command R Plus",
    provider: "cohere",
    providerLabel: "Cohere",
    latestBucket: "2026年09月19日",
    sourceUrl: "https://openrouter.ai/rankings?view=day#leaderboard-table",
    summary: "面向企业检索增强与工作流自动化的模型。",
    ranking: { day: { value: 0.82, display: "820B", change: 1 }, week: { value: 5.8, display: "5.8T", change: 2 }, month: { value: 18.6, display: "18.6T", change: 3 } },
    tokenActivity: scaleTokenActivity(0.056),
    priceHistory: scalePriceHistory(0.86),
  },
];

export function formatTokenVolume(valueInTrillions: number) {
  if (valueInTrillions >= 1) return `${Number(valueInTrillions.toFixed(2))}万亿`;
  return `${Number((valueInTrillions * 10000).toFixed(1))}亿`;
}

export const llmModels: LlmModelDefinition[] = llmModelSeeds.map((model) => {
  const weekly = model.ranking.day;
  const dailyValue = weekly.value / 7;
  return {
    ...model,
    ranking: {
      day: { ...weekly, value: dailyValue, display: formatTokenVolume(dailyValue) },
      week: { ...model.ranking.week, value: weekly.value, display: formatTokenVolume(weekly.value) },
      month: { ...model.ranking.month, display: formatTokenVolume(model.ranking.month.value) },
    },
  };
});

export function getRankedModels(window: ModelRankingWindow) {
  return [...llmModels].sort((a, b) => b.ranking[window].value - a.ranking[window].value);
}

export function getLlmModel(slug: string) {
  return llmModels.find((model) => model.slug === slug);
}
