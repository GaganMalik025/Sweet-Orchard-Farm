"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  istMinutes,
  istTimeLabel,
  viewerMatchesIST,
  viewerTimeLabel,
  viewerTimeZone,
} from "@/lib/ist";
import { isCallingHours, windowFor, railProgress } from "@/lib/schedule";

export interface ClockState {
  /** False until after hydration — the server has no business guessing the time. */
  ready: boolean;
  minutes: number;
  istLabel: string;
  status: string;
  anchor: string;
  active: boolean;
  calling: boolean;
  progress: number;
  /** Null when the visitor is already on IST. */
  viewerLabel: string | null;
  viewerZone: string | null;
}

const INITIAL: ClockState = {
  ready: false,
  minutes: 0,
  istLabel: "",
  status: "Farm time — loading",
  anchor: "breakfast",
  active: false,
  calling: true,
  progress: 0,
  viewerLabel: null,
  viewerZone: null,
};

function read(): ClockState {
  const now = new Date();
  const minutes = istMinutes(now);
  const w = windowFor(minutes);
  const away = !viewerMatchesIST(now);
  return {
    ready: true,
    minutes,
    istLabel: istTimeLabel(now),
    status: w.status,
    anchor: w.anchor,
    active: w.active,
    calling: isCallingHours(minutes),
    progress: railProgress(minutes),
    viewerLabel: away ? viewerTimeLabel(now) : null,
    viewerZone: away ? viewerTimeZone() : null,
  };
}

const ClockContext = createContext<ClockState>(INITIAL);

export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ClockState>(INITIAL);

  useEffect(() => {
    setState(read());
    const id = window.setInterval(() => setState(read()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <ClockContext.Provider value={state}>{children}</ClockContext.Provider>;
}

export const useClock = () => useContext(ClockContext);
