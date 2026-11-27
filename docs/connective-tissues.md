# Connective tissues introduction — 2026-10-02

Added one visual lesson at `/learn/what-connects-the-body`, linked from the Anatomy module and a searchable Body & poses card. Three buttons compare tendons, ligaments and articular cartilage. Each view has an original diagram, one-sentence explanation and one play/pause/replay control. Detail, sources and personal review status remain collapsed. Three recall questions use the existing review flow.

## Source and scope comparison

Read on 2026-10-02:

- [OpenStax 4.3, Connective tissue](https://openstax.org/books/anatomy-and-physiology-2e/pages/4-3-connective-tissue-supports-and-protects): supports tendon attachment and connective-tissue vocabulary.
- [OpenStax 9.4, Synovial joints](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints): supports ligament attachment/support, articular cartilage on facing bone surfaces and the intervening joint cavity. The layers are drawn separately, not as material filling the whole gap.
- Joga Yoga anatomy article: explicitly names joints and connective tissues among anatomy topics. Mapped to existing M2-T10 and M2-T11, whose evidence basis remains `school-article`. These are not asserted as named cohort lessons or assessed requirements.

All wording is a short original introduction. No injury-treatment advice, stretching prescription or injury-prevention guarantee is included. Review is Codex source comparison, not qualified educator review.

## Visual interpretation

`ConnectiveArt.jsx` shows relationship diagrams: muscle–tendon–bone, a ligament between bones beside a joint, and separate cartilage layers with joint space. Geometry stays fixed while a coloured highlight is drawn. The animation does not simulate tissue stretching, contraction, anatomical dimensions or joint range. Original drawings are not reproductions of the textbook figures. Asset provenance and scope are recorded in `content-review/asset-register.json`.

The shared motion hook supplies one-shot playback, pause and replay. Reduced-motion starts still; changing the tissue respects that preference. No dependencies, top-level navigation items, explorer route duplicates or storage-schema changes were added.

## Verification

- Content validation: zero issues. Now 13 lessons: 11 published introductions/activities and 2 drafts. Introductory coverage is 21/57 mapped topics (Anatomy 7/15); not full curriculum or certification completion.
- Existing 39 domain + 4 Sites tests pass. Build and whitespace check pass. Existing large Three.js chunk warning remains.
- Browser: all three selections change the explanation and accessible diagram description. Paused ligament highlight had the same stroke offset across separate reads. Replay appears at the endpoint.
- All three quiz questions exercised: tendon and cartilage correct feedback; intentionally wrong ligament answer returned the correct explanatory feedback. Did not press Finish or save a test attempt to the user's progress.
- Search for “tendon” finds the new Body & poses card; its link reaches the lesson. Sources and personal status are available in the disclosure. Anatomy-module entry checked.
- Tendon, ligament and cartilage drawings visually inspected on desktop; cartilage view checked at 390 px width, with document width equal to viewport width. Temporary viewport reset before handoff.
- Reduced-motion hook inspected; OS preference was not toggled. Full saved-attempt flow was not repeated for this content-only addition. No new implementation-mirroring tests added; this increment received implementer review, not fresh independent review.

Next suggested content increment, if requested: a simple axial/appendicular skeleton map for the still-uncovered Bones topic. Actual learner feedback takes priority.
