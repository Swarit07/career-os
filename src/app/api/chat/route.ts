import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/database.types";

const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
  apiKey: "ollama",
});

const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

export const maxDuration = 120;

function buildSystemPrompt(applications: Application[]): string {
  const appSummary =
    applications.length === 0
      ? "The user has no applications tracked yet."
      : applications
          .map((a) =>
            [
              `- ${a.role_title} at ${a.company_name}`,
              `Status: ${a.status}`,
              a.location ? `Location: ${a.location}` : null,
              a.salary_range ? `Salary: ${a.salary_range}` : null,
              a.applied_date ? `Applied: ${a.applied_date}` : null,
              a.notes ? `Notes: ${a.notes}` : null,
            ]
              .filter(Boolean)
              .join(" | ")
          )
          .join("\n");

  return `You are the CareerOS AI Concierge — a sharp, encouraging, and practical career coach built into a job-tracking platform called CareerOS.

User's current job pipeline:
${appSummary}

Your capabilities:
- Analyze their pipeline and give honest, data-driven feedback
- Help prepare for interviews (common questions, STAR method, company research tips)
- Advise on salary negotiation strategy
- Write or refine cover letters and cold outreach messages
- Suggest ways to improve their application strategy
- Provide motivation and tactical next steps when they're stuck

Tone: confident, concise, and direct. No fluff. Respond in plain text — avoid heavy markdown unless it genuinely helps readability (e.g. a numbered list for steps). Never mention you are a language model.`;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  if (!messages?.length) {
    return new Response("messages are required", { status: 400 });
  }

  // Only accept user/assistant turns — strip any role:system injections from the client
  const safeMessages = (messages as { role: string; content: string }[]).filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  // Fetch applications server-side from the authenticated user's account
  const { data: applications } = (await supabase
    .from("applications")
    .select("*")
    .order("applied_date" as never, { ascending: false })) as { data: Application[] | null };

  let result;
  try {
    result = streamText({
      model: ollama(OLLAMA_MODEL),
      system: buildSystemPrompt(applications ?? []),
      messages: safeMessages,
    });
    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      return new Response(
        JSON.stringify({ error: "AI service unavailable. Make sure Ollama is running." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
