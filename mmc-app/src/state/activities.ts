/**
 * Activity catalog — Phase 1C
 * ---------------------------------------------------------------------------
 * Static definitions for activities a member can currently participate in.
 * This is DATA, not per-member state. Whether a given activity has been
 * completed by the member is derived from the completion ledger in
 * `memberState.ts` (single source of truth) — never stored here.
 *
 * Includes at least one non-points-eligible activity (§17) so the product can
 * demonstrate that not every participation event changes Community Pass
 * progress.
 */

export interface ActivityDef {
  id: string;
  title: string;
  description: string;
  /** Points awarded on successful completion. 0 for non-points activities. */
  points: number;
  /** Whether completing this activity is points-eligible at all. */
  pointsEligible: boolean;
  /** Display-only end date string, matches locked 1A/1B copy style. */
  endsAt?: string;
  /** Icon name resolved via the theme's active icon font (sams-club set). */
  icon: string;
}

export const ACTIVITIES: ActivityDef[] = [
  {
    id: 'act-shape-products',
    title: "See how members help shape products",
    description: 'Follow feedback from idea to club.',
    points: 30,
    pointsEligible: true,
    endsAt: 'November 1, 2026',
    icon: 'Heart',
  },
  {
    id: 'act-tell-us-think',
    title: 'Tell us what you think',
    description: 'Share your take on products and experiences.',
    points: 10,
    pointsEligible: true,
    endsAt: 'October 15, 2026',
    icon: 'Star',
  },
  {
    id: 'act-quick-reaction',
    title: "How was today's visit?",
    description: "Give quick feedback — this one's just for us, no points attached.",
    points: 0,
    pointsEligible: false,
    icon: 'Check',
  },
];

export function getActivity(id: string): ActivityDef | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
