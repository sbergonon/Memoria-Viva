
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
    
    const hasFirstName = !!params.firstName.trim();
    const hasSecondLastName = !!params.lastName2.trim();
    const isStrict = !params.fuzzy;

    const userPrompt = `
      INVESTIGACIÓN HISTÓRICA PROFUNDA: ${params.firstName || ''} ${params.lastName1} ${params.lastName2 || ''}.
      ${params.militaryServiceNumber ? 'Identificador Militar/Expediente: ' + params.militaryServiceNumber : ''}
      
      INSTRUCCIONES DE RASTREO (NO OMITIR NADA):
      1. CRUCE DE DATOS: Busca en PARES, CDMH, Archivo General Militar (Segovia/Ávila), Combatientes.es y el Portal de Víctimas.
      2. LUGARES DE MEMORIA: Es CRÍTICO buscar en registros de enterramientos y fosas, específicamente en el Fossar de la Pedrera (Barcelona), Cementerio de la Almudena, fosas de Extremadura y Andalucía, y memoriales de exilio en Francia (Argelès-sur-Mer, etc.).
      3. FUSIÓN DE INFORMACIÓN: Si encuentras datos de una persona en diferentes sitios (ej: una medalla en el BOE y una fosa en un mapa provincial), COMBINA toda la información en un solo registro de alta fidelidad. No descartes detalles de entierro.
      4. FILTRADO: ${hasSecondLastName ? `Como has recibido DOS apellidos (${params.lastName1} ${params.lastName2}), filtra estrictamente por esa combinación. No mezcles con personas que solo tengan uno de los dos a menos que haya evidencia de que son el mismo individuo.` : `Busca todos los registros de '${params.lastName1}'.`}
      5. ORTOGRAFÍA: ${isStrict ? 'Sé estricto con la ortografía.' : 'Permite variaciones históricas (B/V, tildes, Y/I).'}
      
      Idioma: ${params.language === 'es' ? 'Español' : 'Inglés'}.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: `Eres un investigador senior de la Dirección General de Memoria Democrática. 
          Tu objetivo es la VERDAD COMPLETA. 
          No resumas: si encuentras dónde está enterrada una persona, esa información es PRIORITARIA.
          Si el usuario proporciona dos apellidos, busca la coincidencia exacta de la saga familiar.
          Devuelve los datos en un JSON estructurado. 
          Categorías: Combate, Retaguardia, Represión, Exilio, Desaparecido, Combatiente condecorado, Otros.`,
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
                    familyRelation: { type: Type.STRING },
                    category: { type: Type.STRING },
                    status: { type: Type.STRING },
                    location: { type: Type.STRING },
                    date: { type: Type.STRING },
                    details: { type: Type.STRING },
                    birthPlace: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    rank: { type: Type.STRING },
                    battleContext: { type: Type.STRING },
                    additionalNotes: { type: Type.STRING, description: "Incluir aquí datos de enterramiento, fosas o condecoraciones específicas." },
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
                        }
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
                  sourcesConsulted: { type: Type.NUMBER },
                  categoriesBreakdown: { 
                    type: Type.OBJECT,
                    properties: {
                      'Combate': { type: Type.NUMBER },
                      'Retaguardia': { type: Type.NUMBER },
                      'Represión': { type: Type.NUMBER },
                      'Exilio': { type: Type.NUMBER },
                      'Desaparecido': { type: Type.NUMBER },
                      'Combatiente condecorado': { type: Type.NUMBER },
                      'Otros': { type: Type.NUMBER }
                    }
                  },
                  keyFindings: { type: Type.STRING },
                  historicalContext: { type: Type.STRING }
                },
                required: ["totalResults", "keyFindings", "categoriesBreakdown"]
              }
            },
            required: ["results", "summary"]
          },
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 2000 }, // Activamos un pequeño budget para que "conecte" los puntos de las fuentes
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingSources: Source[] = [];
      if (groundingChunks) {
        for (const chunk of groundingChunks) {
          if (chunk.web) {
            groundingSources.push({
              title: chunk.web.title || 'Referencia Web',
              url: chunk.web.uri
            });
          }
        }
      }
      
      const rawSummary = data.summary || {};
      const summary: SearchSummary = {
        totalResults: rawSummary.totalResults || 0,
        sourcesConsulted: rawSummary.sourcesConsulted || 0,
        categoriesBreakdown: rawSummary.categoriesBreakdown || {},
        keyFindings: rawSummary.keyFindings || "No se pudo generar un resumen.",
        historicalContext: rawSummary.historicalContext || "Contexto histórico no disponible.",
        archiveRecommendations: rawSummary.archiveRecommendations || [],
        groundingSources: groundingSources.length > 0 ? groundingSources : undefined
      };

      return { 
        results: data.results || [], 
        summary
      };
    } catch (error: any) {
      console.error("Gemini Search Error:", error);
      throw new Error("La investigación está siendo compleja y los archivos tardan en responder. Por favor, reintente en unos instantes.");
    }
  }
}
