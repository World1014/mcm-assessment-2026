# Take-Home: Cinema Booking Integrations

Thanks for taking the time. This is an **integration** exercise, not a build-from-scratch
one. The app already runs and the UI is written, your task is to wire in four integrations.

**Time:** 4–8 hours.

We would genuinely rather see two or three tasks done thoroughly than all four rushed. If
you run out of time, stop where you are and send us your notes and observations on
whatever you did not get to, what you found tricky, how you would have approached it,
what you would want to check. We read those notes properly, and they count.

**Questions are welcome.** Reply to your recruiter at any point and we will get back to
you, asking is never held against you. If something in this brief is ambiguous, we would
rather clarify it than have you guess and lose time. Please bare in my mind we will take
the stance of a usual non-technical stakeholder in response to your inquiry.

---

## Setup

**Node 20.9 or newer** is required (Next.js 16). Check with `node -v` as on an older
version `npm install` may appear to work and then fail confusingly at build time.

```bash
npm install
```

A `.env.local` file is included in this package with the Supabase connection details
already filled in. You should not need to configure anything, if it is missing, reply to
your recruiter and we will resend it rather than have you hunt for it.

Then:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Ground rules

- **Mobile only.** Build and test at a phone viewport. Desktop is explicitly out of
  scope and we will not assess it. You should not spend time on it.
- **You may change the visuals.** The existing design is a starting point, not a
  constraint; restyle, restructure, or improve the appearance however you see fit.
  This covers presentation only. Please leave the underlying data alone: the ticket
  quantity options, prices, availability counts and totals should keep coming from the
  data rather than being hardcoded or adjusted to suit a layout.
- **Storage is fair game.** `localStorage`, `sessionStorage`, and cookies are all allowed
  if they help you manage state between pages.
- **Read-only data.** The exercise never writes to the database; no mutations, no real
  purchase. The payment pages are presentational, and passing data between pages via
  query params is the existing pattern; you don't need to change that.

## On AI tools

AI tools exist and we are not going to pretend otherwise. But our company policy strongly
prohibits their use in our day-to-day work internally, aside from Microsoft Copilot. We do
not have access to Claude, ChatGPT, or the other popular tools.

So please complete this exercise without them. We expect the work to be representative of
your own capabilities, and any explanations to be your own as well. We assess what you
send us as delivered, so the notes you write are how we understand your reasoning and they
carry real weight as such they should be yours.

## What's already here

A four-page booking flow:

| Route | Purpose |
| --- | --- |
| `/` | Theaters → movies → showtimes, with a **Buy** CTA per showtime |
| `/tickets` | Adult/children quantity selection for the chosen showtime |
| `/payment-information` | Payment form (display only) |
| `/payment-confirmation` | Order summary |

Every spot you need to touch is marked with a `// TODO (task N)` comment.

Note that navigation between these pages is **client-side**, there is no full page load
when moving between them. This matters for tasks 2 and 4.

### Reference designs

`theater-1.png` through `theater-4.png` in the repo root are the intended designs for each
screen, in order: showtimes, ticket selection, payment, confirmation. Use them as a guide
for the look and feel.

They are a visual reference rather than a spec, so treat those as illustrative.

## The data

Already provisioned in Supabase - do **not** recreate it.

- `theaters` → `id`, `name`
- `movies` → `id`, `theater_id` (→ `theaters.id`), `title`
- `showtimes` → `id`, `movie_id` (→ `movies.id`), `showtime` (text, e.g. `"5:00PM"`),
  `adult_available`, `children_available`, `adult_price`, `children_price`

A theater has many movies; a movie has many showtimes.

> **Discovery hint:** the endpoint is Supabase's `pg_graphql`. Schema introspection is
> switched off on this project, so a schema explorer will not enumerate the types for
> you - work from Supabase's GraphQL documentation to figure out how it exposes tables,
> and iterate against the live endpoint with any HTTP client (curl, Postman, Insomnia)
> using the headers from `lib/graphql.ts`.

---

## Your four tasks

### Task 1 - Highest Priorty -  Fetch and render the real data

`app/page.tsx` currently fetches theater names only, so movies and showtimes render empty.
`app/tickets/page.tsx` and `app/payment-confirmation/page.tsx` fall back to a hardcoded
placeholder showtime.

Expand all three queries to fetch the full nested structure, and remove the placeholders.

