import { Suspense } from "react";
import { fetchCourses } from "@/lib/supabase";
import type { Course } from "@/types";
import Sidebar from "@/components/Sidebar";
import HeroTile from "@/components/HeroTile";
import ActivityTile from "@/components/ActivityTile";
import CourseCard from "@/components/CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";

export const dynamic = "force-dynamic";

async function CourseFeed() {
  let courses: Course[] = [];

  try {
    courses = await fetchCourses();
  } catch {
    return (
      <div
        className="col-span-full flex flex-col items-center gap-3 rounded-xl p-10 text-center"
        style={{
          border: "1px dashed rgba(239,68,68,0.25)",
          background: "rgba(239,68,68,0.04)",
        }}
      >
        <p className="text-sm text-red-400/80">
          Couldn&apos;t reach the database. Double-check your{" "}
          <code className="font-mono text-red-400">.env.local</code> values.
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="col-span-full py-10 text-center text-sm text-slate-600">
        No courses yet — seed your Supabase{" "}
        <code className="font-mono">courses</code> table.
      </p>
    );
  }

  return (
    <>
      {courses.map((course, i) => (
        <CourseCard key={course.id} course={course} index={i} />
      ))}
    </>
  );
}

export default function Dashboard() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#08090d" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="col-span-1 lg:col-span-2">
            <HeroTile />
          </div>
          <div className="col-span-1">
            <ActivityTile />
          </div>
          <Suspense fallback={<CourseSkeleton />}>
            <CourseFeed />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
