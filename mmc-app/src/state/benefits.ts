/**
 * Benefit copy, keyed by milestone value. Single source so Home, Community
 * Pass, and the completion sheet never drift on what a milestone actually
 * unlocks (§29 — after a milestone crossing, every surface must describe the
 * SAME resulting state, not stale/contradictory copy).
 *
 * Only 250 is operational in this prototype: it is the only milestone with a
 * real, fulfilled benefit (What's New + Member Favorites). 1,000 and 3,000
 * remain broader/future journey markers — shown in the Community Pass
 * benefit journey for context, but never operationalized, never an active
 * progress target, and never implying functionality that doesn't exist yet
 * (that belongs to a later initiative, not this prototype).
 */

export interface BenefitCopy {
  title: string;
  description: string;
}

export const BENEFIT_COPY: Record<number, BenefitCopy> = {
  250: {
    title: "What's New + Member Favorites",
    description: "Unlock What's New + Member Favorites",
  },
  1000: {
    title: 'A future Community milestone',
    description: 'A future Community milestone — not yet available in this experience.',
  },
  3000: {
    title: 'A future Community milestone',
    description: 'A future Community milestone — not yet available in this experience.',
  },
};

/** The individually-named benefits fulfilled at a given milestone. Only 250
 *  has named, operational benefits right now. */
export const MILESTONE_BENEFITS: Record<number, string[]> = {
  250: ["What's New", 'Member Favorites'],
};

/** Shown once the member has no further active operational goal (i.e. the
 *  250 milestone is already reached) — replaces progress/remaining language
 *  with a truthful statement of what's already unlocked. Used consistently
 *  any time this state applies, not just at the moment of crossing, so nothing
 *  reads as a one-time celebration (§8, §14). */
export const OPERATIONAL_BENEFIT_UNLOCKED_MESSAGE =
  "You've unlocked What's New + Member Favorites.";
