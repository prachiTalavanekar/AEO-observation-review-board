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

export default function ActionItems({ observation, initialItems }: ActionItemsProps) {
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
      const { data, error } = await supabase.from("action_items").insert(toInsert).select();
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Action Items</h2>
            {items.length > 0 && (
              <p className="text-xs text-slate-400">{doneCount}/{items.length} completed</p>
            )}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate
            </>
          )}
        </button>
      </div>

      <div className="p-5">
        {/* Progress */}
        {items.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className={`font-bold ${progress === 100 ? "text-emerald-600" : "text-indigo-600"}`}>
                {progress}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${
                  progress === 100
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        {items.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-500">No action items yet</p>
            <p className="text-xs text-slate-400 mt-1">Click Generate to create them automatically.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  item.status === "done"
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40"
                }`}
              >
                <button
                  onClick={() => handleToggle(item)}
                  disabled={togglingId === item.id}
                  className="shrink-0 focus:outline-none"
                  aria-label={item.status === "done" ? "Mark as todo" : "Mark as done"}
                >
                  {togglingId === item.id ? (
                    <span className="flex items-center justify-center w-5 h-5">
                      <svg className="animate-spin w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    </span>
                  ) : item.status === "done" ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 hover:border-indigo-500 transition" />
                  )}
                </button>
                <span className="text-xs text-slate-400 font-bold w-4 shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className={`flex-1 text-sm leading-relaxed ${
                  item.status === "done" ? "line-through text-slate-400" : "text-slate-700"
                }`}>
                  {item.title}
                </span>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-lg font-bold ${
                  item.status === "done"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {item.status === "done" ? "Done" : "Todo"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
