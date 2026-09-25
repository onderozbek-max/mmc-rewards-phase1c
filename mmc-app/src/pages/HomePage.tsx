import * as React from 'react';
import { Page } from '../components/Page';
import { Card, CardContent } from '../components/Card';
import { Heading, Body, Caption } from '../components/Text';
import { Icon } from '../components/Icons';
import { BottomNav } from '../components/custom/BottomNav';
import { ActivityCard } from '../components/custom/ActivityCard';
import { ProgressToNextBenefit } from '../components/custom/ProgressToNextBenefit';
import { CompletionFeedbackSheet } from '../components/custom/CompletionFeedbackSheet';
import { navigate } from '../router/hashRouter';
import {
  useMemberState,
  lifetimePoints,
  isActivityCompleted,
  nextMilestone,
  ALL_ACTIVITIES,
} from '../state/memberState';
import type { CompletionResult } from '../state/memberState';
import { BENEFIT_COPY } from '../state/benefits';
import { getLastUiEvent, setLastUiEvent } from '../utils/store';

const LAST_COMPLETION_TOPIC = 'mmc:phase1c:last-completion';

export function HomePage() {
  const state = useMemberState();
  const points = lifetimePoints(state);
  const completedCount = state.completions.filter((c) => c.status === 'completed').length;
  const next = nextMilestone(points);

  // A just-completed activity surfaces its 1C feedback sheet once, on return
  // to Home (§13). We read it from the shared event store rather than route
  // params so the ActivityPage → Home handoff stays decoupled, then
  // immediately consume the event so re-visiting Home later doesn't replay it.
  const [pendingResult, setPendingResult] = React.useState<CompletionResult | null>(null);
  React.useEffect(() => {
    const evt = getLastUiEvent<CompletionResult | null>(LAST_COMPLETION_TOPIC);
    if (evt?.payload) {
      setPendingResult(evt.payload);
      setLastUiEvent<CompletionResult | null>(LAST_COMPLETION_TOPIC, null);
    }
  }, []);

  return (
    <Page title="Home" titleVisuallyHidden>
      <Heading as="h2" size="large" UNSAFE_style={{ textAlign: 'center', display: 'block', padding: '16px 0' }}>
        Member's Mark Community
      </Heading>

      <div className="mmc-screen">
        <div className="mmc-welcome-card">
          <Card>
            <CardContent>
              <Heading as="h2" size="large" color="onFillInverse">
                Welcome, {state.memberName}
              </Heading>
              <Body as="p" color="onFillInverse">
                In the community since {state.memberSinceLabel}
              </Body>
              <button
                type="button"
                className="mmc-welcome-card__cta"
                onClick={() => navigate('/profile')}
              >
                <span>{completedCount} activities completed</span>
                <Icon name="ChevronRight" decorative />
              </button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <button
              type="button"
              className="mmc-link-row"
              onClick={() => navigate('/community-pass')}
              aria-label="Open Community Pass details"
            >
              <Caption color="brand" weight="alt">
                COMMUNITY PASS
              </Caption>
              <Icon name="ChevronRight" decorative />
            </button>
            <ProgressToNextBenefit points={points} a11yLabelledBy="cp-benefit-heading" />
            <Body as="p" id="cp-benefit-heading" weight="alt" UNSAFE_style={{ marginTop: 12 }}>
              {next !== null ? BENEFIT_COPY[next]?.description : "You've reached every current benefit milestone."}
            </Body>
            <Caption color="subtle">{points} lifetime points</Caption>
          </CardContent>
        </Card>

        <Heading as="h2" size="medium" UNSAFE_style={{ margin: '20px 0 4px' }}>
          Ways to make progress ({ALL_ACTIVITIES.length})
        </Heading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ALL_ACTIVITIES.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isCompleted={isActivityCompleted(state, activity.id)}
              onStart={(id) => navigate(`/activity/${id}`)}
            />
          ))}
        </div>
      </div>

      <BottomNav active="home" />

      <CompletionFeedbackSheet
        result={pendingResult}
        onClose={() => setPendingResult(null)}
      />
    </Page>
  );
}
