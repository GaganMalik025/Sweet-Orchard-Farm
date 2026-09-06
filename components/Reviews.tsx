"use client";

import { useEffect, useState } from "react";
import type { ReviewsPayload, NormalisedReview } from "@/app/api/reviews/route";
import { MAPS_URL } from "@/lib/constants";

type State =
  | { phase: "loading" }
  | { phase: "ready"; data: ReviewsPayload }
  | { phase: "failed" };

/**
 * Real Google reviews, or nothing. If the API is unreachable this section
 * degrades to a link to the Maps listing — never to invented content.
 */
export function Reviews() {
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    let live = true;
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: ReviewsPayload) => {
        if (!live) return;
        setState(
          data.ok && data.reviews.length ? { phase: "ready", data } : { phase: "failed" },
        );
      })
      .catch(() => live && setState({ phase: "failed" }));
    return () => {
      live = false;
    };
  }, []);

  if (state.phase === "loading") {
    return (
      <div className="grid gap-5 md:grid-cols-3" aria-busy="true" aria-live="polite">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-sm border border-current/12 bg-current/5"
          />
        ))}
        <span className="sr-only">Loading guest reviews from Google</span>
      </div>
    );
  }

  if (state.phase === "failed") {
    return (
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-md rounded-sm border border-current/20 p-6 transition-colors hover:bg-current/5"
      >
        <p className="text-[17px] font-medium">
          Read what guests have said on Google →
        </p>
        <p className="mt-1 text-[14px] opacity-60">
          Opens our listing in Google Maps.
        </p>
      </a>
    );
  }

  const { data } = state;

  return (
    <div>
      {data.rating !== null && (
        <p className="mb-6 flex flex-wrap items-baseline gap-3">
          <Stars value={data.rating} />
          <span className="tnum text-[17px] font-semibold">
            {data.rating.toFixed(1)}
          </span>
          {data.count !== null && (
            <span className="tnum text-[14px] opacity-60">
              from {data.count} Google review{data.count === 1 ? "" : "s"}
            </span>
          )}
        </p>
      )}

      <ul className="grid gap-5 md:grid-cols-3">
        {data.reviews.slice(0, 3).map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} review={r} />
        ))}
      </ul>

      <p className="mt-6 text-[14px]">
        <a
          href={data.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-current/40 underline-offset-4 opacity-75 hover:opacity-100"
        >
          All reviews on Google →
        </a>
      </p>
    </div>
  );
}

function ReviewCard({ review }: { review: NormalisedReview }) {
  return (
    <li className="flex flex-col rounded-sm border border-current/15 p-5">
      <Stars value={review.rating} />
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">
        <p className="line-clamp-6">{review.text}</p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5 border-t border-current/12 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {review.authorPhoto && (
          <img
            src={review.authorPhoto}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            className="h-7 w-7 rounded-full object-cover"
          />
        )}
        <span className="min-w-0 text-[13px]">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline decoration-current/30 underline-offset-2"
            >
              {review.author}
            </a>
          ) : (
            <span className="font-medium">{review.author}</span>
          )}
          {review.relativeTime && (
            <span className="ml-1.5 opacity-55">{review.relativeTime}</span>
          )}
        </span>
      </figcaption>
    </li>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span
      className="text-[14px] tracking-[0.18em] text-terracotta"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      <span aria-hidden>
        {"★".repeat(full)}
        <span className="opacity-25">{"★".repeat(Math.max(0, 5 - full))}</span>
      </span>
    </span>
  );
}
