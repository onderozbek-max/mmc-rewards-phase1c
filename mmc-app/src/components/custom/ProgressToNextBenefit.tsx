/**
 * Shared "distance to next benefit" visualization — used on Home (locked 1B)
 * and Community Pass (locked 1A). Rendering logic lives in exactly one place
 * so both surfaces are guaranteed to agree (§3, §29).
 *
 * The progress bar range is `prevMilestone → nextMilestone`, derived fresh
 * from the current point total every render — NOT a hardcoded `0…250`. This
 * is what keeps the bar correct after a milestone crossing (§18): at 270
 * points the range becomes 250…1000, not 0…250.
 */

import * as React from 'react';
import { ProgressIndicator } from '../ProgressIndicator';
import { Body, Caption } from '../Text';
import { nextMilestone, prevMilestone, pointsRemaining } from '../../state/memberState';

export interface ProgressToNextBenefitProps {
  points: number;
  a11yLabelledBy: string;
}

export function ProgressToNextBenefit({ points, a11yLabelledBy }: ProgressToNextBenefitProps) {
  const prev = prevMilestone(points);
  const next = nextMilestone(points);
  const remaining = pointsRemaining(points);

  if (next === null) {
    return (
      <Body as="p" color="subtle">
        You've reached every current benefit milestone.
      </Body>
    );
  }

  return (
    <div>
      <ProgressIndicator
        a11yLabelledBy={a11yLabelledBy}
        min={prev}
        max={next}
        value={points}
        valueLabel={`${points - prev} of ${next - prev} points toward the next benefit`}
        variant="info"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Caption color="subtle">{prev}</Caption>
        <Caption color="subtle">{next}</Caption>
      </div>
      <Body as="p" UNSAFE_style={{ marginTop: 8 }}>
        {remaining} points to your next benefit
      </Body>
    </div>
  );
}
