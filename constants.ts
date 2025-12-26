
import { TimeRange, Order, TrendProduct, ProductInventory, CustomerPersona, ReputationMetric, ScatterPoint, ExternalReview, TrafficSource } from './types';

export const COLORS = {
  ROSE_GOLD: '#D49680',
  NUDE: '#FDF5F2',
  SAGE: '#7D9282',
  DEEP_ROSE: '#BE123C',
  GLOW_GOLD: '#B45309',
  CHAMPAGNE: '#F3E5D8',
  SILK_PINK: '#F8D7CC',
  EMERALD: '#059669',
  ROSE_LIGHT: '#E11D48',
  CORAL_SOFT: '#F2A695',
  MATTE_GRAY: '#475569',
  TURQUOISE: '#0F766E'
};

export const MOCK_TRAFFIC_SOURCES: TrafficSource[] = [
  { name: 'Instagram', value: 45, color: COLORS.ROSE_GOLD, growth: 12 },
  { name: 'TikTok', value: 25, color: COLORS.MATTE_GRAY, growth: 34 },
  { name: 'Pinterest', value: 15, color: COLORS.DEEP_ROSE, growth: 8 },
  { name: 'Doğrudan', value: 10, color: COLORS.SAGE, growth: 2 },
  { name: 'Google', value: 5, color: COLORS.TURQUOISE, growth: -3 },
];

export const getDynamicMockData = (range: TimeRange) => {
  const multiplier = range === TimeRange.LAST_24H ? 0.1 : range === TimeRange.LAUNCH_WEEK ? 2.5 : range === TimeRange.THIS_MONTH ? 1 : 1.8;
  
  const baseSales = [4200, 4800, 7500, 6200, 5800, 9800, 8400];
  const dynamicTrends = baseSales.map(v => Math.round(v * multiplier * (0.9 + Math.random() * 0.2)));

  const kpis = {
    conversion: (4.1 + Math.random() * 1.2 * multiplier).toFixed(1) + "%",
    revenue: "₺" + (Math.round(920000 * multiplier / 1000) * 1000).toLocaleString(),
    aov: "₺" + Math.round(520 + Math.random() * 150).toLocaleString(), 
    retention: Math.round(76 + Math.random() * 6) + "%",
    refund: (0.4 + Math.random() * 0.2).toFixed(1) + "%", 
    nps: Math.round(91 + Math.random() * 4).toString()
  };

  const chartData = [
    { day: 'Pzt', sales: dynamicTrends[0] },
    { day: 'Sal', sales: dynamicTrends[1] },
    { day: 'Çar', sales: dynamicTrends[2] },
    { day: 'Per', sales: dynamicTrends[3] },
    { day: 'Cum', sales: dynamicTrends[4] },
    { day: 'Cmt', sales: dynamicTrends[5] },
    { day: 'Paz', sales: dynamicTrends[6] },
  ];

  return { kpis, chartData };
};

export const MOCK_EXTERNAL_REVIEWS: ExternalReview[] = [
  { id: 'er1', source: 'Amazon', author: 'Selin Y.', rating: 5, comment: 'İçerikler inanılmaz kaliteli, ayrıca tavsiye edilen serumun dokusu tam anlatıldığı gibi.', date: '2 saat önce', product: 'Premium Editoryal Akış' },
  { id: 'er2', source: 'Hepsiburada', author: 'Aylin B.', rating: 4, comment: 'Görsel estetiği çok yüksek bir uygulama. Okuma modu çok göz yormuyor.', date: '1 gün önce', product: 'Sanat ve Tasarım Serisi' },
  { id: 'er3', source: 'Trendyol', author: 'Meltem K.', rating: 5, comment: 'Abonelik ücretine kesinlikle değer. Bilgi kirliliği yok.', date: '3 gün önce', product: 'Yıllık Geçiş Kartı' },
];

