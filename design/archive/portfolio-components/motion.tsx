"use client";

import { useEffect } from "react";
import { initializePortfolio } from "@/lib/portfolio-runtime";

/** Content renders on the server; motion progressively enhances it after hydration. */
export function PortfolioMotion() {
  useEffect(() => initializePortfolio(), []);
  return null;
}
