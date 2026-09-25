/**
 * Top-level responsive layout (§31, §36).
 *
 * Desktop: a fixed-width phone-simulation column (the actual MMC product)
 * centered with the stakeholder-review panel filling the unused space beside
 * it. Mobile viewport widths: the product content alone, full-bleed, with no
 * bezel decoration and no stakeholder shell — a clean simulation of a real
 * mobile web app.
 */

import * as React from 'react';
import { useIsDesktop } from './useIsDesktop';
import { StakeholderShell } from './StakeholderShell';

export function AppShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return <div className="mmc-app-mobile">{children}</div>;
  }

  return (
    <div className="mmc-app-desktop">
      <div className="mmc-phone-frame">
        <div className="mmc-phone-frame__screen">{children}</div>
      </div>
      <StakeholderShell />
    </div>
  );
}
