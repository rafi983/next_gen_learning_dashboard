import { createClient } from "@supabase/supabase-js";
import type { Course } from "@/types";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error("missing supabase env vars — check .env.local");
  return createClient(url, key);
}

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await getClient()
    .from("courses")
    .select("id, title, progress, icon_name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchCourses:", error.message);
    throw error;
  }

  console.log("[dev] fetched", data?.length, "courses");
  return data ?? [];
}
