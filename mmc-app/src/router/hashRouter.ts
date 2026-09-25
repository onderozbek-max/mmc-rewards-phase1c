/**
 * Minimal hash-based router.
 *
 * GitHub Pages serves this app from a sub-path (`/mmc-rewards-phase1c/`) with
 * no server-side rewrite rules, so any client-side route other than the root
 * 404s on a hard refresh or deep link under a history-based router. Hash
 * routing sidesteps that entirely — the fragment never reaches the server.
 *
 * Deliberately dependency-free: five routes don't need react-router.
 */

import * as React from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'profile' }
  | { name: 'community-pass' }
  | { name: 'activity'; activityId: string };

function parseHash(rawHash: string): Route {
  const path = rawHash.replace(/^#/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'home' };
  if (segments[0] === 'profile') return { name: 'profile' };
  if (segments[0] === 'community-pass') return { name: 'community-pass' };
  if (segments[0] === 'activity' && segments[1]) return { name: 'activity', activityId: segments[1] };
  return { name: 'home' };
}

export function navigate(path: string): void {
  window.location.hash = path;
}

export function useRoute(): Route {
  const [route, setRoute] = React.useState<Route>(() => parseHash(window.location.hash));

  React.useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
