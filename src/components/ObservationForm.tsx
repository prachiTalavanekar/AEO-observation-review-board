"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AISurface } from "@/types/observation";

const AI_SURFACES: AISurface[] = ["ChatGPT", "Gemini", "Claude", "Perplexity"];

export default function ObservationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [competitorInput, setCompetitorInput] = useState("");

  const [form, setForm] = useState({
    brand_name: "",
    website_url: "",
    target_query: "",
    ai_surface: "ChatGPT" as AISurface,
    observed_answer: "",
    competitor_names: [] as string[],
    internal_note: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addCompetitor() {
    const trimmed = competitorInput.trim();
    if (trimmed && !form.competitor_names.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        competitor_names: [...prev.competitor_names, trimmed],
      }));
    }
    setCompetitorInput("");
  }

  function removeCompetitor(name: string) {
    setForm((prev) => ({
      ...prev,
      competitor_names: prev.competitor_names.filter((c) => c !== name),
    }));
  }

  function handleCompetitorKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("observations")
        .insert([form])
        .select()
        .single();

      if (error) throw error;
      router.push(`/observation/${data.id}`);
    } catch (err) {
      console.error("Failed to create observation:", err);
      alert("Failed to create observation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand + URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            name="brand_name"
            value={form.brand_name}
            onChange={handleChange}
            required
            placeholder="e.g. Acme Corp"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Website URL <span className="text-red-500">*</span>
          </label>
          <input
            name="website_url"
            value={form.website_url}
            onChange={handleChange}
            required
            type="url"
            placeholder="https://example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Target Query + AI Surface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Target Query <span className="text-red-500">*</span>
          </label>
          <input
            name="target_query"
            value={form.target_query}
            onChange={handleChange}
            required
            placeholder="e.g. best project management software"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            AI Surface <span className="text-red-500">*</span>
          </label>
          <select
            name="ai_surface"
            value={form.ai_surface}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            {AI_SURFACES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observed AI Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Observed AI Answer <span className="text-red-500">*</span>
        </label>
        <textarea
          name="observed_answer"
          value={form.observed_answer}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Paste the exact AI-generated answer you observed..."
          className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Competitors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Competitor Names{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex gap-2">
          <input
            value={competitorInput}
            onChange={(e) => setCompetitorInput(e.target.value)}
            onKeyDown={handleCompetitorKeyDown}
            placeholder="Type a competitor and press Enter"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={addCompetitor}
            className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Add
          </button>
        </div>
        {form.competitor_names.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {form.competitor_names.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeCompetitor(name)}
                  className="hover:text-indigo-900 transition"
                  aria-label={`Remove ${name}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Internal Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Internal Note{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="internal_note"
          value={form.internal_note}
          onChange={handleChange}
          rows={3}
          placeholder="Any internal context or strategy notes..."
          className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            "Save Observation"
          )}
        </button>
      </div>
    </form>
  );
}
