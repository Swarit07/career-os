export const runtime = "nodejs";

export interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const what = searchParams.get("what") ?? "";
  const where = searchParams.get("where") ?? "";
  const company = searchParams.get("company") ?? "";
  const jobType = searchParams.get("job_type") ?? "";
  const rawPage = searchParams.get("page") ?? "1";
  const page = Math.max(1, Math.min(50, parseInt(rawPage, 10) || 1));

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return Response.json(
      { error: "Adzuna API credentials not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to .env.local." },
      { status: 503 }
    );
  }

  // Build what param — append type keywords for types Adzuna doesn't have a direct flag for
  let whatFinal = what;
  if (jobType === "internship") {
    whatFinal = what ? `${what} intern` : "intern";
  } else if (jobType === "remote") {
    whatFinal = what ? `${what} remote` : "remote";
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "20",
  });

  if (whatFinal) params.set("what", whatFinal);
  if (where) params.set("where", where);
  if (company) params.set("company", company);

  if (jobType === "full_time") params.set("full_time", "1");
  else if (jobType === "part_time") params.set("part_time", "1");
  else if (jobType === "contract") params.set("contract", "1");

  const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?${params}`;

  const upstream = await fetch(url, { next: { revalidate: 300 } });

  if (!upstream.ok) {
    return Response.json({ error: `Adzuna error ${upstream.status}` }, { status: upstream.status });
  }

  let data: AdzunaResponse;
  try {
    data = await upstream.json();
  } catch {
    return Response.json({ error: "Adzuna returned an invalid response." }, { status: 502 });
  }

  return Response.json({ results: data.results ?? [], count: Number(data.count) || 0 });
}
