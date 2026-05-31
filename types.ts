// keep in sync with the courses table in supabase
export interface Course {
  id: string;
  title: string;
  progress: number; // 0-100
  icon_name: string;
  created_at: string;
}
