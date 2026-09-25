/**
 * Simulated RedJade-style activity — a believable completion event, kept
 * intentionally simple (§7: "do not spend disproportionate effort redesigning
 * the survey"). Exiting via Back before submitting awards zero points (§24).
 */

import * as React from 'react';
import { Page } from '../components/Page';
import { Heading, Body } from '../components/Text';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { Icon } from '../components/Icons';
import { FormGroup } from '../components/FormGroup';
import { Radio } from '../components/Radio';
import { navigate } from '../router/hashRouter';
import { getActivity } from '../state/activities';
import { completeActivity, isActivityCompleted, useMemberState } from '../state/memberState';
import { setLastUiEvent } from '../utils/store';

const LAST_COMPLETION_TOPIC = 'mmc:phase1c:last-completion';

export interface ActivityPageProps {
  activityId: string;
}

export function ActivityPage({ activityId }: ActivityPageProps) {
  const activity = getActivity(activityId);
  const memberState = useMemberState();
  const alreadyDone = activity ? isActivityCompleted(memberState, activity.id) : false;
  const [answer, setAnswer] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState(false);

  // Defense in depth for §16/§25: the Home card already hides Start once an
  // activity is completed, but a stale link or manual hash edit could still
  // land here directly. Bounce home rather than re-running the survey for an
  // activity that can no longer earn points.
  React.useEffect(() => {
    if (alreadyDone) navigate('/');
  }, [alreadyDone]);

  if (!activity || alreadyDone) {
    return (
      <Page title="Activity not found">
        <Body as="p">This activity is no longer available.</Body>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Page>
    );
  }

  const handleExit = () => navigate('/');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Brief simulated processing delay — long enough to read as "submitted",
    // short enough not to feel like a real network round trip.
    window.setTimeout(() => {
      const result = completeActivity(activity.id);
      setLastUiEvent(LAST_COMPLETION_TOPIC, result);
      navigate('/');
    }, 500);
  };

  return (
    <Page title={activity.title} titleVisuallyHidden>
      <div className="mmc-topbar">
        <IconButton a11yLabel="Cancel and return home" variant="ghost" onClick={handleExit}>
          <Icon name="ChevronLeft" decorative />
        </IconButton>
        <Heading as="h2" size="medium">
          {activity.title}
        </Heading>
        <span style={{ width: 32 }} />
      </div>

      <form className="mmc-screen" onSubmit={handleSubmit}>
        <Body as="p">{activity.description}</Body>

        <FormGroup label="How likely are you to recommend Member's Mark to a friend?">
          {['Very likely', 'Somewhat likely', 'Not likely'].map((choice) => (
            <Radio
              key={choice}
              name="recommend"
              label={choice}
              value={choice}
              checked={answer === choice}
              onChange={() => setAnswer(choice)}
            />
          ))}
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={submitting}
          loadingLabel="Submitting your response"
          disabled={!answer || submitting}
          UNSAFE_style={{ marginTop: 24 }}
        >
          Submit
        </Button>
      </form>
    </Page>
  );
}
