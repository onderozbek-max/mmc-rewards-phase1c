import * as React from 'react';
import { useInitializeTheming } from './utils/Theming';
import { A11yAnnouncementProvider } from './components/A11yAnnouncement';
import { A11yDevAssertions } from './components/A11yDevAssertions';
import { AppShell } from './components/custom/AppShell';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityPassPage } from './pages/CommunityPassPage';
import { ActivityPage } from './pages/ActivityPage';
import { useRoute } from './router/hashRouter';
import { initMemberState } from './state/memberState';
import './styles/mmc.css';

export default function App() {
  // Community Pass is a Sam's Club private-label experience.
  useInitializeTheming("Member's Mark", ["Member's Mark"] as const);

  // Hydrate the member-state ledger from localStorage once, before the first
  // route renders, so Home/Profile/Community Pass all read consistent state
  // from their very first paint (§4 persistence, §27 single source of truth).
  initMemberState();

  const route = useRoute();

  let page: React.ReactNode;
  switch (route.name) {
    case 'profile':
      page = <ProfilePage />;
      break;
    case 'community-pass':
      page = <CommunityPassPage />;
      break;
    case 'activity':
      page = <ActivityPage activityId={route.activityId} />;
      break;
    case 'home':
    default:
      page = <HomePage />;
      break;
  }

  return (
    <A11yAnnouncementProvider>
      <A11yDevAssertions />
      <AppShell>{page}</AppShell>
    </A11yAnnouncementProvider>
  );
}
