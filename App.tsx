
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TimeRange, KPIModel, ViewType, Order, SimulatorState, SimulationResult, ProductInventory, CustomerPersona, ReputationMetric, ScatterPoint, ExternalReview, MarketAnalysisReport, TrafficSource } from './types';
import { COLORS, RANGE_LABELS, MOCK_ORDERS, TREND_CHART_DATA, MOCK_INVENTORY, MOCK_PERSONAS, REPUTATION_RADAR, SCATTER_DATA, MOCK_EXTERNAL_REVIEWS, getDynamicMockData, MOCK_TRAFFIC_SOURCES } from './constants';
import { getBeautyInsights, getAiConsultantAction, getMarketSentimentAnalysis } from './geminiService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie
} from 'recharts';

// --- Paylaşılan Bileşenler ---

const GlassPanel: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => (
  <div 
    className={`glass rounded-[2rem] p-8 shadow-2xl overflow-hidden transition-all duration-300 hover:bg-white/80 ${className}`} 
    style={style}
  >
    {children}
  </div>
);

const AIActionButton: React.FC<{ label: string; onClick: () => void; icon?: string; color?: string }> = ({ label, onClick, icon = 'wand', color }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950 border border-slate-700 text-white text-[10px] uppercase tracking-widest font-black hover:bg-black transition-all shadow-xl active:scale-95 ${color}`}
  >
    {icon === 'wand' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 002.828 0l1.428-1.428a2 2 0 000-2.828l-1.428-1.428zM15 3a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h10z" /></svg>}
    {icon === 'market' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
    {icon === 'bolt' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
    {label}
  </button>
);

// --- Stratejik Görünümler ---

const MarketInsightsView: React.FC<{ onAiAction: (s: string) => void }> = ({ onAiAction }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<MarketAnalysisReport | null>(null);

  const generateMarketReport = async () => {
    setAnalyzing(true);
    const result = await getMarketSentimentAnalysis(MOCK_EXTERNAL_REVIEWS);
    if (result?.error === "KEY_REQUIRED") {
        await (window as any).aistudio?.openSelectKey();
    } else if (result) {
        setReport(result);
    }
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex justify-between items-center px-4">
        <div>
           <h3 className="serif text-5xl italic text-slate-950 font-black mb-1">Duygu Sentezi</h3>
           <p className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">Okuyucu & Müşteri Geri Bildirimi</p>
        </div>
        <AIActionButton label={analyzing ? "AI Taraması..." : "Analiz Et"} icon="market" onClick={generateMarketReport} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <GlassPanel className="lg:col-span-6 border-slate-300">
           <h4 className="serif text-2xl italic text-slate-900 mb-6 font-bold">Gerçek Zamanlı Sesler</h4>
           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
              {MOCK_EXTERNAL_REVIEWS.map((review) => (
                <div key={review.id} className="p-6 rounded-[1.5rem] bg-white border border-slate-300 shadow-md hover:border-teal-600 transition-all">
                   <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-600">{review.source}</span>
                      <span className="text-yellow-500 text-xs">{'★'.repeat(review.rating)}</span>
                   </div>
                   <p className="text-[14px] text-slate-950 font-black leading-snug">"{review.comment}"</p>
                   <p className="mt-3 text-[10px] font-black text-slate-500 uppercase">{review.author} — {review.product}</p>
                </div>
              ))}
           </div>
        </GlassPanel>

        <GlassPanel className="lg:col-span-6 !bg-slate-950 text-white border-none">
           <h4 className="serif text-2xl italic text-teal-400 mb-8 font-bold">AI Strateji Önerisi</h4>
           {!report ? (
             <div className="h-[300px] flex flex-col items-center justify-center opacity-60">
                <p className="serif text-xl italic text-teal-100">Analiz bekleniyor...</p>
             </div>
           ) : (
             <div className="space-y-8 animate-fade-in">
                <p className="text-lg font-bold italic leading-relaxed text-teal-50 border-l-4 border-teal-500 pl-6">"{report.summary}"</p>
                <div className="grid grid-cols-1 gap-4">
                   <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-[9px] font-black uppercase text-emerald-400 mb-2">Başarılar</p>
                      <ul className="space-y-1">
                         {report.positives?.map((p, i) => <li key={i} className="text-[12px] font-black text-emerald-50 flex gap-2"><span>+</span>{p}</li>)}
                      </ul>
                   </div>
                   <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                      <p className="text-[9px] font-black uppercase text-rose-400 mb-2">Riskler</p>
                      <ul className="space-y-1">
                         {report.negatives?.map((n, i) => <li key={i} className="text-[12px] font-black text-rose-50 flex gap-2"><span>-</span>{n}</li>)}
                      </ul>
                   </div>
                </div>
                <button onClick={() => onAiAction("Stratejiyi uygula.")} className="w-full py-4 rounded-xl bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-teal-400">Onayla</button>
             </div>
           )}
        </GlassPanel>
      </div>
    </div>
  );
};

const SubscriberCockpitView: React.FC = () => {
    const categories = [
        { title: 'Yeni Üyeler', key: 'Yeni Abone' },
        { title: 'Ayrılanlar / Risk', key: 'Abonelikten Çıkan' },
        { title: 'Güçlü Etkileşim (VIP)', key: 'Yoğun Kullanıcı' },
        { title: 'Potansiyel Dönüşüm', key: 'Abonelik Potansiyeli' }
    ];

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[{ label: 'Toplam Okuyucu', val: '24.8K' }, { label: 'Yeni Üyelik', val: '1.2K' }, { label: 'Ürün Satışı', val: '142' }, { label: 'Ort. Oturum', val: '18dk' }].map((stat, i) => (
                    <GlassPanel key={i} className="!p-8 flex flex-col items-center border-slate-300">
                        <span className="text-[11px] font-black uppercase text-slate-600 mb-2">{stat.label}</span>
                        <span className="serif text-5xl text-slate-950 font-black">{stat.val}</span>
                    </GlassPanel>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {categories.map((cat) => (
                    <div key={cat.title} className="space-y-6">
                        <h4 className="px-4 text-[13px] font-black uppercase text-slate-900 tracking-[0.2em]">{cat.title}</h4>
                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {MOCK_ORDERS.filter(o => o.priority === cat.key).map(event => {
                                const isProduct = event.amount !== '₺0' && !event.product.toLowerCase().includes('pass') && !event.product.toLowerCase().includes('preview');
                                return (
                                    <div key={event.id} className={`p-6 rounded-[1.5rem] bg-white border-2 shadow-lg transition-all hover:scale-[1.02] ${event.aura === 'GOLD_GLOW' ? 'border-[#E5B4A1]' : event.aura === 'RED_PULSE' ? 'border-rose-500' : 'border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-black text-slate-950">{event.customer}</p>
                                            {isProduct && (
                                                <span className="px-2 py-0.5 bg-slate-950 text-white text-[8px] font-black rounded-full uppercase tracking-widest">Sipariş</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-bold mb-4 line-clamp-1">{event.product}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-[#D49680] uppercase tracking-widest">{event.amount === '₺0' ? 'Olay' : event.amount}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase">{event.time}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EditorialEngineView: React.FC<{ onAiAction: (s: string) => void }> = ({ onAiAction }) => (
  <div className="flex flex-col gap-10 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <GlassPanel className="!bg-[#E5B4A1]/20 border-[#E5B4A1] border-2 !p-12">
        <h3 className="serif text-4xl italic font-black text-slate-950 mb-6">Dönüşüm Odaklı Kürasyon</h3>
        <p className="text-slate-950 font-black text-lg mb-8 leading-relaxed">"Paris Moda Haftası içeriği okuyan kullanıcıların %18'i Altın Işıltı Serumu siparişi verdi. İçerik içi ürün yerleştirme optimize edilebilir."</p>
        <AIActionButton label="Satın Alma Akışını Düzenle" onClick={() => onAiAction("Moda haftası makalesine doğrudan satın al butonu eklendi.")} icon="bolt" />
      </GlassPanel>
      <GlassPanel className="!bg-emerald-100 border-emerald-400 border-2 !p-12">
        <h3 className="serif text-4xl italic font-black text-emerald-950 mb-6">Stok & İçerik Senkronu</h3>
        <p className="text-emerald-950 font-black text-lg mb-8 leading-relaxed">"İpek Uyku Maskesi stokları azalıyor. İlgili makalelerin gösterim sıklığı geçici olarak düşürülebilir."</p>
        <AIActionButton label="Algoritmayı Güncelle" color="!text-emerald-950 !bg-emerald-400" onClick={() => onAiAction("Stok kontrollü içerik dağıtımı aktif.")} />
      </GlassPanel>
    </div>
    <GlassPanel className="border-slate-300 border-2">
      <h3 className="serif text-4xl font-black mb-10 text-slate-950">Varlık Performans Matrisi</h3>
      <table className="w-full text-left">
        <thead><tr className="border-b-4 border-slate-100"><th className="pb-6 text-[12px] font-black text-slate-500 uppercase">Varlık (İçerik/Ürün)</th><th className="pb-6 text-[12px] font-black text-slate-500 uppercase">Başarı / Stok</th><th className="pb-6 text-[12px] font-black text-slate-500 uppercase">Trafik</th><th className="pb-6 text-[12px] font-black text-slate-500 uppercase">AI Durum</th></tr></thead>
        <tbody>{MOCK_INVENTORY.map(item => (<tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-6 font-black text-slate-950">{item.name}</td><td className="py-6 font-black text-slate-950">%{item.stock}</td><td className="py-6 font-black text-slate-950">{item.traffic}</td><td className="py-6"><span className={`text-[12px] font-black uppercase ${item.status === 'Kritik' ? 'text-rose-600' : 'text-emerald-600'}`}>{item.status}</span></td></tr>))}</tbody>
      </table>
    </GlassPanel>
  </div>
);

const WhatIfSimulatorView: React.FC = () => {
  const [state, setState] = useState<SimulatorState>({ price: 450, budget: 20000, influencer: 50, season: 1.2 });
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    // Simülasyon gecikmesi ekleyerek AI hissi veriyoruz
    setTimeout(() => {
        // ROI ve Risk Hesaplama Mantığı
        const roiFactor = 3.8; // Pazarlama bütçesi getirisi
        const influencerReachFactor = 250; // Her %1 influencer erişimi kaç kişi getirir
        
        const marketingRevenue = state.budget * roiFactor * state.season;
        const influencerRevenue = (state.influencer * influencerReachFactor) * state.price;
        const totalRevenue = marketingRevenue + influencerRevenue;

        // Risk faktörü: Çok yüksek influencer talebi stok/hizmet riski yaratır. 
        // Çok hızlı bütçe harcaması churn riskini artırır (düşük sadakatli kitle).
        const calculatedRisk = Math.min(100, (state.influencer * 0.7) + (state.budget / 4000) + (state.price > 1000 ? 15 : 0));
        const profit = 65 - (state.budget / 10000); // Bütçe arttıkça kâr marjı reklam maliyetiyle biraz düşer

        setResults({
          revenue: Math.round(totalRevenue),
          stockRisk: Math.round(calculatedRisk),
          profitMargin: Math.round(profit),
          chartData: []
        });
        setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
      <GlassPanel className="lg:col-span-4 space-y-12 border-slate-300 border-2">
        <h3 className="serif text-4xl italic text-slate-950 font-black">Ekosistem Simülatörü</h3>
        <div className="space-y-10">
          <div className="space-y-4">
              <div className="flex justify-between font-black text-[12px] text-slate-700 uppercase">
                <span>Pazarlama Bütçesi</span>
                <span className="text-[#D49680]">₺{state.budget.toLocaleString()}</span>
              </div>
              <input type="range" min="0" max="500000" step="5000" value={state.budget} onChange={e => setState({...state, budget: Number(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950" />
          </div>

          <div className="space-y-4">
              <div className="flex justify-between font-black text-[12px] text-slate-700 uppercase">
                <span>Influencer Erişimi</span>
                <span className="text-[#D49680]">%{state.influencer}</span>
              </div>
              <input type="range" min="0" max="100" value={state.influencer} onChange={e => setState({...state, influencer: Number(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950" />
          </div>

          <div className="space-y-4">
              <div className="flex justify-between font-black text-[12px] text-slate-700 uppercase">
                <span>Ort. Üyelik Ücreti</span>
                <span className="text-[#D49680]">₺{state.price}</span>
              </div>
              <input type="range" min="150" max="5000" step="50" value={state.price} onChange={e => setState({...state, price: Number(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950" />
          </div>

          <div className="space-y-4">
              <div className="flex justify-between font-black text-[12px] text-slate-700 uppercase">
                <span>Sezonluk Çarpan</span>
                <span className="text-[#D49680]">x{state.season}</span>
              </div>
              <select value={state.season} onChange={e => setState({...state, season: Number(e.target.value)})} className="w-full p-3 rounded-xl bg-slate-100 font-black text-sm border border-slate-200">
                <option value={1.0}>Normal Sezon (1.0x)</option>
                <option value={1.5}>Lansman Dönemi (1.5x)</option>
                <option value={2.0}>Yılbaşı / Özel Gün (2.0x)</option>
                <option value={0.8}>Düşük Sezon (0.8x)</option>
              </select>
          </div>
        </div>
        
        <button 
            disabled={isSimulating}
            onClick={runSimulation} 
            className={`w-full py-5 rounded-2xl bg-slate-950 text-white text-[12px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl ${isSimulating ? 'opacity-50 cursor-wait' : 'hover:bg-black hover:scale-[1.02]'}`}
        >
          {isSimulating ? 'Analiz Ediliyor...' : 'Sentezi Çalıştır'}
        </button>
      </GlassPanel>

      <div className="lg:col-span-8 flex flex-col gap-10">
        {results ? (
          <div className="flex flex-col gap-8 h-full">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassPanel className="flex flex-col items-center justify-center border-emerald-400 border-2 !bg-emerald-50 text-center animate-fade-in">
                    <span className="text-[12px] font-black uppercase text-emerald-700 mb-2 tracking-[0.2em]">Tahmini Karma Gelir</span>
                    <span className="serif text-7xl font-black text-slate-950">₺{results.revenue.toLocaleString()}</span>
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase">ROI Analizi: Başarılı</p>
                </GlassPanel>
                
                <GlassPanel className="flex flex-col items-center justify-center border-slate-300 border-2 text-center animate-fade-in">
                    <span className="text-[12px] font-black uppercase text-slate-500 mb-2 tracking-[0.2em]">Churn / Hizmet Riski</span>
                    <span className={`serif text-7xl font-black ${results.stockRisk > 60 ? 'text-rose-600' : 'text-slate-950'}`}>%{results.stockRisk}</span>
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase">Kapasite Kullanımı</p>
                </GlassPanel>
             </div>

             <GlassPanel className="flex-1 !bg-slate-950 text-white border-none p-12 relative overflow-hidden animate-fade-in">
                <div className="relative z-10">
                    <h4 className="serif text-3xl italic font-black text-teal-400 mb-6">AI Stratejik Tahmin</h4>
                    <p className="text-xl font-bold leading-relaxed text-teal-50">
                        {results.stockRisk > 70 
                          ? `"Aşırı influencer yoğunluğu operasyonel darboğaz yaratabilir. Bütçeyi kademeli artırarak hizmet kalitesini korumanız önerilir."`
                          : results.revenue > 1000000 
                          ? `"Bu senaryo yüksek kârlılık vadediyor. Artan gelirle 'VIP Concierge' hizmetini devreye alarak churn riskini minimize edebilirsiniz."`
                          : `"Dengeli bir büyüme modeli. Mevcut bütçeyi niş kitlelere odaklayarak editoryal sadakati artırmaya odaklanın."`}
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase">Net Kâr: %{results.profitMargin}</div>
                        <div className="px-6 py-3 rounded-full bg-teal-500/20 border border-teal-500/40 text-[10px] font-black uppercase text-teal-400">Verimlilik: Yüksek</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
             </GlassPanel>
          </div>
        ) : (
          <GlassPanel className="h-full flex flex-col items-center justify-center border-dashed border-4 border-slate-200">
             {isSimulating ? (
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-[#D49680] rounded-full animate-spin mb-6"></div>
                    <p className="serif text-2xl italic text-slate-400">Veriler İşleniyor...</p>
                 </div>
             ) : (
                 <>
                    <div className="text-6xl mb-6 opacity-20">🔮</div>
                    <p className="serif text-4xl italic text-slate-300">Yeni bir senaryo kurgulayın...</p>
                 </>
             )}
          </GlassPanel>
        )}
      </div>
    </div>
  );
};

const PersonaSpotlightView: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
    {MOCK_PERSONAS.map(p => (
      <GlassPanel key={p.id} className="relative group border-slate-200 border hover:border-[#D49680] transition-colors">
        <div className="text-5xl mb-6 flex justify-between items-start">
            <span>{p.icon}</span>
            <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-500">Sadakat: %{p.ltv}</span>
        </div>
        <h4 className="serif text-3xl font-black text-slate-950 mb-3">{p.name}</h4>
        <p className="text-[14px] font-bold text-slate-600 italic mb-8 min-h-[60px]">"{p.description}"</p>
        <div className="p-5 rounded-2xl bg-slate-950 text-white shadow-xl">
           <p className="text-[9px] font-black uppercase text-teal-400 mb-2 tracking-[0.3em]">Davranış Modeli</p>
           <p className="text-[14px] font-black italic">"{p.keyToConvince}"</p>
           <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase opacity-60">Ort. Gelir (Aylık)</span>
              <span className="text-sm font-black text-teal-400">{p.aov}</span>
           </div>
        </div>
      </GlassPanel>
    ))}
  </div>
);

const BrandReputationView: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
    <GlassPanel className="border-slate-300 border-2">
       <h4 className="serif text-4xl font-black text-slate-950 mb-10">Algı Radarı</h4>
       <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={REPUTATION_RADAR}>
                <PolarGrid stroke="#94a3b8" strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 14, fill: '#0f172a', fontWeight: 950}} />
                <Radar name="Skor" dataKey="score" stroke={COLORS.TURQUOISE} fill={COLORS.TURQUOISE} fillOpacity={0.7} />
                <Tooltip />
             </RadarChart>
          </ResponsiveContainer>
       </div>
    </GlassPanel>
    <GlassPanel className="border-slate-300 border-2">
      <h4 className="serif text-4xl font-black text-slate-950 mb-10">Üye Yaşam Boyu Değeri</h4>
      <div className="h-[450px]">
         <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
              <XAxis type="number" dataKey="x" name="LTV" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#1e293b', fontWeight: 950}} />
              <YAxis type="number" dataKey="y" name="Satisfaction" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#1e293b', fontWeight: 950}} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={SCATTER_DATA} fill={COLORS.TURQUOISE}>
                {SCATTER_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hasRisk ? COLORS.ROSE_LIGHT : COLORS.TURQUOISE} strokeWidth={entry.isVIP ? 4 : 1} stroke={entry.isVIP ? '#facc15' : 'none'} />
                ))}
              </Scatter>
            </ScatterChart>
         </ResponsiveContainer>
      </div>
    </GlassPanel>
  </div>
);

const KPICard: React.FC<{ kpi: KPIModel; index: number }> = ({ kpi, index }) => (
  <GlassPanel 
    className="!p-8 !rounded-[1.5rem] flex flex-col justify-between min-h-[170px] group border-slate-300 border-2"
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[12px] font-black uppercase tracking-widest text-slate-600">{kpi.label}</span>
        <div className={`px-3 py-1 rounded-full text-[11px] font-black ${kpi.change >= 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
          {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
        </div>
      </div>
      <p className="serif text-4xl text-slate-950 font-black mb-2">{kpi.value}</p>
    </div>
    <p className="text-[14px] font-black italic text-slate-900 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
      "{kpi.insight}"
    </p>
  </GlassPanel>
);

// --- Ana Uygulama ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [range, setRange] = useState<TimeRange>(TimeRange.THIS_MONTH);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consultantData, setConsultantData] = useState<any>(null);
  const [currentKpis, setCurrentKpis] = useState<any>(null);
  const [currentTrend, setCurrentTrend] = useState<any[]>(TREND_CHART_DATA);
  
  const analyzedViewRef = useRef<ViewType | null>(null);

  const [data, setData] = useState<any>({
    insights: Array(6).fill({ label: '', text: 'Analiz ediliyor...' }),
  });

  const refreshData = useCallback(async (newRange: TimeRange) => {
    setLoading(true);
    setRange(newRange);
    const { kpis, chartData } = getDynamicMockData(newRange);
    setCurrentKpis(kpis);
    setCurrentTrend(chartData);

    const response = await getBeautyInsights(RANGE_LABELS[newRange], kpis);
    if (response?.error === "KEY_REQUIRED") {
        await (window as any).aistudio?.openSelectKey();
    } else if (response) {
        setData(response);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refreshData(TimeRange.THIS_MONTH); }, []);

  const handleConsultantAction = async (force: boolean = false) => {
    if (!force && analyzedViewRef.current === currentView && consultantData) {
      setIsAiOpen(true);
      return;
    }

    setIsAiOpen(true);
    setConsultantData(null); 
    const result = await getAiConsultantAction(currentView, { 
      contextMsg: `Mevcut ${currentView} görünümü için hibrit strateji özeti üret.`, 
      globalKpis: data.insights, 
      currentKpis,
      viewSpecificData: currentView === ViewType.OPERATIONS ? MOCK_ORDERS : currentView === ViewType.PRICING_ENGINE ? MOCK_INVENTORY : null
    });
    
    if (result?.error === "KEY_REQUIRED") {
        await (window as any).aistudio?.openSelectKey();
    } else if (result) {
        setConsultantData(result);
        analyzedViewRef.current = currentView;
    }
  };

  useEffect(() => {
    if (isAiOpen && analyzedViewRef.current !== currentView) {
      handleConsultantAction();
    }
  }, [isAiOpen, currentView]);

  const kpiItems: KPIModel[] = useMemo(() => {
    const k = currentKpis || { conversion: "4.1%", revenue: "₺920K", aov: "₺520", retention: "76%", refund: "0.4%", nps: "91" };
    return [
      { label: 'Hibrit Dönüşüm', value: k.conversion, change: 6.2, insight: data.insights[0]?.text || '', color: COLORS.ROSE_GOLD },
      { label: 'Karma Ciro', value: k.revenue, change: 16.5, insight: data.insights[1]?.text || '', color: COLORS.GLOW_GOLD },
      { label: 'Ort. Bilet', value: k.aov, change: 4.8, insight: data.insights[2]?.text || '', color: COLORS.SAGE },
      { label: 'Üye Sadakati', value: k.retention, change: 11.4, insight: data.insights[3]?.text || '', color: COLORS.DEEP_ROSE },
      { label: 'Churn / İade', value: k.refund, change: -10.0, insight: data.insights[4]?.text || '', color: COLORS.SAGE },
      { label: 'NPS Skoru', value: k.nps, change: 4.2, insight: data.insights[5]?.text || '', color: COLORS.ROSE_GOLD },
    ];
  }, [data, currentKpis]);

  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Ekosistem', icon: '📊' },
    { id: ViewType.MARKET_INSIGHTS, label: 'Pazar & Duygu', icon: '🌐' },
    { id: ViewType.PERSONAS, label: 'Okuyucu DNA\'sı', icon: '👥' },
    { id: ViewType.REPUTATION, label: 'Platform Algısı', icon: '🎯' },
    { id: ViewType.OPERATIONS, label: 'Üye Aktivitesi', icon: '📖' },
    { id: ViewType.PRICING_ENGINE, label: 'Editoryal Motor', icon: '🏷️' },
    { id: ViewType.SIMULATOR, label: 'Vizyon Simülatörü', icon: '🔮' },
  ];

  return (
    <div className="min-h-screen relative bg-cream-silk text-slate-950 font-bold flex">
      {/* YAN MENÜ NAVİGASYON */}
      <aside className="w-[280px] h-screen sticky top-0 bg-white/40 backdrop-blur-3xl border-r border-slate-200 flex flex-col p-6 z-50">
        <div className="mb-12 px-2">
          <h1 className="serif text-5xl font-black text-slate-950 tracking-tighter hover:text-rose-950 transition-colors cursor-default">CRN Beauty</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Hibrit Editoryal</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-950 text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] font-black">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-slate-200">
           <div className="p-4 rounded-2xl bg-slate-950 text-white shadow-lg">
              <p className="text-[9px] font-black uppercase tracking-widest text-teal-400 mb-2">Platform Sağlığı</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black">AI Stratejist Aktif</span>
              </div>
           </div>
        </div>
      </aside>

      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-[120px] animate-flow pointer-events-none"></div>
      
      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 max-w-[1400px] mx-auto px-10 py-12 relative z-10 flex flex-col gap-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4">
          <div>
            <h2 className="serif text-4xl text-slate-950 font-black italic">
              {navItems.find(n => n.id === currentView)?.label}
            </h2>
            <p className="text-[11px] font-black uppercase text-slate-400 mt-1 tracking-widest italic">
              İçerik Odaklı Hibrit Deneyim Yönetimi
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200">
            {(Object.entries(RANGE_LABELS) as [TimeRange, string][]).map(([key, label]) => (
              <button key={key} onClick={() => refreshData(key as TimeRange)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                  range === key ? 'bg-white text-slate-950 shadow-md scale-105' : 'text-slate-500 hover:text-slate-900'
                }`}
              >{label}</button>
            ))}
          </div>
        </header>

        <div className="min-h-[600px]">
          {currentView === ViewType.DASHBOARD && (
            <div className="flex flex-col gap-10 animate-fade-in">
              <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 transition-all ${loading ? 'opacity-30' : 'opacity-100'}`}>
                {kpiItems.map((item, idx) => <KPICard key={idx} kpi={item} index={idx} />)}
              </section>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassPanel className="lg:col-span-2 border-slate-200 border">
                    <h3 className="serif text-3xl text-slate-950 font-black italic mb-8">Etkileşim Akışı</h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentTrend}>
                          <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.ROSE_GOLD} stopOpacity={1}/><stop offset="95%" stopColor={COLORS.ROSE_GOLD} stopOpacity={0}/></linearGradient></defs>
                          <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 900}} />
                          <YAxis hide />
                          <Tooltip labelStyle={{color: '#000'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', fontWeight: 'bold' }} />
                          <Area type="monotone" dataKey="sales" name="Etkileşim" stroke={COLORS.ROSE_GOLD} fill="url(#colorSales)" strokeWidth={8} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                </GlassPanel>
                
                <GlassPanel className="border-slate-200 border flex flex-col items-center">
                    <h3 className="serif text-3xl text-slate-950 font-black italic mb-4">Trafik Kanalları</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={MOCK_TRAFFIC_SOURCES}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {MOCK_TRAFFIC_SOURCES.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        {MOCK_TRAFFIC_SOURCES.map((source, idx) => (
                            <div key={idx} className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: source.color}}></div>
                                    <span className="text-[10px] font-black uppercase text-slate-500">{source.name}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-black text-slate-950">%{source.value}</span>
                                    <span className={`text-[9px] font-black ${source.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {source.growth >= 0 ? '↑' : '↓'}{Math.abs(source.growth)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <GlassPanel className="!bg-slate-950 text-white flex flex-col justify-center p-12 border-none">
                    <p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.4em] mb-4">CRN AI STRATEJİST</p>
                    <h4 className="serif text-3xl font-black mb-8 italic leading-snug text-teal-50">
                      "Instagram üzerinden gelen trafik %45 ile domine ediyor ancak Pinterest dönüşüm hızı %15 daha verimli. Pinterest için daha fazla 'Lüks Yaşam' içeriği üretilmeli."
                    </h4>
                    <button onClick={() => setCurrentView(ViewType.PRICING_ENGINE)} className="w-max px-10 py-4 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl">
                       İçerik Stratejisini Yönet
                    </button>
                 </GlassPanel>
                 
                 <GlassPanel className="border-slate-300 border-2 !p-12">
                    <h4 className="serif text-3xl font-black text-slate-950 mb-6">Kanal Bazlı Sadakat (Retention)</h4>
                    <div className="space-y-6">
                        {[
                            { label: 'Doğrudan (Direct)', val: 92, color: COLORS.SAGE },
                            { label: 'Pinterest Referal', val: 78, color: COLORS.DEEP_ROSE },
                            { label: 'Instagram Shop', val: 65, color: COLORS.ROSE_GOLD },
                            { label: 'TikTok Feed', val: 42, color: COLORS.MATTE_GRAY }
                        ].map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase">
                                    <span>{source.label}</span>
                                    <span>%{source.val}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full transition-all duration-1000" style={{ width: `${source.val}%`, backgroundColor: source.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </GlassPanel>
              </div>
            </div>
          )}

          {currentView === ViewType.MARKET_INSIGHTS && <MarketInsightsView onAiAction={() => handleConsultantAction(true)} />}
          {currentView === ViewType.PERSONAS && <PersonaSpotlightView />}
          {currentView === ViewType.REPUTATION && <BrandReputationView />}
          {currentView === ViewType.OPERATIONS && <SubscriberCockpitView />}
          {currentView === ViewType.PRICING_ENGINE && <EditorialEngineView onAiAction={() => handleConsultantAction(true)} />}
          {currentView === ViewType.SIMULATOR && <WhatIfSimulatorView />}
        </div>
      </main>

      {/* AI Kenar Çubuğu */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsAiOpen(!isAiOpen)} 
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all duration-700 ${isAiOpen ? 'bg-slate-950 rotate-[360deg]' : 'bg-[#D49680] hover:scale-110'}`}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </button>
        
        <div className={`absolute bottom-28 right-0 w-[28rem] transition-all duration-500 transform origin-bottom-right ${isAiOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <GlassPanel className="!p-6 !bg-white/95 shadow-3xl border-slate-200 border">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
               <div>
                  <h4 className="serif text-2xl text-slate-950 italic font-black">AI Danışma Kabini</h4>
                  <p className="text-[8px] font-black uppercase text-slate-400 mt-0.5 tracking-widest">Veri Sentezi</p>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleConsultantAction(true)} className="p-2.5 rounded-full bg-slate-100 text-slate-950 hover:bg-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button onClick={() => setIsAiOpen(false)} className="p-2.5 rounded-full bg-slate-950 text-white hover:bg-black transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
            </div>

            {!consultantData ? (
               <div className="flex flex-col items-center justify-center h-[280px]">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-[#D49680] rounded-full animate-spin mb-4"></div>
                  <p className="italic text-slate-500 font-black text-base">Stratejik özet hazırlanıyor...</p>
               </div>
            ) : (
              <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[45vh] pr-2 custom-scrollbar">
                <div>
                   <h5 className="text-[9px] font-black text-[#D49680] uppercase tracking-[0.4em] mb-3">Hibrit Analiz</h5>
                   <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#D49680]">
                      <p className="text-[14px] font-black italic text-slate-900">"{consultantData.problem}"</p>
                   </div>
                </div>

                <div>
                   <h5 className="text-[9px] font-black text-[#D49680] uppercase tracking-[0.4em] mb-2">Aksiyon Planı</h5>
                   <div className="space-y-2">
                     {consultantData.actions?.map((a: any, i: number) => (
                       <div key={i} className="group flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100 font-black text-[12px] hover:border-teal-500 transition-all">
                          <span className="text-slate-950 flex-1">{a}</span>
                          <button onClick={() => alert(`${a} uygulandı.`)} className="px-2 py-1 rounded-lg bg-teal-500 text-slate-950 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Onayla</button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default App;
