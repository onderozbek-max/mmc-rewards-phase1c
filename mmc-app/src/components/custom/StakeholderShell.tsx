/**
 * Desktop-only stakeholder-review panel. Explanatory metadata about the
 * prototyping strategy — never part of the simulated MMC mobile product, and
 * never rendered at mobile viewport widths (see AppShell).
 *
 * Also hosts the prototype-only reset/scenario controls. These are NOT
 * member-facing MMC functionality — they exist purely so stakeholders can
 * replay the demo from a known state, which is why they live here rather
 * than anywhere inside the simulated phone screen.
 */

import * as React from 'react';
import { resetToScenario } from '../../state/memberState';

const PHASES = [
  { id: '1a', name: '1A', label: 'Progression Foundation', tag: 'COMPLETE', mark: '✓', current: false },
  { id: '1b', name: '1B', label: 'Progress Motivation', tag: 'ASSUMED ADOPTED', mark: '✓*', current: false },
  { id: '1c', name: '1C', label: 'Earn & Progress Feedback', tag: 'CURRENT', mark: '', current: true },
  { id: '1d', name: '1D', label: 'Milestone Achievement Experience', tag: 'NEXT', mark: '', current: false },
  { id: '1e', name: '1E', label: 'Full Milestone & Benefit Expansion', tag: 'FUTURE', mark: '', current: false },
  { id: '1f', name: '1F', label: 'Historical Reconciliation & Full Population Rollout', tag: 'FUTURE', mark: '', current: false },
] as const;

export function StakeholderShell() {
  return (
    <aside className="mmc-stakeholder-shell" aria-label="Prototype context for stakeholders">
      <p className="mmc-stakeholder-shell__eyebrow">PHASE 1C — EARN &amp; PROGRESS FEEDBACK</p>
      <p className="mmc-stakeholder-shell__footnote">
        <strong>Initiative type:</strong> Build + Measure
      </p>

      <h2 className="mmc-stakeholder-shell__h2">Foundation</h2>
      <p>
        Phase 1A already provides truthful earning, milestone calculation, and benefit
        fulfillment.
      </p>
      <p>
        For this forward-looking prototype, assume the Phase 1B Progress Motivation experiment
        was positive and its treatment was adopted.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What 1C adds</h2>
      <p>
        1C does <strong>not</strong> introduce point earning. It makes the effect of successful
        participation immediate and explicit:
      </p>
      <p className="mmc-stakeholder-shell__example">
        PARTICIPATE → EARN POINTS → SEE UPDATED LIFETIME POINTS → SEE UPDATED PROGRESS
      </p>
      <p className="mmc-stakeholder-shell__example">
        180 → complete a 30-point activity → You earned 30 points → 210 lifetime points → 40
        points until the 250 benefit
      </p>

      <h2 className="mmc-stakeholder-shell__h2">Threshold crossing</h2>
      <p>
        If activity-driven progress crosses 250, the underlying product already makes What's New
        + Member Favorites available. 1C represents the resulting state truthfully but does not
        yet add the rich milestone-achievement experience.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What to evaluate</h2>
      <p>
        Does explicit earn-and-progress feedback make the causal relationship between
        participation and Community Pass tangible and trustworthy?
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What changed from 1B</h2>
      <p>
        <strong>1B:</strong> successful participation updates the product state, but the member
        returns to that updated state without a dedicated causal-feedback moment.
      </p>
      <p>
        <strong>1C:</strong> the same state change is explicitly communicated immediately after
        completion.
      </p>

      <h2 className="mmc-stakeholder-shell__h2">What is not built yet</h2>
      <p>
        <strong>1D:</strong> Milestone Achievement Experience
      </p>
      <p>
        <strong>1E:</strong> Full Milestone &amp; Benefit Expansion
      </p>
      <p>
        <strong>1F:</strong> Historical Reconciliation &amp; Full Population Rollout
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
        *1B carries forward in this prototype under an assumed positive experiment outcome. A
        negative result would remove/simplify that optional motivational layer without affecting
        1C.
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
        <button type="button" onClick={() => resetToScenario('post-250-270')}>
          Scenario D — 270 pts (post-250)
        </button>
      </div>
    </aside>
  );
}
