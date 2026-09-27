/**
 * Activity catalog — Phase 1C
 * ---------------------------------------------------------------------------
 * Static definitions for activities a member can currently participate in.
 * This is DATA, not per-member state. Whether a given activity has been
 * completed by the member is derived from the completion ledger in
 * `memberState.ts` (single source of truth) — never stored here.
 *
 * All three catalog activities are points-eligible and, by default, all three
 * are still available (the seed history in `memberState.ts` never completes
 * them). Their point values (30 + 20 + 30 = 80) are chosen deliberately: from
 * the 180-point default starting balance, completing all three in the normal
 * Home flow naturally crosses the 250-point benefit threshold (180 → 210 →
 * 230 → 260) without any prototype/developer control. Do not change these
 * point values independently of that demonstration journey.
 *
 * The non-points-eligible acknowledgement pattern in CompletionFeedbackSheet
 * (§17) remains fully supported for any future activity with
 * `pointsEligible: false` — none currently exists in this catalog.
 *
 * This is the CANONICAL stakeholder catalog — exactly the three activities
 * the default/reset journey depends on (30 + 20 + 30 = 80, crossing 250 from
 * a 180 start). Do not add a fourth activity here to test post-250 ordinary
 * earning; that would change the default stakeholder journey's activity
 * supply. Use `QA_ONLY_ACTIVITIES` below instead, which is never part of the
 * normal member-facing catalog.
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
    points: 20,
    pointsEligible: true,
    endsAt: 'October 15, 2026',
    icon: 'Star',
  },
  {
    id: 'act-quick-reaction',
    title: "How was today's visit?",
    description: "Share quick feedback about today's visit.",
    points: 30,
    pointsEligible: true,
    endsAt: 'October 31, 2026',
    icon: 'Check',
  },
];

/**
 * Prototype/QA-only activity — never rendered in the normal stakeholder
 * journey and never included in `ACTIVITIES`. It exists solely so a
 * developer/QA scenario can exercise ordinary earning feedback *after* the
 * 250 benefit has already been unlocked (e.g. 260 → +10 → 270), without
 * adding a fourth activity to the canonical 180→210→230→260 demo journey.
 * `HomePage` only renders this when the member state's
 * `qaPostMilestoneActive` flag is set, which only a prototype-only QA
 * scenario (`resetToScenario('post-milestone-qa-260')`) ever sets to true.
 */
export const QA_ONLY_ACTIVITIES: ActivityDef[] = [
  {
    id: 'qa-post-milestone-bonus',
    title: 'QA: post-milestone bonus activity',
    description:
      'Prototype-only activity for verifying ordinary earning feedback after the 250 benefit is already unlocked. Not part of the member-facing catalog.',
    points: 10,
    pointsEligible: true,
    icon: 'Star',
  },
];

export function getActivity(id: string): ActivityDef | undefined {
  return ACTIVITIES.find((a) => a.id === id) ?? QA_ONLY_ACTIVITIES.find((a) => a.id === id);
}
