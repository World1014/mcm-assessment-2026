# Implementation Notes

## Task 1: Fetch and render the real data

The home route was only querying theater IDs and names, while the ticket and confirmation routes used placeholder showtime data. Supabase `pg_graphql` exposes related records through nested collection edges, so the queries were expanded to request theaters, movies, and showtimes, including availability and prices. The selected routes filter by both movie ID and showtime ID. Shared TypeScript models describe the GraphQL response and the UI data shape, with explicit mapping for GraphQL IDs. Placeholder data was removed, and missing movies or showtimes now produce a user-facing recovery screen through the App Router error boundary. The payment form was also given strict query and event types, and its Back button was made non-submitting. No database mutations or changes to the underlying data were introduced.

## Task 2: GA4 measurement

Not implemented yet. The planned approach is to push GA4-recommended ecommerce events to `dataLayer`, including route-aware page views, showtime browsing, Buy selection, ticket quantity selection, checkout/payment steps, and a purchase event containing the movie, showtime, theater, ticket quantities, currency, and total value. Purchase deduplication should use a stable transaction ID and browser storage because the confirmation page can be revisited.

## Task 3: Google Tag Manager container

Not implemented yet. The next step is to create a GTM web container, replace the placeholder container ID in `app/layout.tsx`, and verify the container in GTM Preview mode. The supplied dataLayer logger will remain unchanged.

## Task 4: GTM-driven availability UI

Not implemented yet. The planned approach is a GTM Custom HTML tag loading an external script from `public/gtm/task-4.js`. The script will use the stable `data-testid` and `data-*` attributes, observe client-side navigation and React re-renders, mark unavailable showtimes as sold out, cap ticket options by availability, and replace zero-availability ticket selectors with non-interactive sold-out states. This will remain post-render DOM manipulation, as required, rather than changing the React components.

## Validation

Task 1 passed workspace diagnostics, ESLint, and the Next.js production build. Live navigation and GTM/GA4 verification are still required when the remaining integrations are implemented.
