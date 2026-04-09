"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationStatus, Database } from "@/lib/database.types";

interface NewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitialForm() {
  return {
    company_name: "",
    role_title: "",
    status: "Applied" as ApplicationStatus,
    salary_range: "",
    location: "",
    job_url: "",
    applied_date: new Date().toISOString().split("T")[0],
    notes: "",
  };
}

const inputStyles =
  "border-white/[0.06] bg-white/[0.02] text-white/80 placeholder:text-white/20 focus-visible:border-white/20 focus-visible:ring-white/10";

export function NewApplicationDialog({
  open,
  onOpenChange,
}: NewApplicationDialogProps) {
  const [form, setForm] = useState(getInitialForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.company_name.trim() || !form.role_title.trim()) {
      setError("Company name and role title are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      setLoading(false);
      return;
    }

    const payload: Database["public"]["Tables"]["applications"]["Insert"] = {
      user_id: user.id,
      company_name: form.company_name.trim(),
      role_title: form.role_title.trim(),
      status: form.status,
      salary_range: form.salary_range.trim() || null,
      location: form.location.trim() || null,
      job_url: form.job_url.trim() || null,
      applied_date: form.applied_date || null,
      notes: form.notes.trim() || null,
    };

    const { error: insertError } = await supabase
      .from("applications")
      .insert(payload as never);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(getInitialForm());
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass-strong flex max-h-[90dvh] flex-col border-white/[0.06] bg-black/80 backdrop-blur-2xl sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle className="font-serif text-xl italic text-white/90">
            New Application
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Add a new job or internship application to track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-white/50">
                Company <span className="text-red-400/60">*</span>
              </Label>
              <Input
                id="company_name"
                placeholder="e.g. Google"
                value={form.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
                className={inputStyles}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_title" className="text-white/50">
                Role <span className="text-red-400/60">*</span>
              </Label>
              <Input
                id="role_title"
                placeholder="e.g. Software Engineer Intern"
                value={form.role_title}
                onChange={(e) => updateField("role_title", e.target.value)}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/50">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(value) => updateField("status", value)}
              >
                <SelectTrigger
                  id="status"
                  className="border-white/[0.06] bg-white/[0.02] text-white/60"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/[0.08] bg-black/95 backdrop-blur-xl">
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applied_date" className="text-white/50">
                Applied Date
              </Label>
              <Input
                id="applied_date"
                type="date"
                value={form.applied_date}
                onChange={(e) => updateField("applied_date", e.target.value)}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-white/50">
                Salary Range
              </Label>
              <Input
                id="salary_range"
                placeholder="e.g. $80k - $100k"
                value={form.salary_range}
                onChange={(e) => updateField("salary_range", e.target.value)}
                className={inputStyles}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white/50">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_url" className="text-white/50">
              Job URL
            </Label>
            <Input
              id="job_url"
              type="url"
              placeholder="https://..."
              value={form.job_url}
              onChange={(e) => updateField("job_url", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/50">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Referral contact, interview prep notes..."
              rows={3}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className={inputStyles}
            />
          </div>

        </div>

          {error && <p className="mt-4 shrink-0 text-sm text-red-400/70">{error}</p>}

          <DialogFooter className="mt-4 shrink-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-lg border border-white/[0.08] bg-transparent px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="liquid-glass-strong inline-flex cursor-pointer items-center gap-2 px-5 py-2 text-sm font-medium text-white/90 transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Application
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
