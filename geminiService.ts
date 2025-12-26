
import { GoogleGenAI, Type } from "@google/genai";

// Helper to clean JSON response
const cleanJsonResponse = (text: string) => {
  return text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
};

export const getBeautyInsights = async (timeRange: string, kpis: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sen bir lüks kozmetik veri stratejistisin. ${timeRange} aralığı için şu verileri analiz et: ${JSON.stringify(kpis)}. Her KPI için tam olarak bir cümlelik, zarif ve aksiyon odaklı "Beauty Insight" üret.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["label", "text"]
              }
            }
          }
        }
      }
    });

    return JSON.parse(cleanJsonResponse(response.text));
  } catch (error: any) {
    console.error("Beauty Insights Error:", error);
    if (error.message?.includes("Requested entity was not found")) return { error: "KEY_REQUIRED" };
    return null;
  }
};

export const getAiConsultantAction = async (view: string, contextData: any) => {
  try {
    // Re-initialize to ensure we use current context's key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Changed to flash for faster/more reliable response in this context
      contents: `Sen bir üst düzey yönetim danışmanısın. ${view} görünümü verileri: ${JSON.stringify(contextData)}. Stratejik bir analiz yap.
      
      Yanıt yapısı:
      - problem: Mevcut en büyük darboğaz
      - reason: Neden kaynaklanıyor?
      - actions: 3 somut çözüm adımı (array)
      
      Lüks ve profesyonel bir dil kullan.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problem: { type: Type.STRING },
            reason: { type: Type.STRING },
            actions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["problem", "reason", "actions"]
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text));
  } catch (e: any) {
    console.error("AI Action Error:", e);
    if (e.message?.includes("Requested entity was not found")) return { error: "KEY_REQUIRED" };
    return null;
  }
};

export const getMarketSentimentAnalysis = async (reviews: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu yorumları analiz et: ${JSON.stringify(reviews)}. Pozitif, negatif ve öneri çıkar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            positives: { type: Type.ARRAY, items: { type: Type.STRING } },
            negatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionRecommendation: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text));
  } catch (e: any) {
    if (e.message?.includes("Requested entity was not found")) return { error: "KEY_REQUIRED" };
    return null;
  }
};