**Success:** the full theaters → movies → showtimes tree renders on `/`, and the ticket
and confirmation pages show the real showtime, prices, and availability.

> **If you get stuck here, ask us.** Working out how this endpoint wants to be queried is
> part of the task, but it is not the part we care most about - tasks 2 to 4 are. If you
> have been wrestling with task 1 for a while, reply to your recruiter and we will send
> you a working sample query. We would much rather spend your time on the measurement and 
> tag work than have you stuck on query syntax.

### Task 2 - Medium Priorty - GA4 measurement

Instrument the app with GA4 via `dataLayer`. We want to see the booking funnel end to end.

**Required:**

- **Page views** - on every route. Remember that navigation is client-side, so a single
  page-load event will not cover it.
- **Click events** - meaningful interactions, at minimum the **Buy** CTA and the quantity
  selectors.
- **A checkout funnel** - distinct steps from browsing showtimes through to a completed
  purchase, so the drop-off between them can be measured.
- **A purchase event** on `/payment-confirmation` carrying:
  - the movie being watched
  - the showtime it is being watched at
  - the number of tickets, broken down by type (adult / children)
  - the total value of the purchase

**Suggested approach.** We would rather you use GA4's recommended ecommerce event names
than invent your own - `view_item_list`, `select_item`, `begin_checkout`,
`add_payment_info`, `purchase`. They map onto the flow above almost one-to-one, and GA4's
reports and DebugView understand them without extra configuration. A `purchase` payload in
that shape would carry roughly:

- `transaction_id`, `value`, `currency`
- `items[]`, with one entry per ticket type carrying `item_name` (the movie),
  `item_variant` (the showtime), `item_category` (the theater), `price`, and `quantity`

Two things worth thinking about - if you handle either of them, say so in your notes:

- GA4 will not record revenue without `currency`.
- `/payment-confirmation` is reachable by refresh and by the back button, so it is easy
  to end up firing `purchase` more than once for the same order. A `transaction_id` plus
  a little storage is the usual way to handle it.

Anything beyond the required list is welcome - tell us why you added it.

**Success:** the funnel is measurable end to end, and every payload is visible in the
console log described below.

#### The dataLayer logger (supplied - you do not need to write this)

`app/layout.tsx` already includes a logger that wraps `dataLayer.push` and prints every
payload to the console with a timestamp and event name. It captures everything: your own
pushes, pushes from your GTM tags, and GTM's internal ones. You do not need to add logging
by hand, and you should not need to modify it.

It exists so we can review exactly what you are sending and when, without access to your
GA4 property. Please leave it in place.

### Task 3 - Required - Your own GTM container

Create a free Google Tag Manager container, and replace the `GTM-XXXXXXX` placeholder in
`app/layout.tsx` with your container ID.

**Success:** the container loads, confirmed in GTM Preview mode.

### Task 4 - High Priority - Modify the rendered pages from a GTM tag

This is the substantial one. Using **GTM** - not by editing the React components - make
the UI reflect ticket availability after render:

1. **Sold out button.** On `/`, a showtime with no tickets available should show a
   sold-out, non-actionable button instead of **Buy**.
2. **Cap the quantity options.** On `/tickets`, each dropdown should offer only up to the
   number of tickets actually available, rather than the fixed 0–20 range it ships with.
3. **Sold-out ticket type.** On `/tickets`, a ticket type with zero availability should
   not open a dropdown at all - it should state that it is sold out.

All three must be done **post-render, through traditional scripting**. Treat the React app
as a black box you are layering on top of - working within that constraint is the part we
are most interested in seeing.

**Your changes should survive navigation.** Moving forward through the flow, hitting back,
and returning to a page should all leave the modified UI correct. This one is worth
testing deliberately - it is easy to end up with something that applies cleanly on first
load and then quietly stops.

To make this possible, availability is published in the DOM in two ways: as visible text,
and as `data-*` attributes (`data-adult-available`, `data-children-available`,
`data-available`). Stable `data-testid` hooks are on the elements you will want to target.

**Success:** all three behaviours apply after load and stay correct across navigation,
driven entirely from GTM.

#### A note on JavaScript syntax in GTM

GTM has two different JavaScript environments with different rules, which trips people up:

