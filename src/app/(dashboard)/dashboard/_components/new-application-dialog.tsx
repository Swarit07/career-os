"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { Application, ApplicationStatus, Database } from "@/lib/database.types";

export interface ApplicationInitialValues {
  company_name?: string;
  role_title?: string;
  location?: string;
  salary_range?: string;
  job_url?: string;
}

interface NewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ApplicationInitialValues;
}

function getInitialForm(init?: ApplicationInitialValues) {
  return {
    company_name: init?.company_name ?? "",
    role_title: init?.role_title ?? "",
    status: "Applied" as ApplicationStatus,
    salary_range: init?.salary_range ?? "",
    location: init?.location ?? "",
    job_url: init?.job_url ?? "",
    applied_date: new Date().toISOString().split("T")[0],
    notes: "",
  };
}

const labelStyle: React.CSSProperties = {
  color: "#1d1d1f",
  fontSize: 13,
  fontWeight: 500,
};

export function NewApplicationDialog({
  open,
  onOpenChange,
  initialValues,
}: NewApplicationDialogProps) {
  const [form, setForm] = useState(() => getInitialForm(initialValues));

  useEffect(() => {
    if (open) setForm(getInitialForm(initialValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
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
      <DialogContent
        className="flex max-h-[85dvh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 24,
        }}
      >
        <DialogHeader
          className="shrink-0 px-8 pt-8 pb-6"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <DialogTitle
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            New Application
          </DialogTitle>
          <DialogDescription
            className="text-[15px]"
            style={{ color: "#6e6e73" }}
          >
            Add a new application to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-8 py-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name" style={labelStyle}>
                  Company <span style={{ color: "#dc2626" }}>*</span>
                </Label>
                <Input
                  id="company_name"
                  placeholder="e.g. Google"
                  value={form.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  className="apple-input h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_title" style={labelStyle}>
                  Role <span style={{ color: "#dc2626" }}>*</span>
                </Label>
                <Input
                  id="role_title"
                  placeholder="e.g. Software Engineer"
                  value={form.role_title}
                  onChange={(e) => updateField("role_title", e.target.value)}
                  className="apple-input h-11 text-base"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status" style={labelStyle}>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className="apple-input h-11 text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applied_date" style={labelStyle}>
                  Applied Date
                </Label>
                <Input
                  id="applied_date"
                  type="date"
                  value={form.applied_date}
                  onChange={(e) => updateField("applied_date", e.target.value)}
                  className="apple-input h-11 text-base"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary_range" style={labelStyle}>
                  Salary Range
                </Label>
                <Input
                  id="salary_range"
                  placeholder="e.g. $80k – $120k"
                  value={form.salary_range}
                  onChange={(e) => updateField("salary_range", e.target.value)}
                  className="apple-input h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" style={labelStyle}>
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="apple-input h-11 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url" style={labelStyle}>Job URL</Label>
              <Input
                id="job_url"
                type="url"
                placeholder="https://..."
                value={form.job_url}
                onChange={(e) => updateField("job_url", e.target.value)}
                className="apple-input h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" style={labelStyle}>Notes</Label>
              <Textarea
                id="notes"
                placeholder="Referral contact, interview prep notes..."
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="apple-input text-base"
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}
          </div>

          <div
            className="shrink-0 flex items-center justify-end gap-3 px-8 py-5"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="apple-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="apple-btn-primary"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Application
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Edit Application Dialog ─── */

interface EditApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditApplicationDialog({
  application,
  open,
  onOpenChange,
}: EditApplicationDialogProps) {
  const [form, setForm] = useState({
    company_name: application.company_name,
    role_title: application.role_title,
    status: application.status as ApplicationStatus,
    salary_range: application.salary_range ?? "",
    location: application.location ?? "",
    job_url: application.job_url ?? "",
    applied_date: application.applied_date ?? new Date().toISOString().split("T")[0],
    notes: application.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setForm({
        company_name: application.company_name,
        role_title: application.role_title,
        status: application.status as ApplicationStatus,
        salary_range: application.salary_range ?? "",
        location: application.location ?? "",
        job_url: application.job_url ?? "",
        applied_date: application.applied_date ?? new Date().toISOString().split("T")[0],
        notes: application.notes ?? "",
      });
      setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

    const { error: updateError } = await supabase
      .from("applications")
      .update({
        company_name: form.company_name.trim(),
        role_title: form.role_title.trim(),
        status: form.status,
        salary_range: form.salary_range.trim() || null,
        location: form.location.trim() || null,
        job_url: form.job_url.trim() || null,
        applied_date: form.applied_date || null,
        notes: form.notes.trim() || null,
      } as never)
      .eq("id", application.id as never);

    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[85dvh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 24 }}
      >
        <DialogHeader
          className="shrink-0 px-8 pt-8 pb-6"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <DialogTitle className="text-2xl font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
            Edit Application
          </DialogTitle>
          <DialogDescription className="text-[15px]" style={{ color: "#6e6e73" }}>
            Update details for {application.company_name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-8 py-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_company_name" style={labelStyle}>Company <span style={{ color: "#dc2626" }}>*</span></Label>
                <Input id="edit_company_name" placeholder="e.g. Google" value={form.company_name} onChange={(e) => updateField("company_name", e.target.value)} className="apple-input h-11 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role_title" style={labelStyle}>Role <span style={{ color: "#dc2626" }}>*</span></Label>
                <Input id="edit_role_title" placeholder="e.g. Software Engineer" value={form.role_title} onChange={(e) => updateField("role_title", e.target.value)} className="apple-input h-11 text-base" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_status" style={labelStyle}>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger id="edit_status" className="apple-input h-11 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_applied_date" style={labelStyle}>Applied Date</Label>
                <Input id="edit_applied_date" type="date" value={form.applied_date} onChange={(e) => updateField("applied_date", e.target.value)} className="apple-input h-11 text-base" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_salary_range" style={labelStyle}>Salary Range</Label>
                <Input id="edit_salary_range" placeholder="e.g. $80k – $120k" value={form.salary_range} onChange={(e) => updateField("salary_range", e.target.value)} className="apple-input h-11 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_location" style={labelStyle}>Location</Label>
                <Input id="edit_location" placeholder="e.g. San Francisco, CA" value={form.location} onChange={(e) => updateField("location", e.target.value)} className="apple-input h-11 text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_job_url" style={labelStyle}>Job URL</Label>
              <Input id="edit_job_url" type="url" placeholder="https://..." value={form.job_url} onChange={(e) => updateField("job_url", e.target.value)} className="apple-input h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_notes" style={labelStyle}>Notes</Label>
              <Textarea id="edit_notes" placeholder="Referral contact, interview prep notes..." rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="apple-input text-base" />
            </div>
            {error && <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>}
          </div>

          <div className="shrink-0 flex items-center justify-end gap-3 px-8 py-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <button type="button" onClick={() => onOpenChange(false)} className="apple-btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="apple-btn-primary">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
