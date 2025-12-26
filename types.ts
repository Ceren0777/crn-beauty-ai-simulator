
export enum TimeRange {
  LAST_24H = 'LAST_24H',
  LAUNCH_WEEK = 'LAUNCH_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  SEASONAL = 'SEASONAL',
  CUSTOM = 'CUSTOM'
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  CUSTOMER_DNA = 'CUSTOMER_DNA',
  OPERATIONS = 'OPERATIONS',
  SATISFACTION = 'SATISFACTION',
  COMPARISON = 'COMPARISON',
  SIMULATOR = 'SIMULATOR',
  PRICING_ENGINE = 'PRICING_ENGINE',
  PERSONAS = 'PERSONAS',
  REPUTATION = 'REPUTATION',
  MARKET_INSIGHTS = 'MARKET_INSIGHTS'
}

export interface KPIModel {
  label: string;
  value: string | number;
  change: number;
  insight: string;
  color: string;
}

export type OrderAura = 'GOLD_GLOW' | 'RED_PULSE' | 'STABLE';

export interface Order {
  id: string;
  customer: string;
  amount: string;
  product: string;
  productImage?: string;
  time: string;
  status: 'Hazırlanıyor' | 'Paketlendi' | 'Kargoda' | 'Teslim Edildi' | 'İade';
  channel: string;
  aura: OrderAura;
  priority: string;
  customerHistory?: {
    orderCount: number;
    favorite: string;
    behavior: string;
  };
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
  growth: number;
}

export interface ProductInventory {
  id: string;
  name: string;
  stock: number;
  traffic: 'Yüksek' | 'Orta' | 'Düşük';
  currentPrice: string;
  margin: string;
  status: 'Kritik' | 'Dengeli' | 'Atıl';
}

export interface CustomerPersona {
  id: string;
  name: string;
  description: string;
  aov: string;
  keyToConvince: string;
  icon: string;
  color: string;
  ltv: number;
}

export interface ReputationMetric {
  subject: string;
  score: number;
  fullMark: number;
}

export interface ScatterPoint {
  x: number; // LTV
  y: number; // Sentiment Score
  z: number; // Order frequency
  name: string;
  isVIP: boolean;
  hasRisk: boolean;
}

export interface ExternalReview {
  id: string;
  source: 'Trendyol' | 'Hepsiburada' | 'Amazon';
  author: string;
  rating: number;
  comment: string;
  date: string;
  product: string;
}

export interface MarketAnalysisReport {
  summary: string;
  positives: string[];
  negatives: string[];
  actionRecommendation: string;
}

export interface SimulatorState {
  price: number; 
  budget: number; 
  influencer: number; 
  season: number; 
}

export interface SimulationResult {
  revenue: number;
  stockRisk: number;
  profitMargin: number;
  chartData: any[];
}

export interface TrendProduct {
  day: string;
  sales: number;
  volume: number;
  star: string;
  mood: string;
  campaign: boolean;
}

export interface SkinTypeData {
  type: string;
  value: number;
  color: string;
}

export interface SentimentPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}
