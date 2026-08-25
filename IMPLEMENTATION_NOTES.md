# Implementation Notes

## Task 1: Fetch and render the real data

The home route was only querying theater IDs and names, while the ticket and confirmation routes used placeholder showtime data. Supabase `pg_graphql` exposes related records through nested collection edges, so the queries were expanded to request theaters, movies, and showtimes, including availability and prices. The selected routes filter by both movie ID and showtime ID. Shared TypeScript models describe the GraphQL response and the UI data shape, with explicit mapping for GraphQL IDs. Placeholder data was removed, and missing movies or showtimes now produce a user-facing recovery screen through the App Router error boundary. The payment form was also given strict query and event types, and its Back button was made non-submitting. No database mutations or changes to the underlying data were introduced.

## Task 2: GA4 measurement

Implemented with a typed `dataLayer` helper and a client route tracker that pushes `page_view` on client-side pathname changes. The funnel now pushes `view_item_list`, `select_item`, ticket quantity events, `begin_checkout`, `add_payment_info`, and `purchase`. Ecommerce payloads use USD currency and include totals, ticket quantities, movie, showtime, and theater context. Because the app has a deliberately small, known event vocabulary, an enum and discriminated payload union are used instead of an open-ended `unknown` property map. Route/list effects are guarded against React development re-runs, checkout starts are protected from rapid duplicate clicks, and purchase events use the order ID plus `localStorage` to avoid firing again on refresh or back navigation. The supplied dataLayer logger remains unchanged.

## Task 3: Google Tag Manager container

Not implemented yet. The next step is to create a GTM web container, replace the placeholder container ID in `app/layout.tsx`, and verify the container in GTM Preview mode. The supplied dataLayer logger will remain unchanged.

## Task 4: GTM-driven availability UI

Not implemented yet. The planned approach is a GTM Custom HTML tag loading an external script from `public/gtm/task-4.js`. The script will use the stable `data-testid` and `data-*` attributes, observe client-side navigation and React re-renders, mark unavailable showtimes as sold out, cap ticket options by availability, and replace zero-availability ticket selectors with non-interactive sold-out states. This will remain post-render DOM manipulation, as required, rather than changing the React components.

## Additional improvements

The UI was also improved beyond the explicit integration requirements. The custom ticket selectors now expose listbox and option semantics, support keyboard selection, announce expanded state, provide contextual accessible names, and associate the availability information and validation alert with the relevant controls. A single prominent alert identifies whether adult, children, or both selections exceed availability and tells the user how to correct it. Visible focus styles were added to interactive controls, and muted text colors were darkened for better contrast on mobile. Buttons were given explicit types and the payment Back button no longer submits the form accidentally. These changes preserve the README requirement that availability-based quantity capping and sold-out states remain a GTM task.

The analytics implementation also adds a typed shared helper, a reusable ticket-item builder, and route-aware page tracking through a client component. Quantity selections use a dedicated event so they can be analyzed independently of the GA4 ecommerce events, and theater names are carried through the existing query-string navigation so purchase items have useful category data.

## Validation

Task 1 and task 2 passed workspace diagnostics, ESLint, and the Next.js production build. Live navigation, browser accessibility checks, and GTM/GA4 verification are still required, especially after the remaining GTM container and availability script work is implemented.
