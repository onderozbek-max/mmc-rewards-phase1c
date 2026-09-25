/**
 * Desktop-only stakeholder-review panel (§31). Explanatory metadata about the
 * prototyping strategy — never part of the simulated MMC mobile product, and
 * never rendered at mobile viewport widths (see AppShell).
 *
 * Also hosts the prototype-only reset/scenario controls (§5, §32). These are
 * NOT member-facing MMC functionality — they exist purely so stakeholders can
 * replay the demo from a known state, which is why they live here rather than
 * anywhere inside the simulated phone screen.
 */

import * as React from 'react';
import { resetToScenario } from '../../state/memberState';

const PHASES = [
  { id: '1a', name: '1A', label: 'Rewards Journey', tag: 'FOUNDATION', mark: '✓', current: false },
  { id: '1b', name: '1B', label: 'Progress Motivation', tag: 'ASSUMED ADOPTED FOR THIS PROTOTYPE', mark: '✓*', current: false },
  { id: '1c', name: '1C', label: 'Earn & Progress Feedback', tag: 'CURRENT', mark: '', current: true },
  { id: '1d', name: '1D', label: 'Milestone Achievement & Unlocks', tag: 'NEXT', mark: '', current: false },
] as const;

export function StakeholderShell() {
  return (
    <aside className="mmc-stakeholder-shell" aria-label="Prototype context for stakeholders">
      <p className="mmc-stakeholder-shell__eyebrow">PHASE 1C — EARN &amp; PROGRESS FEEDBACK</p>

      <h2 className="mmc-stakeholder-shell__h2">Foundation</h2>
      <p>
        Phase 1A establishes the functional Community Pass journey: what points mean, current
        progress, the next milestone, and the benefit.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">Assumption for this prototype</h2>
      <p>
        This prototype assumes the Phase 1B Progress Motivation experiment produced a positive
        result and its treatment was adopted. Therefore this prototype carries forward Phase 1A +
        adopted Phase 1B + the new Phase 1C capability.
      </p>
      <p>
        This assumption is for prototyping the positive-path end state. It does <strong>not</strong>{' '}
        pre-decide the actual Phase 1B experiment. If Phase 1B does not demonstrate sufficient
        incremental value, Phase 1C still builds on the Phase 1A functional baseline without the
        rejected motivational-progress layer.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What 1C adds</h2>
      <p>
        Eligible participation already updates the member's underlying lifetime points and
        progression. Phase 1C makes that change immediate and explicit through a dedicated
        post-completion feedback experience:
      </p>
      <p className="mmc-stakeholder-shell__example">
        PARTICIPATE → EARN POINTS → SEE UPDATED LIFETIME POINTS → SEE UPDATED PROGRESS TOWARD THE
        NEXT BENEFIT
      </p>
      <p className="mmc-stakeholder-shell__example">
        180 lifetime points → complete a 30-point activity → "You earned 30 points" → 210
        lifetime points → 40 points until the next benefit
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What to evaluate</h2>
      <p>
        Does explicitly showing the earning and resulting progress make the relationship between
        participation and Community Pass tangible and trustworthy?
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What is not built yet</h2>
      <p>
        Phase 1D adds the complete milestone-achievement experience when a member reaches 250
        points: milestone reached → benefit unlocked → achievement recognized → next milestone
        established.
      </p>
      <p>
        1C must maintain truthful milestone state if a member crosses 250, but the full
        achievement/unlock experience is intentionally deferred to 1D.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">Phase progression</h2>
      <div className="mmc-phase-track">
        {PHASES.map((phase, i) => (
          <React.Fragment key={phase.id}>
            {i > 0 && <span className="mmc-phase-track__arrow" aria-hidden="true">→</span>}
            <div className={`mmc-phase-track__item ${phase.current ? 'mmc-phase-track__item--current' : ''}`}>
              <strong>{phase.name}</strong>
              <span>{phase.label}</span>
              <em>{phase.tag}{phase.mark ? ` ${phase.mark}` : ''}</em>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="mmc-stakeholder-shell__footnote">
        *1B carries forward here only under the assumed positive experiment outcome.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What changed from the previous prototype</h2>
      <p>
        <strong>Previous — 1B:</strong> Successful eligible participation updates the underlying
        Community Pass state, but the member returns to the updated experience without a
        dedicated progress-feedback moment.
      </p>
      <p>
        <strong>This prototype — 1C:</strong> The same state change is now explicitly
        communicated immediately after completion.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">Prototype controls</h2>
      <p className="mmc-stakeholder-shell__footnote">
        Development-only. Restores a representative member state for replaying the demo. Not part
        of the MMC member experience.
      </p>
      <div className="mmc-dev-controls">
        <button type="button" onClick={() => resetToScenario('baseline-180')}>
          Scenario A/B — 180 pts
        </button>
        <button type="button" onClick={() => resetToScenario('near-milestone-240')}>
          Scenario C — 240 pts (near milestone)
        </button>
      </div>
    </aside>
  );
}
