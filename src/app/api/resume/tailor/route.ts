import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
  apiKey: "ollama", // required by the client but unused by Ollama
});

const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

export const maxDuration = 120;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { resume_text, job_description } = await req.json();

  if (!resume_text?.trim() || !job_description?.trim()) {
    return new Response("resume_text and job_description are required", { status: 400 });
  }

  if (resume_text.length > 20000 || job_description.length > 10000) {
    return new Response("Input too large. Resume must be under 20 000 chars, job description under 10 000.", { status: 413 });
  }

  let result;
  try {
    result = streamText({
      model: ollama(OLLAMA_MODEL),
      system: `You are an expert resume writer and career coach. Your task is to tailor a resume to a specific job description.

Rules:
- Keep the same overall structure and sections as the original
- Rewrite bullet points to mirror the language, keywords, and priorities from the job description
- Quantify achievements where possible; if the original has numbers, preserve or improve them
- Do NOT fabricate experience, skills, or credentials that aren't in the original
- Keep the same person's voice — don't change first/third person style
- Output ONLY the tailored resume text — no commentary, no preamble, no markdown fences`,
      messages: [
        {
          role: "user",
          content: `Here is my current resume:\n\n${resume_text}\n\n---\n\nHere is the job description I'm applying for:\n\n${job_description}\n\n---\n\nPlease tailor my resume to this role.`,
        },
      ],
    });
    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      return new Response("AI service unavailable. Make sure Ollama is running.", { status: 503 });
    }
    return new Response("Unexpected error.", { status: 500 });
  }
}
