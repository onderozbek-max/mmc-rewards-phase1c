/**
 * "Ways to make progress" card — locked 1B visual pattern, extended in 1C so
 * the Start CTA is replaced with a Completed tag once the ledger shows this
 * activity done (§13, §16). Non-points activities never claim points language
 * (§17) — no "Earn X points" copy, no progress framing.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardActions } from '../Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { Body, Caption } from '../Text';
import { Icon } from '../Icons';
import type { ActivityDef } from '../../state/activities';

export interface ActivityCardProps {
  activity: ActivityDef;
  isCompleted: boolean;
  onStart: (activityId: string) => void;
}

export function ActivityCard({ activity, isCompleted, onStart }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader
        title={activity.title}
        headingLevel="h3"
        trailing={<Icon name={activity.icon} decorative size="large" />}
      />
      <CardContent>
        <Body as="p">{activity.description}</Body>
        <Caption color="subtle" as="p" UNSAFE_style={{ marginTop: 8 }}>
          {activity.pointsEligible ? `${activity.points} points` : 'No points for this one'}
          {activity.endsAt ? ` • Ends ${activity.endsAt}` : ''}
        </Caption>
      </CardContent>
      <CardActions>
        {isCompleted ? (
          <Tag color="green" variant="secondary" leading={<Icon name="CheckCircle" decorative />}>
            Completed
          </Tag>
        ) : (
          <Button variant="primary" onClick={() => onStart(activity.id)}>
            Start
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
