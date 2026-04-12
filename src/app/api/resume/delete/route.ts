import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const body = await req.formData();
  const id = body.get("id");

  if (typeof id === "string" && id) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("resumes")
        .delete()
        .eq("id" as never, id)
        .eq("user_id" as never, user.id);
    }
  }

  redirect("/resume");
}
