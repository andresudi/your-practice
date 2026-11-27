# Visual pose and physiology expansion — 2026-10-01

## Scope and sources

User approved expanding visual poses and anatomy while retaining short text and animation. Existing flows reused; Notes remains removed. This adds four illustrated pose studies (Mountain, Chair, Tree, Downward-Facing Dog), two short anatomy lessons, two corresponding explorers and six source-checked recall questions. Warrior II keeps its original 3D studio.

The Joga Yoga public outline was checked again: asana fundamentals, physical anatomy/physiology and bodily systems remain listed. The school does not identify an exhaustive required-pose list. These additions are our study organisation, not an official cohort assignment or complete certification curriculum.

- Pose names and broad recognition checked against YogaEasy’s Mountain, Tree and Downward Dog pages, and Art of Living’s Chair page; see source records for exact URLs. Original SVG artwork remains unreviewed illustrative material. No practical cues or health-benefit claims were released. Chair arm positions differ between teaching traditions; the cited page supplies the name and bent-knee shape, not approval of our overhead-arm artwork.
- Breathing: OpenStax 22.3 source comparison for diaphragm action, thoracic volume, pressure gradient and quiet elastic expiration. Animation timing is explicitly not a breathing exercise.
- Muscle roles: OpenStax 11.1 source comparison for attachments, agonist/antagonist/synergist vocabulary and elbow actions. Schematic identifies roles; it does not imply the antagonist switches off or that only two muscles are involved.

New anatomy mapping: M2-T02 (organs/systems) and M2-T09 (muscles). Coverage remains introductory. Total inventory is now 11 lessons: nine published introductions and two draft lessons, plus five unreviewed pose studies. The additional four poses do not increase published topic coverage.

## Implementation and verification

Motion model tests first failed because the new module did not exist, then passed after implementation. They check inspiration/expiration geometry, clamped boundaries, action-dependent muscle roles and constant forearm length. Existing shared motion hook supplies one-shot playback, manual scrubbing, background pause and reduced-motion handling.

Browser checks and final suite results are recorded below after verification. Independent review was attempted under the review skill but the agent hit its account usage limit without returning findings; remaining review is by the implementing agent.

### Final evidence

- Content validator: no issues. 37 domain tests + four Sites tests passed; production build and git diff --check passed. The existing nonblocking Three.js chunk warning remains.
- Desktop browser: all five pose cards have distinct artwork; Tree body-region selection updates the highlight, text and anatomy link; mirror button state changes. Alias search “vrikshasana” finds Tree. Fixed a legacy CSS selector collision and card-art cropping found during visual inspection.
- Breathing: selecting Air leaves pauses at the expiration phase and changes its explanation; inline recall reveals correct feedback. Muscle diagram supports phase buttons and keyboard Home scrubbing. Completed all three new muscle questions, saw 3/3 with saved status and a return-to-lesson link.
- Rehearsal deep link preselects Tree and the dropdown lists all five poses. Existing sequence records remain intact. Pose-specific art replaces the old hard-coded Warrior thumbnail.
- After switching to a visible preview, 390 px mobile checks succeeded for all four new pose pages, both new anatomy explorers and both new lessons, with no horizontal overflow. Tree and muscle screenshots were inspected and saved. Earlier hidden-tab viewport attempts did not resize and were not counted as mobile evidence. Override reset before handoff.
- Reduced-motion behavior reuses the existing reviewed hook and new CSS disables highlight/entry animations. OS preference was not changed during UI QA; no claim of a new OS-level reduced-motion test.
- Independent reviewer could not run due to account usage limit. Implementer self-review and automated/browser checks completed; no independent sign-off claimed.
