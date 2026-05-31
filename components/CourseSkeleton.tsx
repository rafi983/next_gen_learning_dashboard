"use client";

function Card() {
  return (
    <article
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "#0f111a",
        border: "1px solid rgba(255,255,255,0.06)",
        minHeight: 180,
      }}
    >
      <div className="animate-pulse flex flex-col gap-4 h-full">
        <div className="flex items-start gap-3">
          <div
            className="h-9 w-9 flex-shrink-0 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div className="flex-1 space-y-2 pt-1">
            <div
              className="h-3 rounded-md w-3/4"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <div
              className="h-2.5 rounded-md w-1/2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          </div>
        </div>
        <div className="flex-1" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div
              className="h-2.5 w-14 rounded-md"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <div
              className="h-2.5 w-8 rounded-md"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>
          <div
            className="h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        </div>
      </div>
    </article>
  );
}

export default function CourseSkeleton() {
  return (
    <>
      <Card />
      <Card />
      <Card />
    </>
  );
}
