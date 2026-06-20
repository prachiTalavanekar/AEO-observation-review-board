import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Observation } from "@/types/observation";
import type { ActionItem } from "@/types/actionItem";
import ActionItems from "@/components/ActionItems";
import NotesSection from "@/components/NotesSection";

export const revalidate = 0;

const surfaceConfig: Record<string, { badge: string; ring: string; icon: string }> = {
  ChatGPT:    { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", ring: "from-emerald-400 to-teal-500",    icon: "🤖" },
  Gemini:     { badge: "bg-blue-50 text-blue-700 border border-blue-200",          ring: "from-blue-400 to-cyan-500",       icon: "✦" },
  Claude:     { badge: "bg-orange-50 text-orange-700 border border-orange-200",    ring: "from-orange-400 to-red-400",      icon: "◆" },
  Perplexity: { badge: "bg-purple-50 text-purple-700 border border-purple-200",    ring: "from-purple-400 to-violet-500",   icon: "⬡" },
};

async function getObservation(id: string): Promise<Observation | null> {
  try {
    const { data, error } = await supabase
      .from("observations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null; // row not found
      throw new Error(`Failed to load observation: ${error.message}`);
    }
    return data;
  } catch (err) {
    console.error("Error fetching observation:", err);
    throw err;
  }
}

async function getActionItems(observationId: string): Promise<ActionItem[]> {
  try {
    const { data, error } = await supabase
      .from("action_items")
      .select("*")
      .eq("observation_id", observationId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Failed to load action items: ${error.message}`);
    return data ?? [];
  } catch (err) {
    console.error("Error fetching action items:", err);
    return [];
  }
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

  const config = surfaceConfig[observation.ai_surface] ?? {
    badge: "bg-slate-100 text-slate-700 border border-slate-200",
    ring: "from-slate-400 to-slate-500",
    icon: "◉",
  };

  const formattedDate = new Date(observation.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900 transition flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {observation.brand_name}
        </span>
      </nav>

      {/* Hero header card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Gradient top bar */}
        <div className={`h-1.5 bg-gradient-to-r ${config.ring}`} />

        <div className="p-6 md:p-8">
          {/* Brand + surface */}
          <div className="flex flex-wrap items-start gap-4 justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Brand avatar */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.ring} flex items-center justify-center text-white text-2xl shadow-sm`}>
                {observation.brand_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{observation.brand_name}</h1>
                <a
                  href={observation.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 mt-0.5"
                >
                  {observation.website_url}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${config.badge}`}>
                <span>{config.icon}</span>
                {observation.ai_surface}
              </span>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Target Query */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Target Query</p>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                &ldquo;{observation.target_query}&rdquo;
              </p>
            </div>

            {/* Competitors */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Competitors</p>
              </div>
              {observation.competitor_names.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {observation.competitor_names.map((c) => (
                    <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs bg-red-100 text-red-700 border border-red-200 font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No competitors listed</p>
              )}
            </div>
          </div>

          {/* AI Answer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Observed AI Answer</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border-l-4 border-violet-400 border border-slate-200">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {observation.observed_answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionItems observation={observation} initialItems={actionItems} />
        <NotesSection observationId={observation.id} initialNote={observation.internal_note} />
      </div>
    </div>
  );
}
