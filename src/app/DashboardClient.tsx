"use client";

import { useState } from "react";
import Link from "next/link";
import type { Observation } from "@/types/observation";
import ObservationCard from "@/components/ObservationCard";
import SearchBar from "@/components/SearchBar";

interface DashboardClientProps {
  observations: Observation[];
}

const surfaceStats = [
  { label: "ChatGPT", key: "ChatGPT", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Gemini", key: "Gemini", color: "bg-blue-500", light: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Claude", key: "Claude", color: "bg-orange-500", light: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Perplexity", key: "Perplexity", color: "bg-purple-500", light: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function DashboardClient({ observations }: DashboardClientProps) {
  const [search, setSearch] = useState("");

  const filtered = observations.filter((obs) =>
    obs.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 mb-8 shadow-lg">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live Dashboard
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Observation Board
            </h1>
            <p className="text-indigo-200 text-sm max-w-md">
              Monitor how your brand appears across AI-generated answers and build an action plan.
            </p>
          </div>
          <Link
            href="/observation/new"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 shadow-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Observation
          </Link>
        </div>

        {/* Stats inside hero */}
        <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <div className="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-indigo-200 text-xs font-medium">Total</p>
            <p className="text-white text-3xl font-bold mt-0.5">{observations.length}</p>
          </div>
          {surfaceStats.map((s) => (
            <div key={s.key} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-indigo-200 text-xs font-medium">{s.label}</p>
              <p className="text-white text-3xl font-bold mt-0.5">
                {observations.filter((o) => o.ai_surface === s.key).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-3">
          {surfaceStats.map((s) => {
            const count = observations.filter((o) => o.ai_surface === s.key).length;
            if (count === 0) return null;
            return (
              <span key={s.key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.light}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                {s.key}
              </span>
            );
          })}
          <p className="text-sm text-slate-500 ml-1 shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          {observations.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                No observations yet
              </h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                Start by logging how your brand appears in an AI-generated answer.
              </p>
              <Link
                href="/observation/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create First Observation
              </Link>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No results for &quot;{search}&quot;
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try a different brand name.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((obs) => (
            <ObservationCard key={obs.id} observation={obs} />
          ))}
        </div>
      )}
    </div>
  );
}
