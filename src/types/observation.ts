export type AISurface = "ChatGPT" | "Gemini" | "Claude" | "Perplexity";

export interface Observation {
  id: string;
  brand_name: string;
  website_url: string;
  target_query: string;
  ai_surface: AISurface;
  observed_answer: string;
  competitor_names: string[];
  internal_note: string;
  created_at: string;
}

export type CreateObservationInput = Omit<Observation, "id" | "created_at">;
