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
import { Button } from "@/components/ui/button";
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
import type {
  ApplicationStatus,
  Database,
} from "@/lib/database.types";

interface NewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  company_name: "",
  role_title: "",
  status: "Applied" as ApplicationStatus,
  salary_range: "",
  location: "",
  job_url: "",
  applied_date: new Date().toISOString().split("T")[0],
  notes: "",
};

export function NewApplicationDialog({
  open,
  onOpenChange,
}: NewApplicationDialogProps) {
  const [form, setForm] = useState(initialForm);
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

    setForm(initialForm);
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
          <DialogDescription>
            Add a new job or internship application to track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company_name"
                placeholder="e.g. Google"
                value={form.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_title">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role_title"
                placeholder="e.g. Software Engineer Intern"
                value={form.role_title}
                onChange={(e) => updateField("role_title", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => updateField("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applied_date">Applied Date</Label>
              <Input
                id="applied_date"
                type="date"
                value={form.applied_date}
                onChange={(e) => updateField("applied_date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                placeholder="e.g. $80k - $100k"
                value={form.salary_range}
                onChange={(e) => updateField("salary_range", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_url">Job URL</Label>
            <Input
              id="job_url"
              type="url"
              placeholder="https://..."
              value={form.job_url}
              onChange={(e) => updateField("job_url", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Referral contact, interview prep notes..."
              rows={3}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
