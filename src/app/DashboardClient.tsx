"use client";

import { useState } from "react";
import Link from "next/link";
import type { Observation } from "@/types/observation";
import ObservationCard from "@/components/ObservationCard";
import SearchBar from "@/components/SearchBar";

interface DashboardClientProps {
  observations: Observation[];
}

export default function DashboardClient({
  observations,
}: DashboardClientProps) {
  const [search, setSearch] = useState("");

  const filtered = observations.filter((obs) =>
    obs.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Observation Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track how your brand appears in AI-generated answers across surfaces.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(
          [
            { label: "Total Observations", value: observations.length },
            {
              label: "ChatGPT",
              value: observations.filter((o) => o.ai_surface === "ChatGPT")
                .length,
            },
            {
              label: "Gemini",
              value: observations.filter((o) => o.ai_surface === "Gemini")
                .length,
            },
            {
              label: "Claude",
              value: observations.filter((o) => o.ai_surface === "Claude")
                .length,
            },
          ] as { label: string; value: number }[]
        ).map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + count */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <p className="text-sm text-gray-500 shrink-0">
          {filtered.length} observation{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          {observations.length === 0 ? (
            <>
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No observations yet
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Start by creating your first observation.
              </p>
              <Link
                href="/observation/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Create Observation
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">
                No results for &quot;{search}&quot;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different brand name.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((obs) => (
            <ObservationCard key={obs.id} observation={obs} />
          ))}
        </div>
      )}
    </div>
  );
}
