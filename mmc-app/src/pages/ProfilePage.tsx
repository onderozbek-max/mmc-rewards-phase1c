import * as React from 'react';
import { Page } from '../components/Page';
import { Heading, Body, Caption } from '../components/Text';
import { IconButton } from '../components/IconButton';
import { Icon } from '../components/Icons';
import { Divider } from '../components/Divider';
import { BottomNav } from '../components/custom/BottomNav';
import { navigate } from '../router/hashRouter';
import { useMemberState, lifetimePoints } from '../state/memberState';

function formatDate(iso: string): string {
  // Seed completions store a bare `YYYY-MM-DD` date, which `Date.parse`
  // treats as UTC midnight. Formatting in the viewer's local timezone would
  // shift that back a calendar day west of UTC — force UTC on the way out so
  // the displayed date always matches the date that was recorded.
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function ProfilePage() {
  const state = useMemberState();
  const points = lifetimePoints(state);
  const completed = [...state.completions]
    .filter((c) => c.status === 'completed')
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <Page title="Profile" titleVisuallyHidden>
      <div className="mmc-topbar">
        <IconButton a11yLabel="Back" variant="ghost" onClick={() => navigate('/')}>
          <Icon name="ChevronLeft" decorative />
        </IconButton>
        <Heading as="h2" size="medium">
          Profile
        </Heading>
        <span style={{ width: 32 }} />
      </div>

      <div className="mmc-screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mmc-avatar" aria-hidden="true">
            <Icon name="User" decorative />
          </span>
          <div>
            <Heading as="h2" size="large">
              {state.memberName}
            </Heading>
            <Caption color="subtle">In the community since {state.memberSinceLabel}</Caption>
          </div>
        </div>

        <div className="mmc-stat-row">
          <Body as="span">Lifetime points</Body>
          <Body as="span" weight="alt">
            {points}
          </Body>
        </div>
        <Divider />
        <button type="button" className="mmc-link-row" onClick={() => navigate('/community-pass')}>
          <Body as="span">Community Pass</Body>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ld-semantic-color-text-info, #0053e2)' }}>
            <Body as="span" color="info">
              View
            </Body>
            <Icon name="ChevronRight" decorative />
          </span>
        </button>

        <Heading as="h2" size="medium" UNSAFE_style={{ margin: '24px 0 4px' }}>
          Completed Activities ({completed.length})
        </Heading>

        <ul className="mmc-history-list">
          {completed.map((c) => (
            <li key={c.id} className="mmc-history-list__item">
              <div>
                <Body as="p" weight="alt">
                  {c.title}
                </Body>
                <Caption color="subtle">{formatDate(c.completedAt)}</Caption>
              </div>
              {c.points > 0 ? (
                <Body as="span" weight="alt" color="positiveBold">
                  +{c.points} pts
                </Body>
              ) : (
                <Caption color="subtle">No points</Caption>
              )}
            </li>
          ))}
        </ul>
      </div>

      <BottomNav active="profile" />
    </Page>
  );
}
