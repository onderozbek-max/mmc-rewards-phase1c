/**
 * A bottom-sheet-style dialog that stays inside the simulated device screen.
 *
 * LD's `BottomSheet` renders through `Overlay`, which portals straight to
 * `document.body` (see Overlay.tsx). That's correct for a real device, where
 * the browser viewport *is* the device — but in the desktop stakeholder shell
 * (§31) the "device" is a fixed-width `.mmc-phone-frame` sitting inside a much
 * wider browser viewport. A `document.body` portal breaks out of that frame
 * entirely: the scrim dims the whole desktop page (including the stakeholder
 * panel) and the sheet renders full browser width, not phone width — the
 * exact screen 1C exists to demonstrate. Since the portal target can't be
 * redirected (Overlay.tsx is generated/read-only), this renders inline in the
 * normal React tree instead, positioned `absolute` within the phone frame's
 * `position: relative` screen container on desktop, or `fixed` to the real
 * viewport on mobile (where there is no frame to escape).
 */

import * as React from 'react';
import { IconButton } from '../IconButton';
import { Icon } from '../Icons';
import { useIsDesktop } from './useIsDesktop';

export interface InlineBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function InlineBottomSheet({ isOpen, onClose, title, actions, children }: InlineBottomSheetProps) {
  const isDesktop = useIsDesktop();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!isOpen) return;
    headingRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modeSuffix = isDesktop ? 'desktop' : 'mobile';

  return (
    <div className={`mmc-sheet-scrim mmc-sheet-scrim--${modeSuffix}`} onClick={onClose}>
      <div
        className={`mmc-sheet-panel mmc-sheet-panel--${modeSuffix}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mmc-sheet-header">
          <h2 id={titleId} className="mmc-sheet-title" tabIndex={-1} ref={headingRef}>
            {title}
          </h2>
          <IconButton a11yLabel={`Close ${title} dialog`} variant="ghost" onClick={onClose}>
            <Icon name="Close" decorative />
          </IconButton>
        </div>
        <div className="mmc-sheet-content">{children}</div>
        {actions && <div className="mmc-sheet-actions">{actions}</div>}
      </div>
    </div>
  );
}
