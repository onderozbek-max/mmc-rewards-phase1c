/**
 * Mobile bottom tab bar — locked 1A/1B navigation chrome (Home, Scan & Go,
 * Reorder, Account, Services). Purely presentational; only Home and Account
 * are wired to real routes since those are the only screens this prototype
 * increment builds.
 */

import * as React from 'react';
import { Icon } from '../Icons';
import { Caption } from '../Text';
import { navigate } from '../../router/hashRouter';

interface NavItem {
  label: string;
  icon: string;
  route: '/' | '/profile';
  disabled?: boolean;
}

const ITEMS: NavItem[] = [
  { label: 'Home', icon: 'Home', route: '/' },
  { label: 'Scan & Go', icon: 'ScanAndGo', route: '/', disabled: true },
  { label: 'Reorder', icon: 'Truck', route: '/', disabled: true },
  { label: 'Account', icon: 'User', route: '/profile' },
  { label: 'Services', icon: 'Services', route: '/', disabled: true },
];

export interface BottomNavProps {
  active: 'home' | 'profile';
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav aria-label="Primary" className="mmc-bottom-nav">
      {ITEMS.map((item) => {
        const isActive =
          (active === 'home' && item.route === '/' && item.label === 'Home') ||
          (active === 'profile' && item.label === 'Account');
        return (
          <button
            key={item.label}
            type="button"
            className="mmc-bottom-nav__item"
            aria-current={isActive ? 'page' : undefined}
            disabled={item.disabled}
            onClick={item.disabled ? undefined : () => navigate(item.route)}
          >
            <Icon
              name={item.icon}
              decorative
              style={{
                color: isActive
                  ? 'var(--ld-semantic-color-text-brand, #283645)'
                  : 'var(--ld-semantic-color-text-subtle, #5a6068)',
              }}
            />
            <Caption color={isActive ? 'brand' : 'subtle'}>{item.label}</Caption>
          </button>
        );
      })}
    </nav>
  );
}
