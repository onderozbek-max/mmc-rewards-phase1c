/**
 * 1C completion feedback — the core "how did this activity move me?" moment
 * (§8–§12). Deliberately restrained: no confetti, no exclamation-point copy,
 * no milestone-celebration treatment (§9, §19 — that belongs to 1D). It
 * states the causal delta, then the resulting truthful state, in that order.
 */

import * as React from 'react';
import { InlineBottomSheet } from './InlineBottomSheet';
import { Button } from '../Button';
import { Body, Caption, Heading } from '../Text';
import { ProgressIndicator } from '../ProgressIndicator';
import { VisuallyHidden } from '../VisuallyHidden';
import { prevMilestone, nextMilestone } from '../../state/memberState';
import type { CompletionResult } from '../../state/memberState';

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

  const crossed250 = result.crossedMilestoneValues.includes(250);
  const prev = prevMilestone(result.newTotal);
  const next = nextMilestone(result.newTotal);

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

        {crossed250 && (
          <Body as="p">Your 250-point benefit is now available.</Body>
        )}

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
        ) : (
          <Body as="p">You've reached every current benefit milestone.</Body>
        )}
      </div>
    </InlineBottomSheet>
  );
}
