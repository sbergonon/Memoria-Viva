
import { GoogleGenAI, Type } from "@google/genai";
import { PersonRecord, SearchSummary, Category, Language, Source } from "../types";

export class GeminiService {
  async searchRecords(params: {
    firstName: string;
    lastName1: string;
    lastName2: string;
    militaryServiceNumber?: string;
    fuzzy: boolean;
    language: Language;
  }): Promise<{ results: PersonRecord[]; summary: SearchSummary }> {
    // Se inicializa la instancia justo antes de la llamada para asegurar que usa la clave más reciente.
    const apiKey = process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey || '' });
    
    const targetName = `${params.firstName || ''} ${params.lastName1} ${params.lastName2 || ''}`.trim();

    const userPrompt = `
      INVESTIGACIÓN HISTÓRICA AISLADA - CASO: "${targetName}"
      
      INSTRUCCIONES DE VERIFICACIÓN (CRÍTICO):
      1. AMNESIA DOCUMENTAL: Ignora cualquier dato sobre "Pedro Bergoñón", "Camp de la Bóta" o ejecuciones mencionado en conversaciones o ejemplos previos. Solo puedes usar información que encuentres mediante Google Search en esta llamada específica.
      2. PRECISIÓN DE APELLIDOS: Si no encuentras el segundo apellido exacto del sujeto, NO lo inventes. No añadas "Giménez" o similares por proximidad estadística.
      3. Marceliano Bergoñón: Verifica si es soldado. No asumas exilio ni bando antifascista si el registro militar oficial no lo indica expresamente.
      4. FUENTES OBLIGATORIAS: Consulta el Portal de Archivos de Defensa y el Memorial Democràtic.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userPrompt,
        config: {
          temperature: 0, 
          systemInstruction: `Eres un Archivero Mayor del Estado. Tu rigor es judicial.
          - No mezclas personas. Si dos personas se llaman "Pedro Bergoñón", sepáralas por fecha de nacimiento o unidad.
          - Si un dato no es 100% veraz, indica "Dato no localizado".
          - Prohibido alucinar biografías basadas en búsquedas anteriores del usuario.
          - Devuelve un JSON estricto con los hallazgos.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    fullName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    status: { type: Type.STRING },
                    location: { type: Type.STRING },
                    date: { type: Type.STRING },
                    birthDate: { type: Type.STRING },
                    deathDate: { type: Type.STRING },
                    details: { type: Type.STRING },
                    rank: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    additionalNotes: { type: Type.STRING },
                    latitude: { type: Type.NUMBER },
                    longitude: { type: Type.NUMBER },
                    sources: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          url: { type: Type.STRING },
                          searchPath: { type: Type.STRING }
                        },
                        required: ["title", "url"]
                      }
                    }
                  },
                  required: ["id", "fullName", "category", "status", "details", "sources"]
                }
              },
              summary: {
                type: Type.OBJECT,
                properties: {
                  totalResults: { type: Type.NUMBER },
                  keyFindings: { type: Type.STRING }
                },
                required: ["totalResults", "keyFindings"]
              }
            },
            required: ["results", "summary"]
          },
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 24576 },
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);

      const filteredResults = (data.results || []).filter((r: PersonRecord) => {
        return r.fullName.toLowerCase().includes(params.lastName1.toLowerCase());
      });

      const summary: SearchSummary = {
        totalResults: filteredResults.length,
        sourcesConsulted: 0,
        categoriesBreakdown: {} as any,
        keyFindings: data.summary?.keyFindings || "Investigación completada bajo protocolo de rigor documental.",
        historicalContext: "",
        archiveRecommendations: [],
      };

      return { results: filteredResults, summary };
    } catch (error: any) {
      console.error("Gemini Search Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("ERROR_KEY_NOT_FOUND");
      }
      throw new Error("Error en la conexión con los archivos estatales. Por favor, reintente en unos segundos.");
    }
  }
}
