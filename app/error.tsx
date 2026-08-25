'use client';

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f4] px-6 text-center text-[#171513]">
      <div className="flex max-w-sm flex-col items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b4541f] font-[var(--font-barlow-condensed)] text-3xl font-bold text-white">
          !
        </div>
        <div>
          <h1 className="font-[var(--font-barlow-condensed)] text-4xl font-bold leading-none">
            We could not load that booking
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#746d64]">
            The movie or showtime may no longer be available. Try again or return to the showtimes.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#b4541f] px-5 py-4 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#ded8cd] px-5 py-4 text-sm text-[#5f5a52]"
          >
            Back to showtimes
          </Link>
        </div>
      </div>
    </main>
  );
}
