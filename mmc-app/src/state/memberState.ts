/**
 * MEMBER STATE — single source of truth (Phase 1C, §27)
 * ---------------------------------------------------------------------------
 * Everything Community Pass shows anywhere in the app (Home, Community Pass,
 * Profile) is DERIVED from one ledger of completion records. Nothing computes
 * or stores "lifetimePoints" as an independent field — it is always
 * `sum(completions[].points)`. This is what makes "no competing point
 * totals" (§3) true by construction instead of by discipline.
 *
 * Persistence uses the scaffold's generic reactive key-value store
 * (`utils/store.ts` — `setStoreValue(..., {persist:true})` / `hydrateStoreValue`)
 * which already wraps localStorage with pub/sub notifications, so every
 * subscribed component re-renders the instant the ledger changes.
 */

import { getStoreValue, hydrateStoreValue, setStoreValue, useStore } from '../utils/store';
import { ACTIVITIES, getActivity } from './activities';

// ── Types ────────────────────────────────────────────────────────────────

export type CompletionStatus = 'completed' | 'pending' | 'failed';

export interface CompletionRecord {
  /** Unique id for this completion event (distinct from activityId — an
   *  activity could in principle recur, though Phase 1 catalog activities
   *  are one-time). */
  id: string;
  /** References an ACTIVITIES id for catalog activities, or null for
   *  historical/seed entries that predate the current catalog. */
  activityId: string | null;
  /** Snapshot of the title at completion time — history must not change
   *  retroactively if catalog copy changes later. */
  title: string;
  points: number;
  completedAt: string; // ISO date
  status: CompletionStatus;
}

export interface MemberState {
  memberName: string;
  memberSinceLabel: string;
  completions: CompletionRecord[];
}

const STORE_KEY = 'mmc:phase1c:memberState';

/**
 * Only 250 is operational in this prototype: it is the sole milestone with a
 * fulfilled benefit (What's New + Member Favorites), so it is the only value
 * that drives an active progress bar, "points remaining" language, or 1C
 * completion feedback. 1,000 and 3,000 are broader/future journey markers —
 * displayed for context in the Community Pass benefit journey, but never an
 * active goal (that operationalization is a later initiative, §23).
 */
const OPERATIONAL_MILESTONE = 250;

/** All milestones shown in the Community Pass "benefit journey" list. */
const JOURNEY_MILESTONES = [250, 1000, 3000] as const;

// ── Seed data (representative prototype states, §32) ───────────────────────

/** Scenario A/B baseline — 180 lifetime points, 10 historical completions. */
function seedBaseline180(): CompletionRecord[] {
  return [
    { id: 'seed-1', activityId: null, title: 'Complete your profile', points: 10, completedAt: '2026-06-01', status: 'completed' },
    { id: 'seed-2', activityId: null, title: 'Welcome aboard!', points: 10, completedAt: '2026-06-05', status: 'completed' },
    { id: 'seed-3', activityId: null, title: 'Shared feedback on new products', points: 20, completedAt: '2026-06-12', status: 'completed' },
    { id: 'seed-4', activityId: null, title: 'Tell us what you think', points: 10, completedAt: '2026-06-20', status: 'completed' },
    { id: 'seed-5', activityId: null, title: 'Share your pantry favorites', points: 30, completedAt: '2026-07-03', status: 'completed' },
    { id: 'seed-6', activityId: null, title: 'Rate your last shopping trip', points: 15, completedAt: '2026-07-18', status: 'completed' },
    { id: 'seed-7', activityId: null, title: 'Product testing feedback: snacks', points: 25, completedAt: '2026-08-02', status: 'completed' },
    { id: 'seed-8', activityId: null, title: 'Community check-in: summer edition', points: 20, completedAt: '2026-08-21', status: 'completed' },
    { id: 'seed-9', activityId: null, title: "Help shape our next Member's Mark launch", points: 30, completedAt: '2026-09-06', status: 'completed' },
    { id: 'seed-10', activityId: null, title: 'Quick poll: weekend shopping habits', points: 10, completedAt: '2026-09-19', status: 'completed' },
  ];
}

/** Scenario C — 240 lifetime points, one activity short of the 250 threshold. */
function seedNearMilestone240(): CompletionRecord[] {
  return [
    ...seedBaseline180(),
    { id: 'seed-11', activityId: null, title: 'Early access engagement bonus', points: 60, completedAt: '2026-09-22', status: 'completed' },
  ];
}

/** Scenario D — 270 lifetime points: past the 250 threshold already. All
 *  three catalog activities remain available (this seed never completes
 *  them), so completing any one demonstrates ordinary post-benefit earning
 *  without replaying any milestone-crossing event. */
function seedPost250_270(): CompletionRecord[] {
  return [
    ...seedNearMilestone240(),
    { id: 'seed-12', activityId: null, title: 'Helped test a new community feature', points: 30, completedAt: '2026-09-24', status: 'completed' },
  ];
}

function defaultMemberState(): MemberState {
  return {
    memberName: 'Onder',
    memberSinceLabel: 'June 2026',
    completions: seedBaseline180(),
  };
}

// ── Load / persist ───────────────────────────────────────────────────────
//
// hydrateStoreValue() reads localStorage synchronously; it must only run
// once (it unconditionally overwrites the in-memory store), so we gate it
// behind a module-level flag rather than re-reading on every call.

let _hydrated = false;

function ensureHydrated(): MemberState {
  if (!_hydrated) {
    hydrateStoreValue<MemberState>(STORE_KEY, defaultMemberState());
    _hydrated = true;
  }
  return getStoreValue<MemberState>(STORE_KEY)!;
}

