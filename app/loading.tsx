export default function Loading() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: '#08090d' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-7 w-7 rounded-full border-2 border-blue-500/25 border-t-blue-500 animate-spin" />
        <p className="text-xs tracking-widest text-slate-600 uppercase">Loading</p>
      </div>
    </div>
  )
}
