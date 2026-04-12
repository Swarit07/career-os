"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Loader2,
  Briefcase,
} from "lucide-react";
import { NewApplicationDialog, type ApplicationInitialValues } from "../../dashboard/_components/new-application-dialog";
import type { AdzunaJob } from "@/app/api/jobs/search/route";

const JOB_TITLE_SUGGESTIONS = [
  "Software Engineer", "Software Engineering Intern", "Frontend Developer",
  "Backend Developer", "Full Stack Developer", "Full Stack Engineer",
  "Data Scientist", "Data Analyst", "Data Engineer", "Machine Learning Engineer",
  "AI Engineer", "Product Manager", "Product Designer", "UX Designer",
  "UI/UX Designer", "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer",
  "Mobile Developer", "iOS Developer", "Android Developer", "React Developer",
  "Python Developer", "Java Developer", "Business Analyst", "Systems Analyst",
  "Security Engineer", "Cybersecurity Analyst", "QA Engineer", "Solutions Architect",
  "Software Architect", "Research Engineer", "Computer Vision Engineer",
  "NLP Engineer", "Embedded Systems Engineer", "Database Administrator",
  "Technical Writer", "Project Manager", "Scrum Master", "Marketing Manager",
  "Graphic Designer", "Finance Analyst", "Recruiter",
];

const COMPANY_SUGGESTIONS = [
  "Google", "Amazon", "Microsoft", "Apple", "Meta", "Netflix", "Tesla", "Nvidia",
  "Salesforce", "Adobe", "Oracle", "Intel", "IBM", "Cisco", "Uber", "Lyft",
  "Airbnb", "Spotify", "Stripe", "Square", "PayPal", "Shopify", "LinkedIn",
  "Snap", "Pinterest", "DoorDash", "Instacart", "Robinhood", "Coinbase",
  "Palantir", "Snowflake", "Databricks", "OpenAI", "Anthropic", "Scale AI",
  "Goldman Sachs", "JPMorgan", "Morgan Stanley", "Deloitte", "McKinsey",
  "Accenture", "BCG", "Bain", "Boeing", "Lockheed Martin", "SpaceX",
  "Raytheon", "Northrop Grumman", "Johnson & Johnson", "Pfizer", "Moderna",
  "Walmart", "Target", "Nike", "Disney", "Comcast", "AT&T", "Verizon",
];

const JOB_TYPES = [
  { value: "all", label: "All" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
] as const;

type JobType = (typeof JOB_TYPES)[number]["value"];

function guessCompanyDomain(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(
        /\b(inc|llc|ltd|corp|co|group|technologies|technology|solutions|services|global|international|holdings|enterprises|the|and|&)\b/g,
        ""
      )
      .replace(/[^a-z0-9]/g, "")
      .trim() + ".com"
  );
}

function CompanyLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const domain = guessCompanyDomain(name);
  const initial = name[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-[#f0f0f5]">
      {failed ? (
        <span className="text-sm font-semibold text-[#6e6e73]">{initial}</span>
      ) : (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `up to ${fmt(max!)}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function SearchInput({
  value,
  onChange,
  onSelect,
  onSearch,
  suggestions,
  placeholder,
  icon: Icon,
  suggestLoading,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  onSearch: () => void;
  suggestions: string[];
  placeholder: string;
  icon: React.ElementType;
  suggestLoading?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { setActiveIndex(-1); }, [suggestions]);

  const showDropdown = open && suggestions.length > 0;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) { if (e.key === "Enter") onSearch(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") { if (activeIndex >= 0) { onSelect(suggestions[activeIndex]); setOpen(false); } else { onSearch(); } }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1a6] pointer-events-none z-10" />
      {suggestLoading && (
        <Loader2 className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[#a1a1a6] pointer-events-none z-10" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="apple-input h-11 w-full pl-10 pr-4 text-sm"
      />
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); onSelect(s); setOpen(false); }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                i === activeIndex ? "bg-[#f5f5f7] text-[#1d1d1f]" : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#a1a1a6]" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function JobMarketClient() {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState<JobType>("all");
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const locationDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefill, setPrefill] = useState<ApplicationInitialValues>({});

  function handleWhatChange(v: string) {
    setWhat(v);
    if (!v.trim()) { setTitleSuggestions([]); return; }
    const lower = v.toLowerCase();
    setTitleSuggestions(JOB_TITLE_SUGGESTIONS.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6));
  }

  function handleCompanyChange(v: string) {
    setCompany(v);
    if (!v.trim()) { setCompanySuggestions([]); return; }
    const lower = v.toLowerCase();
    setCompanySuggestions(COMPANY_SUGGESTIONS.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6));
  }

  function handleWhereChange(v: string) {
    setWhere(v);
    if (v.length < 2) { setLocationSuggestions([]); return; }
    if (locationDebounce.current) clearTimeout(locationDebounce.current);
    locationDebounce.current = setTimeout(async () => {
      setLocationLoading(true);
      try {
        const res = await fetch(`/api/jobs/locations?q=${encodeURIComponent(v)}`);
        if (res.ok) setLocationSuggestions(await res.json());
      } finally {
        setLocationLoading(false);
      }
    }, 300);
  }

  async function search(p = 1) {
    setError(null);
    startTransition(async () => {
      const params = new URLSearchParams({ what, where, company, job_type: jobType, page: String(p) });
      const res = await fetch(`/api/jobs/search?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Search failed.");
        setJobs([]);
        setCount(0);
      } else {
        setJobs(data.results);
        setCount(data.count);
        setPage(p);
        setHasSearched(true);
      }
    });
  }

  function handleAddToPipeline(job: AdzunaJob) {
    const salary = formatSalary(job.salary_min, job.salary_max);
    setPrefill({
      company_name: job.company.display_name,
      role_title: job.title,
      location: job.location.display_name,
      salary_range: salary ?? "",
      job_url: job.redirect_url,
    });
    setDialogOpen(true);
  }

  const totalPages = Math.ceil(Math.min(count, 500) / 20);

  return (
    <div className="flex flex-col gap-4">
      {/* Search panel */}
      <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#f5f5f7] p-4 sm:p-5 space-y-3">
        {/* Row 1: title | company | location | search */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            value={what}
            onChange={handleWhatChange}
            onSelect={(v) => { setWhat(v); setTitleSuggestions([]); }}
            onSearch={() => search(1)}
            suggestions={titleSuggestions}
            placeholder="Job title, keywords…"
            icon={Search}
            className="flex-1"
          />
          <SearchInput
            value={company}
            onChange={handleCompanyChange}
            onSelect={(v) => { setCompany(v); setCompanySuggestions([]); }}
            onSearch={() => search(1)}
            suggestions={companySuggestions}
            placeholder="Company…"
            icon={Building2}
            className="sm:w-44"
          />
          <SearchInput
            value={where}
            onChange={handleWhereChange}
            onSelect={(v) => { setWhere(v); setLocationSuggestions([]); }}
            onSearch={() => search(1)}
            suggestions={locationSuggestions}
            placeholder="Location…"
            icon={MapPin}
            suggestLoading={locationLoading}
            className="sm:w-48"
          />
          <button
            onClick={() => search(1)}
            disabled={isPending || (!what.trim() && !company.trim())}
            className="apple-btn-primary h-11 shrink-0 rounded-xl px-5 text-sm disabled:opacity-40"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>

        {/* Row 2: job type filter chips */}
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setJobType(t.value)}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                jobType === t.value
                  ? "border-[rgba(0,113,227,0.4)] bg-[rgba(0,113,227,0.08)] text-[#0071e3]"
                  : "border-[rgba(0,0,0,0.07)] bg-white text-[#6e6e73] hover:border-[rgba(0,0,0,0.14)] hover:text-[#1d1d1f]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Search unavailable</p>
            <p className="mt-0.5 text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Results count */}
      {hasSearched && !error && (
        <p className="text-xs text-[#86868b]">
          {count.toLocaleString()} results
          {what ? ` for "${what}"` : ""}
          {company ? ` at ${company}` : ""}
          {where ? ` in ${where}` : ""}
          {jobType !== "all" ? ` · ${JOB_TYPES.find((t) => t.value === jobType)?.label}` : ""}
        </p>
      )}

      {/* Job list */}
      {jobs.length > 0 && (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onAdd={() => handleAddToPipeline(job)} />
          ))}
        </div>
      )}

      {hasSearched && jobs.length === 0 && !error && !isPending && (
        <div className="apple-empty flex flex-col items-center gap-3 py-16">
          <Search className="h-8 w-8 text-[#a1a1a6]" />
          <p className="text-sm text-[#6e6e73]">No results. Try different keywords or filters.</p>
        </div>
      )}

      {!hasSearched && !error && (
        <div className="apple-card flex flex-col items-center justify-center gap-4 rounded-2xl p-10" style={{ minHeight: 280 }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f0f5]">
            <Briefcase className="h-6 w-6 text-[#a1a1a6]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#6e6e73]">Search for jobs to get started</p>
            <p className="mt-1 text-xs text-[#a1a1a6]">Try &quot;Software Engineer&quot; or search by company</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => search(page - 1)}
            disabled={page <= 1 || isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.08)] text-[#6e6e73] transition-colors hover:border-[rgba(0,0,0,0.15)] hover:text-[#1d1d1f] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-[#6e6e73]">Page {page} of {totalPages}</span>
          <button
            onClick={() => search(page + 1)}
            disabled={page >= totalPages || isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.08)] text-[#6e6e73] transition-colors hover:border-[rgba(0,0,0,0.15)] hover:text-[#1d1d1f] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <NewApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} initialValues={prefill} />
    </div>
  );
}

function JobCard({ job, onAdd }: { job: AdzunaJob; onAdd: () => void }) {
  const salary = formatSalary(job.salary_min, job.salary_max);
  const description = job.description.replace(/<[^>]*>/g, "").slice(0, 220);

  return (
    <div className="apple-card group flex flex-col gap-4 rounded-2xl p-5 transition-colors hover:bg-[#fafafa] sm:flex-row sm:items-start sm:gap-5">
      <CompanyLogo name={job.company.display_name} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#1d1d1f] leading-snug">{job.title}</p>
            <p className="text-xs text-[#6e6e73] mt-0.5">{job.company.display_name}</p>
          </div>
          <span className="shrink-0 text-[11px] text-[#86868b] mt-0.5">{timeAgo(job.created)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-xs text-[#6e6e73]">
            <MapPin className="h-3 w-3 shrink-0" />
            {job.location.display_name}
          </span>
          {salary && (
            <span className="flex items-center gap-1.5 text-xs text-[#10b981]">
              <DollarSign className="h-3 w-3 shrink-0" />
              {salary}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-[#86868b]">{description}…</p>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onAdd}
            className="apple-btn-primary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to Pipeline
          </button>
          <a
            href={job.redirect_url.startsWith("https://") ? job.redirect_url : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 text-xs text-[#6e6e73] transition-colors hover:border-[rgba(0,0,0,0.15)] hover:text-[#1d1d1f]"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
