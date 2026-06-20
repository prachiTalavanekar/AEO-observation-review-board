"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface NotesSectionProps {
  observationId: string;
  initialNote: string;
}

export default function NotesSection({ observationId, initialNote }: NotesSectionProps) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [savedNote, setSavedNote] = useState(initialNote);
  const isDirty = note !== savedNote;

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase
        .from("observations")
        .update({ internal_note: note })
        .eq("id", observationId);
      if (error) throw error;
      setSavedNote(note);
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Internal Notes</h2>
            <p className="text-xs text-slate-400">Private team notes</p>
          </div>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
      </div>

      <div className="p-5">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add internal notes about this observation — strategy insights, next steps, competitive context..."
          rows={8}
          className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-slate-50 focus:bg-white transition leading-relaxed"
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-400">
            {note.length} character{note.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Note
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
