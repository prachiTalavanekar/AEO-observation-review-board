"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateActionItems } from "@/utils/generateActionItems";
import type { ActionItem } from "@/types/actionItem";
import type { Observation } from "@/types/observation";

interface ActionItemsProps {
  observation: Observation;
  initialItems: ActionItem[];
}

export default function ActionItems({
  observation,
  initialItems,
}: ActionItemsProps) {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [generating, setGenerating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const doneCount = items.filter((i) => i.status === "done").length;
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const titles = generateActionItems(observation);

      const toInsert = titles.map((title) => ({
        observation_id: observation.id,
        title,
        status: "todo" as const,
      }));

      const { data, error } = await supabase
        .from("action_items")
        .insert(toInsert)
        .select();

      if (error) throw error;
      setItems((prev) => [...prev, ...(data ?? [])]);
    } catch (err) {
      console.error("Failed to generate action items:", err);
      alert("Failed to generate action items. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggle(item: ActionItem) {
    setTogglingId(item.id);
    const newStatus = item.status === "todo" ? "done" : "todo";
    try {
      const { error } = await supabase
        .from("action_items")
        .update({ status: newStatus })
        .eq("id", item.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      console.error("Failed to update action item:", err);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Action Items</h2>
          {items.length > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {doneCount} of {items.length} completed
            </p>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Actions
            </>
          )}
        </button>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <svg className="mx-auto h-10 w-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">No action items yet.</p>
          <p className="text-xs mt-1">Click &quot;Generate Actions&quot; to create them.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
            >
              <button
                onClick={() => handleToggle(item)}
                disabled={togglingId === item.id}
                className="shrink-0 focus:outline-none"
                aria-label={item.status === "done" ? "Mark as todo" : "Mark as done"}
              >
                {item.status === "done" ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 hover:border-indigo-400 transition" />
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  item.status === "done"
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {item.title}
              </span>
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === "done"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.status === "done" ? "Done" : "Todo"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
