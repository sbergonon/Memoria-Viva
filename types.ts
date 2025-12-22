
export type Category = 'Combate' | 'Retaguardia' | 'Represión' | 'Exilio' | 'Desaparecido' | 'Combatiente condecorado' | 'Otros';
export type Language = 'es' | 'en';

export interface Source {
  title: string;
  url: string;
  searchPath?: string;
}

export interface PersonRecord {
  id: string;
  fullName: string;
  alternateNames?: string[];
  familyRelation?: string; // Vínculo familiar (ej: Padre, Hermano, Hijo)
  birthDate?: string;
  birthPlace?: string;
  rank?: string;
  unit?: string;
  category: Category;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  details: string;
  battleContext?: string;
  repressionContext?: string;
  additionalNotes?: string;
  sources: Source[];
  relevanceScore: number;
}

export interface ArchiveRecommendation {
  name: string;
  reason: string;
  address?: string;
}

export interface SearchSummary {
  totalResults: number;
  sourcesConsulted: number;
  categoriesBreakdown: Record<Category, number>;
  keyFindings: string;
  archiveRecommendations: ArchiveRecommendation[];
  historicalContext: string;
  groundingSources?: Source[];
}

export interface SavedSearch {
  id: string;
  firstName: string;
  lastName1: string;
  lastName2: string;
  militaryServiceNumber?: string;
  fuzzy: boolean;
  timestamp: number;
}

export interface SearchState {
  query: {
    firstName: string;
    lastName1: string;
    lastName2: string;
    militaryServiceNumber: string;
    fuzzySearch: boolean;
  };
  results: PersonRecord[];
  summary: SearchSummary | null;
  loading: boolean;
  error: string | null;
  searchedOnce: boolean;
}