export const MOCK_PERSONAS: CustomerPersona[] = [
  { id: 'p1', name: 'Cilt Bakımı Tutkunları', description: 'İçerik okurlar ve önerilen ürünleri anında satın alırlar. Klinik veri odaklıdırlar.', aov: '₺2.150', keyToConvince: 'Bilimsel Kanıt', icon: '🧪', color: COLORS.SAGE, ltv: 85 },
  { id: 'p2', name: 'Trend Avcıları', description: 'Viral içerik ve sınırlı üretim ürün avcıları. Sosyal kanıt öncelikleridir.', aov: '₺1.400', keyToConvince: 'Influencer Viral Etkisi', icon: '✨', color: COLORS.ROSE_GOLD, ltv: 45 },
  { id: 'p3', name: 'Doğalcılar', description: 'Vegan içerik ve sürdürülebilir ürün odaklılar.', aov: '₺1.850', keyToConvince: 'Ekolojik Sertifikasyon', icon: '🌿', color: COLORS.EMERALD, ltv: 65 },
  { id: 'p4', name: 'Gen-Z Öncüleri', description: 'Hızlı tüketen, şeffaflık arayan ve markayla etkileşime giren dinamik kitle.', aov: '₺850', keyToConvince: 'Özgünlük ve Şeffaflık', icon: '🤳', color: COLORS.TURQUOISE, ltv: 40 },
  { id: 'p5', name: 'Olgun Lüks', description: 'Prestijli içerik ve VIP ürün setleri arayan, yüksek sadakatli kitle.', aov: '₺4.800', keyToConvince: 'Eksklüzivite ve Prestij', icon: '💎', color: COLORS.GLOW_GOLD, ltv: 95 },
  { id: 'p6', name: 'Minimalist Profesyoneller', description: 'Meşgul profesyoneller. Günlük özetler ve pratik ürünler ararlar.', aov: '₺2.600', keyToConvince: 'Zaman Verimliliği', icon: '💼', color: COLORS.MATTE_GRAY, ltv: 70 },
  { id: 'p7', name: 'Sessiz Entelektüeller', description: 'Derin okuma yapan, fiziksel ürün alımında seçici ve kalite odaklı grup.', aov: '₺3.200', keyToConvince: 'İçerik Derinliği', icon: '📚', color: COLORS.DEEP_ROSE, ltv: 90 },
  { id: 'p8', name: 'Küresel Vizyonerler', description: 'Dünya trendlerini takip eden, global kürasyonlara yatırım yapan kesim.', aov: '₺5.500', keyToConvince: 'Küresel Perspektif', icon: '🌍', color: COLORS.EMERALD, ltv: 88 },
  { id: 'p9', name: 'Yaratıcı Göçebeler', description: 'İlham arayan ve estetik objelere/içeriklere ilgi duyan gezginler.', aov: '₺1.200', keyToConvince: 'Esneklik ve İlham', icon: '🎨', color: COLORS.CORAL_SOFT, ltv: 55 },
];

export const MOCK_ORDERS: Order[] = [
  { id: '1', customer: 'Ayşe Y.', amount: '₺450', product: 'Yıllık Elite Üyelik', time: '2 dk önce', status: 'Hazırlanıyor', channel: 'App Store', aura: 'GOLD_GLOW', priority: 'Yeni Abone' },
  { id: '2', customer: 'Merve K.', amount: '₺1.250', product: 'Altın Işıltı Serumu (Sınırlı)', time: '5 dk önce', status: 'Paketlendi', channel: 'Web', aura: 'STABLE', priority: 'Yoğun Kullanıcı' },
  { id: '3', customer: 'Canan B.', amount: '₺0', product: 'Üyelik İptali', time: '12 dk önce', status: 'İade', channel: 'Google Play', aura: 'RED_PULSE', priority: 'Abonelikten Çıkan' },
  { id: '4', customer: 'Bora S.', amount: '₺0', product: 'Editoryal Önizleme', time: '15 dk önce', status: 'Hazırlanıyor', channel: 'Instagram', aura: 'GOLD_GLOW', priority: 'Abonelik Potansiyeli' },
  { id: '5', customer: 'Derya L.', amount: '₺2.800', product: 'İpek Bornoz ve Gece Seti', time: '22 dk önce', status: 'Paketlendi', channel: 'Web', aura: 'STABLE', priority: 'Yoğun Kullanıcı' },
  { id: '6', customer: 'Emre Ç.', amount: '₺450', product: 'Aylık Lüks Üyelik', time: '30 dk önce', status: 'Hazırlanıyor', channel: 'App Store', aura: 'STABLE', priority: 'Yeni Abone' },
];

