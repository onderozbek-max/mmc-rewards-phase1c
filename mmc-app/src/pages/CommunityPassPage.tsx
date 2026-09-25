import * as React from 'react';
import { Page } from '../components/Page';
import { Heading, Body, Caption, Display } from '../components/Text';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { IconButton } from '../components/IconButton';
import { Icon } from '../components/Icons';
import { ProgressToNextBenefit } from '../components/custom/ProgressToNextBenefit';
import { navigate } from '../router/hashRouter';
import {
  useMemberState,
  lifetimePoints,
  nextMilestone,
  allMilestones,
} from '../state/memberState';
import { BENEFIT_COPY } from '../state/benefits';

export function CommunityPassPage() {
  const state = useMemberState();
  const points = lifetimePoints(state);
  const next = nextMilestone(points);

  return (
    <Page title="Community Pass" titleVisuallyHidden>
      <div className="mmc-topbar">
        <IconButton
          a11yLabel="Back"
          variant="ghost"
          onClick={() => navigate('/')}
        >
          <Icon name="ChevronLeft" decorative />
        </IconButton>
        <Heading as="h2" size="medium">
          Community Pass
        </Heading>
        <span style={{ width: 32 }} />
      </div>

      <div className="mmc-screen">
        {/* Large editorial restatement of the page title — visual only, not a
            second semantic heading (the topbar h2 above already carries it). */}
        <Display as="div" size="small">
          Community Pass
        </Display>
        <Body as="p" UNSAFE_style={{ marginTop: 8 }}>
          Take part in Community activities and earn points. Your lifetime points move you
          toward benefit milestones.
        </Body>

        <div className="mmc-panel" style={{ marginTop: 20 }}>
          <Heading as="h3" size="large" id="cp-points-heading">
            {points}
          </Heading>
          <Caption color="subtle">lifetime points</Caption>

          <div style={{ marginTop: 12 }}>
            <ProgressToNextBenefit points={points} a11yLabelledBy="cp-points-heading" />
          </div>

          {next !== null && (
            <Body as="p" weight="alt" UNSAFE_style={{ marginTop: 16 }}>
              Next benefit: {BENEFIT_COPY[next]?.title}
            </Body>
          )}

          <Button
            variant="primary"
            isFullWidth
            UNSAFE_style={{ marginTop: 16 }}
            onClick={() => navigate('/')}
          >
            Explore activities
          </Button>
        </div>

        <Heading as="h2" size="medium" UNSAFE_style={{ margin: '24px 0 4px' }}>
          Your benefit journey
        </Heading>
        <Body as="p">As your lifetime points grow, more benefits become available. Points never reset.</Body>

        <ol className="mmc-journey">
          {allMilestones().map((milestone) => {
            const unlocked = points >= milestone;
            const isNext = milestone === next;
            return (
              <li key={milestone} className="mmc-journey__item">
                <span
                  className={`mmc-journey__dot ${unlocked ? 'mmc-journey__dot--unlocked' : ''}`}
                  aria-hidden="true"
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Heading as="h3" size="small">
                      {milestone.toLocaleString()} points
                    </Heading>
                    {isNext && (
                      <Tag color="blue" size="small">
                        Next benefit
                      </Tag>
                    )}
                    {unlocked && (
                      <Tag color="green" size="small" leading={<Icon name="CheckCircle" decorative />}>
                        Unlocked
                      </Tag>
                    )}
                  </div>
                  <Body as="p">{BENEFIT_COPY[milestone]?.description}</Body>
                </div>
              </li>
            );
          })}
        </ol>

        <Heading as="h2" size="medium" UNSAFE_style={{ margin: '24px 0 4px' }}>
          How points are earned
        </Heading>
        <Body as="p">
          Eligible Community activities show how many points you can earn before you start. Not
          every activity is points-eligible.
        </Body>
      </div>
    </Page>
  );
}
