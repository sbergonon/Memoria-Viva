
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const targetName = `${params.firstName || ''} ${params.lastName1} ${params.lastName2 || ''}`.trim();

    const userPrompt = `
      SOLICITUD DE INVESTIGACIÓN ÚNICA E INDEPENDIENTE:
      - SUJETO ACTUAL: "${targetName}"
      - APELLIDO 1: "${params.lastName1}"
      - APELLIDO 2: "${params.lastName2 || 'No proporcionado'}"

      PROTOCOLO DE AISLAMIENTO DOCUMENTAL:
      1. PROHIBICIÓN DE MEMORIA TRANSVERSAL: No utilices información de personas buscadas en consultas anteriores (como casos de ejecuciones en el Camp de la Bóta o exilios). Cada búsqueda es un compartimento estanco.
      2. VERIFICACIÓN DE IDENTIDAD: Si localizas registros de "Pedro Bergoñón", cíñete estrictamente a lo que diga el documento oficial. Si el documento NO menciona una ejecución o represalia específica para ESTA persona exacta, no la inventes ni la heredes de otros perfiles.
      3. RIGOR EN APELLIDOS: Si el usuario no proporciona un segundo apellido, el resultado no debe tenerlo a menos que la fuente oficial lo identifique sin género de duda. Prohibido añadir "Giménez", "Alfonso" o similares por suposición.
      4. CATEGORIZACIÓN BASADA EN EVIDENCIA: Si Marceliano Bergoñón consta como soldado, categorízalo como tal. No asumas ideología política o exilio si el registro no lo explicita.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userPrompt,
        config: {
          temperature: 0, 
          systemInstruction: `Eres un Archivero del Estado con formación en método histórico crítico.
          - TU MISIÓN: Localizar la verdad documental en PARES, Portal de Archivos de Defensa y Banc de la Memòria Democràtica.
          - TU REGLA SAGRADA: "Mejor omitir que mentir". Si un dato (segundo apellido, causa de muerte, bando) no está en la fuente, informa de su ausencia.
          - PROHIBICIÓN: No mezcles biografías de personas con el mismo apellido. 
          - ESTRUCTURA: Devuelve un JSON con los resultados encontrados EXCLUSIVAMENTE mediante la herramienta de búsqueda para esta consulta específica.`,
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
                    details: { type: Type.STRING, description: "Hechos probados en el archivo. Sin suposiciones." },
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
                          searchPath: { type: Type.STRING, description: "Signatura/Caja de archivo." }
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

      // Filtro final para asegurar que el apellido principal coincida
      const filteredResults = (data.results || []).filter((r: PersonRecord) => {
        return r.fullName.toLowerCase().includes(params.lastName1.toLowerCase());
      });

      const summary: SearchSummary = {
        totalResults: filteredResults.length,
        sourcesConsulted: 0,
        categoriesBreakdown: {} as any,
        keyFindings: data.summary?.keyFindings || "Investigación realizada bajo protocolo de aislamiento documental.",
        historicalContext: "",
        archiveRecommendations: [],
      };

      return { results: filteredResults, summary };
    } catch (error: any) {
      console.error("Gemini Search Error:", error);
      throw new Error("El sistema de archivos está saturado. Por favor, espere 10 segundos antes de reintentar la consulta.");
    }
  }
}
