# Skeletal divisions — 2026-10-02

Added `/learn/two-parts-of-the-skeleton`: two buttons compare axial and appendicular bone groups on an original SVG map. A one-shot highlight fades in over the selected division, with pause/resume/replay. Short copy and three recall questions accompany the map. Sources and review status stay collapsed. The lesson is linked from Anatomy and a searchable Body & poses card.

## Evidence and scope

Sources read on 2026-10-02:

- [OpenStax 7.1](https://openstax.org/books/anatomy-and-physiology-2e/pages/7-1-divisions-of-the-skeletal-system): division membership, including the vertebral column and its sacrum/coccyx.
- [OpenStax 8.1](https://openstax.org/books/anatomy-and-physiology-2e/pages/8-1-the-pectoral-girdle): shoulder girdle membership and attachment role.
- [OpenStax 8.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/8-3-the-pelvic-girdle-and-pelvis): distinguishes hip bones from the axial components of the bony pelvis.
- The existing Bones topic M2-T08 is based on Joga Yoga’s anatomy article, previously checked this session. Its `school-article` evidence basis remains intact. This is an introduction within the public anatomy subject area, not a named cohort requirement.

Review is AI source comparison, not qualified educator review. All copy is brief original explanation; no textbook image is copied. `SkeletonArt.jsx` is a see-through map of major regions. Small bones, exact counts and proportions are omitted or simplified. The illustration preserves the division distinction at the shoulder and pelvis. Animation changes opacity, not geometry; it is not a physical practice sequence.

## Verification

- Content validator: zero issues. 14 total lessons: 12 published introductory lessons/activities and 2 drafts. Introductory coverage: 22/57 mapped topics; Anatomy 8/15. These are content inventory numbers, not course-completion or certification scores.
- Final automated checks after the label/correction-copy update: 39 domain + 4 Sites tests pass; production build and git whitespace check pass. Existing Three.js chunk warning remains.
- Desktop: both divisions change highlights, labels and accessible diagram descriptions. Pause keeps the selected group's opacity unchanged across reads. Resume changes the button to Pause; endpoint shows Replay.
- Mobile: axial view inspected at 390 px, with no horizontal overflow. Labels for rib cage, spine and sacrum fit. Viewport reset.
- Three quiz questions exercised: correct ribs and sacrum/hip-bone feedback, intentionally incorrect shoulder answer. Correction wording was then strengthened to explicitly say “appendicular.” No Finish click or test attempt saved to personal progress.
- Body & poses search for “bones” returns the skeleton card; card opens the lesson. Source/status disclosures work. Anatomy-module lesson link checked before handoff.
- Reduced-motion uses the existing hook and was inspected in code, not tested by changing the OS preference. No new tests added solely to mirror this reversible content/UI addition. No fresh independent review for this increment.

## Suggested next improvement

Review module-level question selection: `selectQuestions` currently returns the first five eligible questions in content order, so newer anatomy lessons are available through their lesson quizzes but do not enter the existing Anatomy module sample. A next requested increment could make short module reviews sample across lessons and vary on retry, with meaningful selection tests. Preserve five-question sessions and the simple interface. This is a proposed follow-up, not implemented here.
