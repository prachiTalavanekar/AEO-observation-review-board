import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Observation } from "@/types/observation";
import type { ActionItem } from "@/types/actionItem";
import ActionItems from "@/components/ActionItems";
import NotesSection from "@/components/NotesSection";

export const revalidate = 0;

const surfaceColors: Record<string, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700",
  Gemini: "bg-blue-100 text-blue-700",
  Claude: "bg-orange-100 text-orange-700",
  Perplexity: "bg-purple-100 text-purple-700",
};

async function getObservation(id: string): Promise<Observation | null> {
  const { data, error } = await supabase
    .from("observations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

async function getActionItems(observationId: string): Promise<ActionItem[]> {
  const { data, error } = await supabase
    .from("action_items")
    .select("*")
    .eq("observation_id", observationId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export default async function ObservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [observation, actionItems] = await Promise.all([
    getObservation(id),
    getActionItems(id),
  ]);

  if (!observation) notFound();

  const badgeClass =
    surfaceColors[observation.ai_surface] ?? "bg-gray-100 text-gray-700";

  const formattedDate = new Date(observation.created_at).toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 transition">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {observation.brand_name}
        </span>
      </nav>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">
                {observation.brand_name}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                {observation.ai_surface}
              </span>
            </div>
            <a
              href={observation.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
            >
              {observation.website_url}
            </a>
            <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Query */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Target Query
            </p>
            <p className="text-sm text-gray-800">{observation.target_query}</p>
          </div>

          {/* Competitors */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Competitors
            </p>
            {observation.competitor_names.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {observation.competitor_names.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-50 text-red-700 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No competitors listed</p>
            )}
          </div>
        </div>

        {/* AI Answer */}
        <div className="mt-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Observed AI Answer
          </p>
          <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-indigo-300">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {observation.observed_answer}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom grid: Action Items + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionItems observation={observation} initialItems={actionItems} />
        <NotesSection
          observationId={observation.id}
          initialNote={observation.internal_note}
        />
      </div>
    </div>
  );
}
