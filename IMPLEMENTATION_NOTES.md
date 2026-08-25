# Implementation Notes

## Task 1: Fetch and render the real data

The home route was only querying theater IDs and names, while the ticket and confirmation routes used placeholder showtime data. Supabase `pg_graphql` exposes related records through nested collection edges, so the queries were expanded to request theaters, movies, and showtimes, including availability and prices. The selected routes filter by both movie ID and showtime ID. Shared TypeScript models describe the GraphQL response and the UI data shape, with explicit mapping for GraphQL IDs. Placeholder data was removed, and missing movies or showtimes now produce a user-facing recovery screen through the App Router error boundary. The payment form was also given strict query and event types, and its Back button was made non-submitting. No database mutations or changes to the underlying data were introduced.

## Task 2: GA4 measurement

Implemented with a typed `dataLayer` helper and a client route tracker that pushes `page_view` on client-side pathname changes. The funnel now pushes `view_item_list`, `select_item`, ticket quantity events, `begin_checkout`, `add_payment_info`, and `purchase`. Ecommerce payloads use USD currency and include totals, ticket quantities, movie, showtime, and theater context. Because the app has a deliberately small, known event vocabulary, an enum and discriminated payload union are used instead of an open-ended `unknown` property map. Route/list effects are guarded against React development re-runs, checkout starts are protected from rapid duplicate clicks, and purchase events use the order ID plus `localStorage` to avoid firing again on refresh or back navigation. The supplied dataLayer logger remains unchanged.

## Task 3: Google Tag Manager container

The GTM web container ID is configured in `app/layout.tsx`. Local browser verification confirms that the container script loads and emits `gtm.js`; Tag Assistant Preview could not connect reliably to localhost, so final Preview verification should be completed against the deployed URL. The supplied dataLayer logger remains unchanged.

## Task 4: GTM-driven availability UI

The post-render integration is split into three focused browser scripts: `task-4-showtimes.js`, `task-4-ticket-types.js`, and `task-4-navigation.js`. The single GTM Custom HTML entry tag loads `public/gtm/task-4.js`, which orchestrates those modules through a shared `MCMTask4` namespace. The showtime module disables rows where both ticket types have zero availability and changes the CTA to an accessible, non-actionable `Sold out` button. The ticket-type module reads each container's `data-available` value, removes quantity options above that maximum, and replaces zero-availability selectors with disabled, labelled sold-out controls. The navigation module observes React DOM mutations, patches History API navigation, and listens for back/forward and pageshow events so the changes survive client-side navigation and re-renders. The loader batches DOM updates with `requestAnimationFrame`, adds styles only once, avoids duplicate installation, and permits a later retry if a module asset fails. The scripts use stable `data-testid` and `data-*` attributes and remain independent of CSS module class names. Direct browser testing confirmed the split modules load, sold-out home buttons work, a `0-10` adult option range appears for ten available tickets, a `0-4` range appears for four available tickets, and a zero-availability children selector becomes disabled. GTM tag configuration, Preview verification, and deployed-site testing remain outstanding.

## Additional improvements

The UI was also improved beyond the explicit integration requirements. The custom ticket selectors now expose listbox and option semantics, support keyboard selection, announce expanded state, provide contextual accessible names, and associate the availability information and validation alert with the relevant controls. A single prominent alert identifies whether adult, children, or both selections exceed availability and tells the user how to correct it. Visible focus styles were added to interactive controls, and muted text colors were darkened for better contrast on mobile. Buttons were given explicit types and the payment Back button no longer submits the form accidentally. These changes preserve the README requirement that availability-based quantity capping and sold-out states remain a GTM task.

The analytics implementation also adds a typed shared helper, a reusable ticket-item builder, and route-aware page tracking through a client component. Quantity selections use a dedicated event so they can be analyzed independently of the GA4 ecommerce events, and theater names are carried through the existing query-string navigation so purchase items have useful category data.

The showtimes date is formatted once in the server route and passed into the client component. This avoids a hydration mismatch caused by formatting `new Date()` independently on the server and browser, particularly around timezone or midnight boundaries.

## Validation

Task 1 and task 2 passed workspace diagnostics, ESLint, and the Next.js production build. The task 4 script passed syntax validation and direct browser behavior checks. Live navigation through the GTM container, browser accessibility checks, and GTM/GA4 verification are still required on the deployed site.
