import Link from "next/link";
import type { Observation } from "@/types/observation";

const surfaceConfig: Record<string, { badge: string; dot: string; icon: string }> = {
  ChatGPT:    { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", icon: "🤖" },
  Gemini:     { badge: "bg-blue-50 text-blue-700 border border-blue-200",          dot: "bg-blue-500",    icon: "✦" },
  Claude:     { badge: "bg-orange-50 text-orange-700 border border-orange-200",    dot: "bg-orange-500",  icon: "◆" },
  Perplexity: { badge: "bg-purple-50 text-purple-700 border border-purple-200",    dot: "bg-purple-500",  icon: "⬡" },
};

interface ObservationCardProps {
  observation: Observation;
}

export default function ObservationCard({ observation }: ObservationCardProps) {
  const config = surfaceConfig[observation.ai_surface] ?? {
    badge: "bg-slate-50 text-slate-700 border border-slate-200",
    dot: "bg-slate-500",
    icon: "◉",
  };

  const formattedDate = new Date(observation.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Colored top strip */}
      <div className={`h-1 w-full ${config.dot}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
              {observation.brand_name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {observation.website_url}
            </p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.badge}`}>
            <span className="text-xs">{config.icon}</span>
            {observation.ai_surface}
          </span>
        </div>

        {/* Query */}
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Target Query
          </p>
          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
            &ldquo;{observation.target_query}&rdquo;
          </p>
        </div>

        {/* AI Answer preview */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {observation.observed_answer}
        </p>

        {/* Competitors */}
        {observation.competitor_names.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {observation.competitor_names.slice(0, 3).map((c) => (
              <span
                key={c}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-red-50 text-red-600 border border-red-100 font-medium"
              >
                {c}
              </span>
            ))}
            {observation.competitor_names.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-500 font-medium">
                +{observation.competitor_names.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
          <Link
            href={`/observation/${observation.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group-hover:gap-2 transition-all"
          >
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
