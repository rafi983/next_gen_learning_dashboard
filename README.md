# EduForge — Student Dashboard

Built for the Frontend Intern Challenge. Dark-mode Bento grid dashboard, live Supabase data, Framer Motion animations.

---

## Architectural choices

### Layout split

The outer `Dashboard` component in `page.tsx` is a plain Server Component — it renders the sidebar and grid shell immediately with no data dependency. `CourseFeed` is the only async piece, so that's the only thing behind a `<Suspense>` boundary. Hero and activity tiles render on the first pass while the DB query is still running.

Could've just awaited courses at the top of the page, but that would've blocked the entire UI until Supabase responded. This way the shell is instant and the cards stream in.

### Server / client split

Simple rule: touches the DB or has no interactivity → Server Component. Needs `useState`, `useEffect`, or any animation → `'use client'`.

- `page.tsx`, `CourseFeed` — server
- `Sidebar`, all tiles, `CourseCard` — client
- `lib/supabase.ts` — server-only, never imported from a client component

One thing that bit me: props crossing the server → client boundary have to be serializable. Tried passing a Lucide icon component as a prop from a Server Component — React threw because functions can't be serialized. Ended up passing the icon name as a string and resolving it to the actual component inside `CourseIcon.tsx`.

### Animations

All motion uses `opacity` + `y` for entrances and `scale` for hover — nothing that touches layout. Progress bar uses `scaleX` instead of animating `width` so it never triggers a reflow.

Stagger on course cards uses per-card `delay` values (`0.05 + i * 0.07`) rather than a Framer Motion stagger container. The cards are inside a `<Suspense>` boundary and mount after the rest of the page, so a container-level stagger would've already completed by the time they appeared.

Hover `transition` is defined inside `whileHover` explicitly — if you leave it in the top-level `transition` prop, entrance delays technically apply to gesture animations too. Framer ignores them in practice but being explicit is cleaner.

---

## Challenges

**Supabase client throwing at build time**

`createClient` validates the URL the moment it's called. Had it at module scope initially — Next.js threw during static page analysis because the env vars aren't loaded in that context. Moved it into a lazy `getClient()` so it only runs when `fetchCourses` is actually invoked at request time.

**`loading.tsx` vs `<Suspense>`**

They look like they do the same thing but don't. `loading.tsx` wraps the whole route segment and kicks in during client-side navigation. The `<Suspense>` around `CourseFeed` is more granular — it streams just the course section while the rest of the page is already visible. Kept both for different cases.

**`transform-origin` on the progress bar**

Framer Motion manages transforms through its own CSS variable system. Tailwind's `origin-left` wasn't reliable across all cases, so added `.bar-fill { transform-origin: left center }` in `globals.css` directly to make sure `scaleX` always grows from the left edge.
