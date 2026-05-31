# EduForge — Student Dashboard

A next-gen learning dashboard built for the Frontend Intern Challenge. Dark-mode only, Bento grid layout, live Supabase data, and Framer Motion animations throughout.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Language | TypeScript |

---

## File structure

```
├── app/
│   ├── analytics/page.tsx    # stub page
│   ├── courses/page.tsx      # stub page
│   ├── settings/page.tsx     # stub page
│   ├── tasks/page.tsx        # stub page
│   ├── globals.css           # base styles, grain texture, scrollbar
│   ├── layout.tsx            # root layout, fonts, metadata
│   ├── loading.tsx           # route-level loading spinner
│   └── page.tsx              # dashboard — Server Component + Suspense boundary
│
├── components/
│   ├── ActivityTile.tsx      # contribution graph tile
│   ├── CourseCard.tsx        # course card with animated progress bar
│   ├── CourseIcon.tsx        # maps icon_name string → Lucide component
│   ├── CourseSkeleton.tsx    # pulsing placeholder shown while data loads
│   ├── HeroTile.tsx          # welcome tile with streak badges
│   ├── Sidebar.tsx           # collapsible nav, layoutId pill, mobile bottom bar
│   └── Stub.tsx              # placeholder for unbuilt pages
│
├── lib/
│   └── supabase.ts           # lazy Supabase client + fetchCourses()
│
├── .env.local.example        # rename to .env.local and add your keys
├── types.ts                  # Course interface
└── README.md
```

---

## Running locally

```bash
npm install
cp .env.local.example .env.local  # fill in your Supabase keys
npm run dev
```

---

## Architectural choices

### Layout split

The outer `Dashboard` in `page.tsx` is a plain Server Component — renders the sidebar and grid shell immediately with no data dependency. `CourseFeed` is the only async piece, so that's the only thing behind a `<Suspense>` boundary. Hero and activity tiles render on the first pass while the DB query is still in flight.

Could've awaited courses at the top of the page, but that blocks the entire UI until Supabase responds. This way the shell is instant and cards stream in.

### Server / client split

Simple rule: touches the DB or has no interactivity → Server Component. Needs `useState`, `useEffect`, or any animation → `'use client'`.

- `page.tsx`, `CourseFeed` — server
- `Sidebar`, all tiles, `CourseCard` — client
- `lib/supabase.ts` — server-only, never imported from a client component

One thing that caught me: props crossing the server → client boundary have to be serializable. Tried passing a Lucide icon component as a prop from a Server Component — React threw because functions can't cross that boundary. Ended up passing the icon name as a string and resolving it inside `CourseIcon.tsx`.

### Animations

All motion uses `opacity` + `y` for entrances and `scale` for hover — nothing that touches layout. Progress bar uses `scaleX` instead of animating `width` so it never triggers a reflow.

Stagger on course cards uses per-card `delay` values (`0.05 + i * 0.07`) rather than a Framer Motion stagger container. The cards mount inside a `<Suspense>` boundary after the rest of the page, so a container-level stagger would've already fired by the time they appeared.

Hover `transition` is explicitly defined inside `whileHover` — if you leave it on the top-level `transition` prop, entrance delays technically carry over to gesture animations too.

---

## Challenges

**Supabase client throwing at build time**

`createClient` validates the URL the moment it's called. Had it at module scope — Next.js threw during static page analysis because env vars aren't loaded at that point. Moved it into a lazy `getClient()` that only runs when `fetchCourses` is invoked at request time.

**`loading.tsx` vs `<Suspense>`**

They look similar but aren't. `loading.tsx` wraps the whole route segment and kicks in during client-side navigation. The `<Suspense>` around `CourseFeed` is more granular — streams just the course section while the rest of the page is already visible. Kept both for different cases.

**`transform-origin` on the progress bar**

Framer Motion manages transforms through its own CSS variable system. Tailwind's `origin-left` wasn't consistent across all cases, so added `.bar-fill { transform-origin: left center }` in `globals.css` directly to make sure `scaleX` always grows from the left edge.