- **Custom JavaScript Variables** and **Custom Templates** run inside GTM's own sandbox.
  That sandbox is **ES5 only** - no arrow functions, `let` / `const`, template literals or
  `class` - and its DOM access is restricted.
- **Custom HTML tags** are different. GTM injects their contents into the page as a real
  `<script>` element, so the browser runs it directly.

You do not have to work out which rules bite where. Use a Custom HTML tag that loads an
external JavaScript file:

```html
<script src="/gtm/task-4.js"></script>
```

Anything loaded that way is ordinary browser JavaScript - write it in whatever syntax you
prefer. You can serve it from this repo's `public/` folder (`public/gtm/task-4.js`
resolves to `/gtm/task-4.js`), or from any host you control.

**We would prefer you do it this way.** A real file in the repo is something we can read
and discuss, rather than a blob pasted into a container export. The logic still runs
post-render via GTM, which is what this task is about.

---

## Deploying it (optional, but we recommend it)

You are welcome to work entirely on `localhost` - nothing in the four tasks requires a
deployed site. But putting it on a free host makes life easier for both of us: your GTM
container fires against a real domain, and we can look at your work without setting
anything up locally.

### Where

All of these have free tiers that comfortably cover this project:

| Host | Notes |
| --- | --- |
| **Vercel** | Built by the Next.js team. Import the repo and it detects everything - no configuration. The path of least resistance. |
| **Netlify** | Works well with Next.js via their adapter. Fine if you already use it. |
| **Cloudflare Pages** | Also viable, slightly more setup for Next.js. |

Any of them is fine. Use whatever you are quickest in - we are not assessing your hosting
choice.

### One note regarding the repo

`.env.local` is git-ignored, so it will **not** be in your repository, and it will **not**
reach your host. You have to add the two variables in the host's own settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy both values out of the `.env.local` you were given.

- **Vercel:** Project -> Settings -> Environment Variables, then redeploy.
- **Netlify:** Site configuration -> Environment variables, then redeploy.

If you skip this the **build fails** rather than the site loading broken - the home page is
prerendered at build time, so you will see the deploy error out with
`Missing Supabase environment variables`. If that is the error you are looking at, this is
why.

Both variables are `NEXT_PUBLIC_`, meaning they are deliberately exposed to the browser.
The key we gave you is a Supabase *publishable* key, which is designed for exactly that, so
there is nothing to worry about in putting it on a public site.

### If you use GitHub

Please include the repository URL in your submission. Public or private are both fine - if
private, reply to your recruiter and they will tell you who to share it with.

Do not commit `.env.local`. The `.gitignore` already excludes it, so this should take care
of itself, but it is worth a glance before you push.

## Notes and debugging pointers

- Review the actual components and app files for additional task notes.
- **GTM Preview mode** and **GA4 DebugView** are your friends for tasks 2–4.
- Navigation is client-side, so a tag that only fires on initial page load will not see
  the page you expect. GTM's History Change trigger is relevant in some cases.
- Parts of the UI mount only on interaction - the quantity dropdowns do not exist in the
  DOM until they are opened.
- React re-renders can overwrite direct DOM edits. How you handle that is up to you.
- Styling uses CSS Modules, so class names are hashed at build time. Do not rely on the
  authored class names from a tag.
- Task 4 targets elements that only appear once task 1 is done. Do task 1 first.

## What to submit

- The repo with your changes - as a **GitHub URL** if you used one, otherwise a zip.
- Your **GTM container export** (JSON).
- The **deployed URL**, if you deployed it.
- **A short screen recording** walking through the app with the console open if possible. 
  Screenshots of GTM Preview / GA4 DebugView are an acceptable substitute, but a recording
  is much better here - it shows the funnel firing in sequence and your task 4 changes
  surviving navigation, neither of which a still frame can convey.
- **Your notes.** See below.

### About the notes

We review your submission as delivered - there is no follow-up call where you get to
explain it. That makes your notes the only window we have into your reasoning, so they
matter more here than on a typical take-home. Please cover:

- Anything you did not get to, and how you would have approached it.
- Any judgement calls you made, particularly on task 4, where a lot is left open.
- Anything you found awkward, surprising, or think we got wrong in this brief.
- Consider the scenario where the tasks may have been incorrectly stated, call it out.
- What you would improve with more time.

A few paragraphs is plenty. We would far rather have brief and honest than long and
polished.
