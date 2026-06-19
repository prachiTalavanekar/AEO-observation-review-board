"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface NotesSectionProps {
  observationId: string;
  initialNote: string;
}

export default function NotesSection({
  observationId,
  initialNote,
}: NotesSectionProps) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase
        .from("observations")
        .update({ internal_note: note })
        .eq("id", observationId);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">Internal Notes</h2>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add internal notes about this observation — strategy insights, next steps, context..."
        rows={5}
        className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            "Save Note"
          )}
        </button>
      </div>
    </div>
  );
}
