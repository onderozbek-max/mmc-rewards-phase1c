/**
 * 1C completion feedback — the core "how did this activity move me?" moment.
 * Deliberately restrained: no confetti, no exclamation-point copy, no
 * milestone-celebration treatment (that belongs to 1D). It states the causal
 * delta, then the resulting truthful state, in that order.
 *
 * Three distinct render states, driven only by truthful before/after
 * milestone facts — never a one-time celebration flag:
 *   1. Still below 250 (`newNextMilestone !== null`) — progress bar + points
 *      remaining.
 *   2. This completion is the one that just crossed 250
 *      (`previousNextMilestone !== null && newNextMilestone === null`) — the
 *      benefit-unlocked statement is truthfully caused by THIS completion,
 *      so it's shown once, here.
 *   3. Ordinary earning after 250 was already achieved *before* this
 *      completion started (`previousNextMilestone === null`) — the member
 *      did not just unlock anything, so the unlocked statement is
 *      deliberately NOT repeated (that would misrepresent this completion as
 *      the cause). Feedback stays to activity complete + points earned +
 *      resulting lifetime total, exactly like case 1 minus the progress bar
 *      (there is no active goal left to show progress toward).
 * This still has no special "milestone ceremony" case — case 2 is truthful
 * state, not celebration — that richer treatment belongs to 1D.
 */

import * as React from 'react';
import { InlineBottomSheet } from './InlineBottomSheet';
import { Button } from '../Button';
import { Body, Caption, Heading } from '../Text';
import { ProgressIndicator } from '../ProgressIndicator';
import { VisuallyHidden } from '../VisuallyHidden';
import { prevMilestone, nextMilestone } from '../../state/memberState';
import type { CompletionResult } from '../../state/memberState';
import { OPERATIONAL_BENEFIT_UNLOCKED_MESSAGE } from '../../state/benefits';

export interface CompletionFeedbackSheetProps {
  result: CompletionResult | null;
  onClose: () => void;
}

export function CompletionFeedbackSheet({ result, onClose }: CompletionFeedbackSheetProps) {
  if (!result) return null;

  // Non-points activity: a plain acknowledgement, no points/progress language
  // at all (§17) — this is NOT a smaller version of the points feedback, it's
  // a structurally different message.
  if (!result.pointsEligible) {
    return (
      <InlineBottomSheet
        isOpen
        onClose={onClose}
        title="Thanks for the feedback"
        actions={
          <Button variant="primary" isFullWidth onClick={onClose}>
            Done
          </Button>
        }
      >
        <Body as="p">Your response has been recorded.</Body>
      </InlineBottomSheet>
    );
  }

  const prev = prevMilestone(result.newTotal);
  const next = nextMilestone(result.newTotal);
  // True only for the one completion that actually caused the crossing —
  // not for any later completion once the member is already past 250.
  const justCrossed = result.previousNextMilestone !== null && next === null;

  return (
    <InlineBottomSheet
      isOpen
      onClose={onClose}
      title="Activity complete"
      actions={
        <Button variant="primary" isFullWidth onClick={onClose}>
          Done
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Heading as="h3" size="large" color="positiveBold">
          +{result.pointsEarned} points
        </Heading>

        <Body as="p">{result.newTotal} lifetime points</Body>

        {next !== null ? (
          <div>
            <VisuallyHidden id="completion-progress-heading">
              Progress toward your next benefit
            </VisuallyHidden>
            <ProgressIndicator
              a11yLabelledBy="completion-progress-heading"
              min={prev}
              max={next}
              value={result.newTotal}
              valueLabel={`${result.newTotal - prev} of ${next - prev} points toward the next benefit`}
              variant="info"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Caption color="subtle">{prev}</Caption>
              <Caption color="subtle">{next}</Caption>
            </div>
            <Body as="p" UNSAFE_style={{ marginTop: 8 }}>
              {result.newRemaining} points until your next benefit
            </Body>
          </div>
        ) : justCrossed ? (
          <Body as="p">{OPERATIONAL_BENEFIT_UNLOCKED_MESSAGE}</Body>
        ) : null}
      </div>
    </InlineBottomSheet>
  );
}
