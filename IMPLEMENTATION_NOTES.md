# Implementation Notes

## Task 1

For task 1, I first familiarized myself with the route structure, query helper, data models, and component props (more or less getting a feel for the repo). I found that the home query only requested static theater fields and that the ticket and confirmation routes used placeholder showtimes, so I expanded the Supabase GraphQL queries using the nested collection/edge structure, mapped the responses into the existing UI models, and added typed response models. I also thought it would be useful to add a user-facing error boundary for failed requests or invalid selections since that could be a potential place for errors to occur.

## Task 2

For task 2, I traced the existing client-side navigation and booking data flow to help me choose potential event locations. I then added an analytics boundary so page views, showtime browsing/selection, quantities, checkout, payment information, and purchase events all use consistent payloads. I made sure that revenue events use USD, and purchase events include the movie, showtime, theater, ticket quantities, prices, value, and transaction ID. I also added guards for React effect re-runs, rapid checkout clicks, and confirmation refreshes/back navigation. Purchase events are stored in `localStorage` using the transaction ID so revisiting the confirmation page does not send the same purchase again (adding idempotency for transactions).

## Task 3

For task 3, I created the GTM container, configured its ID in `app/layout.tsx`, and added the Google tag and task 4 Custom HTML tag. The deployed site loads the container. I initially had an issue connecting GTM Tag Assistant Preview, but found that my ad blocker had not been fully disabled; after disabling it, Preview connected as expected.

## Task 4

For task 4, I treated the React UI as a black box and started from the stable DOM hooks and availability attributes provided in the brief. I then split the post-render behavior into scripts for showtime buttons, ticket selectors, and navigation/re-render handling, with `task-4.js` as the single GTM entry point. I figured that creating separate scripts could be helpful for maintainability and just easier to manage/work with. I also tested that the scripts survive client-side navigation, cap available options, and apply accessible sold-out states. This approach keeps each DOM responsibility isolated and respects the requirement that the behavior comes from GTM instead of React.

## Other changes made

Beyond the requested changes from the README, I found a few areas for improvement that I thought could be helpful: added keyboard support and ARIA relationships to the custom ticket selectors, visible focus styles, improved contrast, accessible payment labels and autofill metadata, generic data-load error handling, and a fix for a date hydration mismatch between the server and browser. The bulk of these changes are in an effort to make sure the site is accessible and disability friendly and hopefully improving usability.

Something else I wanted to note since this is important for analytics, but I also checked the analytics payloads for personally identifiable information. The application only sends booking and catalog details; it never reads or pushes the payment form's first name, last name, or card number. GTM's automatic form interaction events contain form metadata and DOM references, which do not include any input values, so we are clean on that front.

## Potential next steps (if I had more time)

With more time some more things I would have really liked would be: to use Zod or a different schema library to create schemas for specific requests and use those for validation (which can be more useful/easier than just managing types), add tests to ensure that the changes are consistent across different screen sizes and systems (I think unit tests for the logic would be helpful, along with end-to-end tests to make sure the critical workflows work and make sense, as well as some usability/accessability testing), and create more refined error boundaries. I added a global error boundary, but lower-level, more specific boundaries for different pages or features could make errors feel less jarring.