export const MOCK_INVENTORY: ProductInventory[] = [
  { id: 'p1', name: 'Güzellik ve Bilim Serisi (İçerik)', stock: 92, traffic: 'Yüksek', currentPrice: '₺250', margin: '%85', status: 'Dengeli' },
  { id: 'p2', name: 'Altın Işıltı Serumu (Fiziksel)', stock: 12, traffic: 'Yüksek', currentPrice: '₺1.250', margin: '%60', status: 'Kritik' },
  { id: 'p3', name: 'Paris Moda Haftası Özel (İçerik)', stock: 10, traffic: 'Yüksek', currentPrice: '₺450', margin: '%92', status: 'Kritik' },
  { id: 'p4', name: 'İpek Uyku Maskesi (Fiziksel)', stock: 45, traffic: 'Orta', currentPrice: '₺350', margin: '%50', status: 'Dengeli' },
];

export const REPUTATION_RADAR: ReputationMetric[] = [
  { subject: 'İçerik Derinliği', score: 98, fullMark: 100 },
  { subject: 'Ürün Kalitesi', score: 92, fullMark: 100 },
  { subject: 'Arayüz Zerafeti', score: 95, fullMark: 100 },
  { subject: 'Kürasyon Başarısı', score: 90, fullMark: 100 },
  { subject: 'Teslimat Hızı', score: 82, fullMark: 100 },
];

export const SCATTER_DATA: ScatterPoint[] = [
  { x: 8000, y: 95, z: 20, name: 'Ayşe VIP', isVIP: true, hasRisk: false },
  { x: 7500, y: 30, z: 15, name: 'Merve (Churn Riski)', isVIP: true, hasRisk: true },
  { x: 2000, y: 88, z: 40, name: 'Selin S.', isVIP: false, hasRisk: false },
  { x: 5500, y: 60, z: 25, name: 'Canan B.', isVIP: true, hasRisk: false },
];

export const TREND_CHART_DATA = [
  { day: 'Pzt', sales: 4200, volume: 3000, star: 'Paris Modası', mood: 'Durağan', campaign: false },
  { day: 'Sal', sales: 4800, volume: 3500, star: 'Paris Modası', mood: 'Yükselişte', campaign: false },
  { day: 'Çar', sales: 7500, volume: 6000, star: 'Altın Serum', mood: 'Viral (Satış Patlaması)', campaign: true },
  { day: 'Per', sales: 6200, volume: 4500, star: 'Altın Serum', mood: 'Aktif', campaign: false },
  { day: 'Cum', sales: 5800, volume: 4200, star: 'İpek Arşivi', mood: 'Hafta Sonu Modu', campaign: false },
  { day: 'Cmt', sales: 9800, volume: 8200, star: 'Elite Üyelik', mood: 'Zirve (Abonelik)', campaign: true },
  { day: 'Paz', sales: 8400, volume: 7000, star: 'Pazar Editoryal', mood: 'Derin Okuma', campaign: false },
];

export const RANGE_LABELS: Record<TimeRange, string> = {
  [TimeRange.LAST_24H]: 'Son 24 Saat',
  [TimeRange.LAUNCH_WEEK]: 'Lansman Haftası',
  [TimeRange.THIS_MONTH]: 'Bu Ay',
  [TimeRange.SEASONAL]: 'Mevsimsel Trend',
  [TimeRange.CUSTOM]: 'Özel Seçim',
};
