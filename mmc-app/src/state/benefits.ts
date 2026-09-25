/**
 * Locked 1A benefit copy, keyed by milestone value. Single source so Home
 * and Community Pass never drift on what the "next benefit" actually says
 * (§29 — after a milestone crossing, Home must describe the NEW next
 * benefit, not stale copy for one already unlocked).
 */

export interface BenefitCopy {
  title: string;
  description: string;
}

export const BENEFIT_COPY: Record<number, BenefitCopy> = {
  250: {
    title: "Early access to select Member's Mark opportunities",
    description: "Early access to select Member's Mark opportunities",
  },
  1000: {
    title: 'Additional Community benefits',
    description: 'Additional Community benefits',
  },
  3000: {
    title: 'More Community benefits',
    description: 'More Community benefits',
  },
};