/** Call once at app startup so the very first render already has real state. */
export function initMemberState(): void {
  ensureHydrated();
}

function saveMemberState(next: MemberState): void {
  setStoreValue(STORE_KEY, next, { persist: true });
}

export function useMemberState(): MemberState {
  return useStore<MemberState>(STORE_KEY, ensureHydrated());
}

// ── Derived selectors (pure — never hand-duplicate these numbers) ─────────

export function lifetimePoints(state: MemberState): number {
  return state.completions
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + c.points, 0);
}

/**
 * Start of the current progress range: 0 before the operational milestone,
 * or the operational milestone itself once reached (there is no active
 * range beyond it — 1,000/3,000 are not operationalized, §23).
 */
export function prevMilestone(points: number): number {
  return points >= OPERATIONAL_MILESTONE ? OPERATIONAL_MILESTONE : 0;
}

/**
 * The active operational goal, or null once it's been reached — null means
 * "no active progress goal right now," not "every future milestone is also
 * done." Only 250 is ever returned here by design.
 */
export function nextMilestone(points: number): number | null {
  return points >= OPERATIONAL_MILESTONE ? null : OPERATIONAL_MILESTONE;
}

export function pointsRemaining(points: number): number {
  return points >= OPERATIONAL_MILESTONE ? 0 : OPERATIONAL_MILESTONE - points;
}

/** Journey milestones the member has reached — in this prototype that will
 *  only ever practically be 250, since 1,000/3,000 aren't operationalized. */
export function unlockedMilestones(points: number): number[] {
  return JOURNEY_MILESTONES.filter((m) => points >= m);
}

/** Full benefit-journey list for display (Community Pass), including the
 *  non-operational future markers. */
export function allMilestones(): readonly number[] {
  return JOURNEY_MILESTONES;
}

export function isActivityCompleted(state: MemberState, activityId: string): boolean {
  return state.completions.some((c) => c.activityId === activityId && c.status === 'completed');
}

export function findCompletionForActivity(
  state: MemberState,
  activityId: string,
): CompletionRecord | undefined {
  return state.completions.find((c) => c.activityId === activityId && c.status === 'completed');
}

// ── Result of a completion attempt — feeds the 1C feedback moment ─────────

export interface CompletionResult {
  activityId: string;
  title: string;
  pointsEarned: number;
  pointsEligible: boolean;
  alreadyCompleted: boolean;
  previousTotal: number;
  newTotal: number;
  previousNextMilestone: number | null;
  newNextMilestone: number | null;
  previousRemaining: number;
  newRemaining: number;
  crossedMilestoneValues: number[];
}

/**
 * Successful-completion state transition (§38):
 * validate → check eligibility → guard duplicate → award points →
 * recompute milestone state → persist → return a result the UI renders.
 *
 * Never called for a member who cancelled/exited before completion (§24) —
 * callers only invoke this after the simulated activity reports success.
 */
export function completeActivity(activityId: string): CompletionResult {
  const state = ensureHydrated();
  const activity = getActivity(activityId);
  if (!activity) {
    throw new Error(`Unknown activity id: ${activityId}`);
  }

  const previousTotal = lifetimePoints(state);
  const previousNext = nextMilestone(previousTotal);
  const previousRemaining = pointsRemaining(previousTotal);
  const previousUnlocked = unlockedMilestones(previousTotal);

  // Duplicate-completion guard (§16, §25): a completed activity cannot be
  // completed again for additional points.
  if (isActivityCompleted(state, activityId)) {
    return {
      activityId,
      title: activity.title,
      pointsEarned: 0,
      pointsEligible: activity.pointsEligible,
      alreadyCompleted: true,
      previousTotal,
      newTotal: previousTotal,
      previousNextMilestone: previousNext,
      newNextMilestone: previousNext,
      previousRemaining,
      newRemaining: previousRemaining,
      crossedMilestoneValues: [],
    };
  }

  const awardedPoints = activity.pointsEligible ? activity.points : 0;

  const record: CompletionRecord = {
    id: `${activityId}-${Date.now()}`,
    activityId,
    title: activity.title,
    points: awardedPoints,
    completedAt: new Date().toISOString(),
    status: 'completed',
  };

  const nextState: MemberState = {
    ...state,
    completions: [...state.completions, record],
  };
  saveMemberState(nextState);

  const newTotal = lifetimePoints(nextState);
  const newNext = nextMilestone(newTotal);
  const newRemaining = pointsRemaining(newTotal);
  const newUnlocked = unlockedMilestones(newTotal);
  const crossedMilestoneValues = newUnlocked.filter((m) => !previousUnlocked.includes(m));

  return {
    activityId,
    title: activity.title,
    pointsEarned: awardedPoints,
    pointsEligible: activity.pointsEligible,
    alreadyCompleted: false,
    previousTotal,
    newTotal,
    previousNextMilestone: previousNext,
    newNextMilestone: newNext,
    previousRemaining,
    newRemaining,
    crossedMilestoneValues,
  };
}

// ── Prototype-only controls (§5, §31, §32) — never exposed in member UI ──

export type ScenarioKey = 'baseline-180' | 'near-milestone-240' | 'post-250-270';

export function resetToScenario(scenario: ScenarioKey): void {
  const completions =
    scenario === 'near-milestone-240'
      ? seedNearMilestone240()
      : scenario === 'post-250-270'
        ? seedPost250_270()
        : seedBaseline180();
  saveMemberState({
    memberName: 'Onder',
    memberSinceLabel: 'June 2026',
    completions,
  });
}

export const ALL_ACTIVITIES = ACTIVITIES;
