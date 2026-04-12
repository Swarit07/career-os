export const runtime = "nodejs";
import { createClient } from "@/lib/supabase/server";

interface NominatimResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

function formatLocation(item: NominatimResult): string {
  const a = item.address;
  const city = a.city ?? a.town ?? a.village ?? a.county ?? "";
  const parts = [city, a.state, a.country].filter(Boolean);
  if (parts.length > 1) return parts.join(", ");
  return item.display_name.split(",").slice(0, 3).join(",").trim();
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) return Response.json([]);

  const params = new URLSearchParams({
    q,
    format: "json",
    limit: "8",
    addressdetails: "1",
    "accept-language": "en",
    featuretype: "city",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: { "User-Agent": "CareerOS/1.0 (job-tracking-application)" },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return Response.json([]);

  const data: NominatimResult[] = await res.json();

  const seen = new Set<string>();
  const locations: string[] = [];
  for (const item of data) {
    const formatted = formatLocation(item);
    if (!seen.has(formatted)) {
      seen.add(formatted);
      locations.push(formatted);
    }
    if (locations.length >= 5) break;
  }

  return Response.json(locations);
}
