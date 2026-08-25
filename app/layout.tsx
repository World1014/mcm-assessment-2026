import type { Metadata } from "next";
import { Barlow_Condensed, Inter_Tight } from "next/font/google";
import Script from "next/script";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import "./globals.css";


const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow-condensed',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Assessment 2026",
};

// SUPPLIED FOR YOU -- you do not need to write or modify this.
//
// Wraps dataLayer.push so that every payload pushed to the dataLayer is printed
// to the console with a timestamp, no matter who pushed it: your own code, a GTM
// tag, or GTM itself. You never have to remember to log anything by hand.
//
// It re-wraps on reassignment because gtm.js replaces dataLayer.push with its own
// implementation once the container loads -- a one-time patch would be clobbered.
const DATALAYER_LOGGER = `
(function () {
  window.dataLayer = window.dataLayer || [];
  var dl = window.dataLayer;

  function log(payload) {
    var name = payload && (payload.event || payload[0]);
    try {
      console.log(
        '%c dataLayer.push %c ' + (name || '(no event name)') + ' ',
        'background:#b4541f;color:#fff;border-radius:3px 0 0 3px',
        'background:#2b2b2b;color:#fff;border-radius:0 3px 3px 0',
        new Date().toISOString()
      );
      // Snapshot so the console shows the payload as it was at push time.
      console.log(JSON.parse(JSON.stringify(payload)));
    } catch (e) {
      console.log('dataLayer.push (unserialisable)', payload);
    }
  }

  function wrap(fn) {
    if (!fn || fn.__dlLogged) return fn;
    var wrapped = function () {
      for (var i = 0; i < arguments.length; i++) { log(arguments[i]); }
      return fn.apply(this, arguments);
    };
    wrapped.__dlLogged = true;
    return wrapped;
  }

  var actual = wrap(dl.push);
  Object.defineProperty(dl, 'push', {
    configurable: true,
    get: function () { return actual; },
    set: function (fn) { actual = wrap(fn); }
  });
})();
`;

// TODO (task 3): replace this with your own GTM container ID.
// Create a free container at https://tagmanager.google.com, then confirm it
// loads using GTM Preview mode.
const GTM_ID = "GTM-M5XQB24W";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${interTight.variable} h-full antialiased`}
    >
      <head>
        <Script id="datalayer-logger" strategy="beforeInteractive">
          {DATALAYER_LOGGER}
        </Script>
        <Script id="gtm-container" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
