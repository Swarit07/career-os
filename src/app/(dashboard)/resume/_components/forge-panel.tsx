"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Zap, Copy, Save, Square, CheckCheck, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ForgePanel() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  async function handleForge() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Paste your resume and a job description first.");
      return;
    }
    setError(null);
    setOutput("");
    setSavedOk(false);
    setIsStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("Empty response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!output || !saveLabel.trim()) return;
    setIsSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsSaving(false); return; }

    const { error: insertError } = await supabase.from("resumes").insert({
      user_id: user.id,
      label: saveLabel.trim(),
      original_text: resumeText,
      job_description: jobDescription,
      tailored_version: output,
    } as never);

    setIsSaving(false);
    if (!insertError) {
      setSavedOk(true);
      setSaveLabel("");
      router.refresh();
    }
  }

  const canForge = resumeText.trim().length > 0 && jobDescription.trim().length > 0;
  const hasOutput = output.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Left: Inputs ── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="apple-label-muted">Your Resume</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste the full text of your current résumé…"
            rows={14}
            className="apple-input w-full resize-none px-4 py-3 font-mono text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="apple-label-muted">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description you're targeting…"
            rows={10}
            className="apple-input w-full resize-none px-4 py-3 font-mono text-sm"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={isStreaming ? handleStop : handleForge}
          disabled={!isStreaming && !canForge}
          className={`inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-30 ${
            isStreaming
              ? "border border-red-200 bg-white text-red-500 hover:bg-red-50"
              : "apple-btn-primary"
          }`}
        >
          {isStreaming ? (
            <>
              <Square className="h-4 w-4 fill-current" />
              Stop Generating
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Forge Resume
            </>
          )}
        </button>
      </div>

      {/* ── Right: Output ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="apple-label-muted">Tailored Output</label>
          {hasOutput && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#6e6e73] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
            >
              {copied ? (
                <><CheckCheck className="h-3.5 w-3.5 text-[#10b981]" /> Copied</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy</>
              )}
            </button>
          )}
        </div>

        <div className="relative min-h-[24rem] flex-1 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#f5f5f7]">
          {!hasOutput && !isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(245,158,11,0.1)]">
                <Zap className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <p className="text-sm text-[#a1a1a6]">Tailored resume will appear here</p>
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm leading-relaxed text-[#1d1d1f]">
            {output}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#0071e3]" />
            )}
          </pre>
        </div>

        {/* Save to vault */}
        {hasOutput && !isStreaming && (
          <div className="flex flex-col gap-2 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#f5f5f7] p-4">
            <p className="apple-label-muted">Save to Vault</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder='e.g. "Google SWE — Apr 2026"'
                className="apple-input min-w-0 flex-1 px-3 py-2 text-sm"
              />
              <button
                onClick={handleSave}
                disabled={isSaving || !saveLabel.trim() || savedOk}
                className="apple-btn-primary shrink-0 rounded-xl px-4 py-2 text-sm disabled:opacity-40"
              >
                {savedOk ? (
                  <><CheckCheck className="h-4 w-4" /> Saved</>
                ) : (
                  <><Save className="h-4 w-4" /> {isSaving ? "Saving…" : "Save"}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
