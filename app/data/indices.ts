export type IndexCategory = "token" | "gpu" | "ram";

export type IndexDefinition = {
  slug: string;
  category: IndexCategory;
  name: string;
  code: string;
  value: string;
  unit: string;
  change: number;
  updatedAt: string;
  updateSchedule: string | null;
  description: string;
  sourceUrl: string;
  history?: Array<{ date: string; value: number }>;
};

export const indexDefinitions: IndexDefinition[] = [
  {
    slug: "llm-token-expenditure",
    category: "token",
    name: "LLM Token支出指数",
    code: "SDLLMTK",
    value: "$1.01",
    unit: "/M tokens",
    change: 3.4,
    updatedAt: "2026年09月18日",
    updateSchedule: null,
    description: "反映活跃 LLM 市场每百万 Token 的综合支出水平，用于观察 AI 推理价格的整体变化。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/llm-token-expenditure-index",
  },
  {
    slug: "open-llm-token-expenditure",
    category: "token",
    name: "开源LLM Token支出指数",
    code: "SDLLM-OPEN",
    value: "$0.50",
    unit: "/M tokens",
    change: -5.3,
    updatedAt: "2026年09月18日",
    updateSchedule: null,
    description: "反映开源及开放权重模型市场每百万 Token 的支出水平，便于观察开源模型推理成本变化。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/llm-token-expenditure-index",
    history: [
      { date: "2026-09-12", value: 0.5243 },
      { date: "2026-09-13", value: 0.5244 },
      { date: "2026-09-14", value: 0.5202 },
      { date: "2026-09-15", value: 0.5133 },
      { date: "2026-09-16", value: 0.5086 },
      { date: "2026-09-17", value: 0.5028 },
      { date: "2026-09-18", value: 0.4965 },
    ],
  },
  {
    slug: "proprietary-llm-token",
    category: "token",
    name: "闭源LLM Token指数",
    code: "SDLLM-PROP",
    value: "$1.85",
    unit: "/M tokens",
    change: 3.5,
    updatedAt: "2026年09月18日",
    updateSchedule: null,
    description: "反映闭源大语言模型市场每百万 Token 的支出水平，呈现商业模型推理价格走势。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/llm-token-expenditure-index",
    history: [
      { date: "2026-09-12", value: 1.7852 },
      { date: "2026-09-13", value: 1.7063 },
      { date: "2026-09-14", value: 1.6379 },
      { date: "2026-09-15", value: 1.633 },
      { date: "2026-09-16", value: 1.6459 },
      { date: "2026-09-17", value: 1.7234 },
      { date: "2026-09-18", value: 1.8476 },
    ],
  },
  {
    slug: "h100",
    category: "gpu",
    name: "H100 GPU租赁指数",
    code: "SDH100RT",
    value: "$2.63",
    unit: "/GPU·h",
    change: -0.4,
    updatedAt: "2026年09月19日",
    updateSchedule: null,
    description: "追踪 NVIDIA H100 在云端及专业 GPU 租赁市场的标准化每小时租赁价格。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/h100",
    history: [
      { date: "2026-09-13", value: 2.64 },
      { date: "2026-09-14", value: 2.66 },
      { date: "2026-09-15", value: 2.66 },
      { date: "2026-09-16", value: 2.66 },
      { date: "2026-09-17", value: 2.65 },
      { date: "2026-09-18", value: 2.65 },
      { date: "2026-09-19", value: 2.63 },
    ],
  },
  {
    slug: "h100-hyperscaler",
    category: "gpu",
    name: "H100 Hyperscaler（超大规模云）",
    code: "H100-HYP",
    value: "$7.20",
    unit: "/GPU·h",
    change: 0.1,
    updatedAt: "2026年09月19日",
    updateSchedule: null,
    description: "追踪超大规模云服务商的 H100 按需租赁价格，用于观察企业级云端算力成本。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/h100",
    history: [
      { date: "2026-09-13", value: 7.19 },
      { date: "2026-09-14", value: 7.17 },
      { date: "2026-09-15", value: 7.18 },
      { date: "2026-09-16", value: 7.18 },
      { date: "2026-09-17", value: 7.2 },
      { date: "2026-09-18", value: 7.2 },
      { date: "2026-09-19", value: 7.2 },
    ],
  },
  {
    slug: "a100",
    category: "gpu",
    name: "A100 GPU租赁指数",
    code: "SDA100RT",
    value: "$1.58",
    unit: "/GPU·h",
    change: -0.6,
    updatedAt: "2026年09月19日",
    updateSchedule: null,
    description: "追踪 NVIDIA A100 的标准化每小时租赁价格，覆盖推理、微调和成本敏感型训练需求。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/a100",
    history: [
      { date: "2026-09-13", value: 1.59 },
      { date: "2026-09-14", value: 1.58 },
      { date: "2026-09-15", value: 1.58 },
      { date: "2026-09-16", value: 1.58 },
      { date: "2026-09-17", value: 1.58 },
      { date: "2026-09-18", value: 1.58 },
      { date: "2026-09-19", value: 1.58 },
    ],
  },
  {
    slug: "b200",
    category: "gpu",
    name: "B200 GPU租赁指数",
    code: "SDB200RT",
    value: "$5.73",
    unit: "/GPU·h",
    change: 0.5,
    updatedAt: "2026年09月19日",
    updateSchedule: null,
    description: "追踪 NVIDIA Blackwell B200 的标准化每小时租赁价格，反映前沿训练算力市场成本。",
    sourceUrl: "https://www.silicondata.com/products/silicon-index/b200",
    history: [
      { date: "2026-09-13", value: 5.7 },
      { date: "2026-09-14", value: 5.72 },
      { date: "2026-09-15", value: 5.73 },
      { date: "2026-09-16", value: 5.73 },
      { date: "2026-09-17", value: 5.71 },
      { date: "2026-09-18", value: 5.72 },
      { date: "2026-09-19", value: 5.73 },
    ],
  },
  {
    slug: "gddr6-ram",
    category: "ram",
    name: "GDDR6 RAM内存指数",
    code: "SDGDDR6",
    value: "$19.06",
    unit: "/GB",
    change: 1.0,
    updatedAt: "2026年09月19日",
    updateSchedule: "每日 00:00（北京时间）",
    description: "追踪 GDDR6 批发市场的每日现货价格，为显存采购、成本评估和市场观察提供参考。",
    sourceUrl: "https://www.silicondata.com/products/ram-index",
    history: [
      { date: "2026-09-13", value: 18.88 },
      { date: "2026-09-14", value: 18.88 },
      { date: "2026-09-15", value: 19.06 },
      { date: "2026-09-16", value: 19.06 },
      { date: "2026-09-17", value: 19.06 },
      { date: "2026-09-18", value: 19.06 },
      { date: "2026-09-19", value: 19.06 },
    ],
  },
];

export const tokenIndices = indexDefinitions.filter((item) => item.category === "token");
export const gpuIndices = indexDefinitions.filter((item) => item.category === "gpu");
export const ramIndices = indexDefinitions.filter((item) => item.category === "ram");

export function getIndexDefinition(slug: string) {
  return indexDefinitions.find((item) => item.slug === slug);
}
