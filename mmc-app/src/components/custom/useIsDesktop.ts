import * as React from 'react';

/**
 * Drives whether the desktop-only stakeholder shell (and the prototype-only
 * scenario controls that live inside it, §5/§31) should mount at all. This is
 * a structural show/hide decision — an entire chrome layer that must never
 * reach real mobile viewports — so it's handled in JS via matchMedia rather
 * than CSS `display: none` (which the LD spacing guardrails reserve for
 * actual content reflow, not for keeping non-member-facing UI out of the DOM).
 */
export function useIsDesktop(minWidth = 960): boolean {
  const query = React.useMemo(() => `(min-width: ${minWidth}px)`, [minWidth]);
  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isDesktop;
}
