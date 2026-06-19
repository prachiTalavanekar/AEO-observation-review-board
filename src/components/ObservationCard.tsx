import Link from "next/link";
import type { Observation } from "@/types/observation";

const surfaceColors: Record<string, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700",
  Gemini: "bg-blue-100 text-blue-700",
  Claude: "bg-orange-100 text-orange-700",
  Perplexity: "bg-purple-100 text-purple-700",
};

interface ObservationCardProps {
  observation: Observation;
}

export default function ObservationCard({ observation }: ObservationCardProps) {
  const badgeClass =
    surfaceColors[observation.ai_surface] ?? "bg-gray-100 text-gray-700";

  const formattedDate = new Date(observation.created_at).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {observation.brand_name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {observation.website_url}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
        >
          {observation.ai_surface}
        </span>
      </div>

      {/* Query */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          Target Query
        </p>
        <p className="text-sm text-gray-700 line-clamp-2">
          {observation.target_query}
        </p>
      </div>

      {/* Competitors */}
      {observation.competitor_names.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {observation.competitor_names.slice(0, 3).map((c) => (
            <span
              key={c}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
            >
              {c}
            </span>
          ))}
          {observation.competitor_names.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
              +{observation.competitor_names.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formattedDate}</span>
        <Link
          href={`/observation/${observation.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View Details
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
