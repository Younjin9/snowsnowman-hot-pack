# Disc Depth and Pack Position Design

## Goal

Make the movable metal snap look embedded inside the transparent snowman warmer body and lower the snowman to a more balanced viewport position.

## Visual Layering

- Keep the metal snap as one movable element so it can travel continuously across the head, neck, and belly.
- Change the snap's stacking level from `25` to `4`.
- At level `4`, the snap remains visible through the transparent vinyl while sitting below:
  - the head and its face details;
  - all three black decorative buttons;
  - the scarf and scarf tail;
  - the hat.
- The snap remains above the belly base, so it does not disappear while moving across the body.
- Preserve pointer and device-orientation interactions; decorative layers continue using `pointer-events: none` where they overlap the snap.

## Vertical Position

- Lower the complete snowman presentation by applying a responsive vertical translation to `.pack-wrap`, not `.pack`.
- Use `translateY(clamp(50px, 8dvh, 70px))` in portrait layouts. This approximates the requested 30% visual correction without moving the artwork by 30% of its own height and overlapping the controls.
- Disable the added translation in short landscape mode, where the page uses a two-column composition and vertical space is limited.
- Keep all internal coordinates, crystallization origins, drag bounds, and tilt calculations unchanged because they remain relative to the transformed pack geometry.

## Verification

- Add tests that protect the snap's stacking level and the responsive wrapper translation.
- Preserve all existing interaction tests.
- Verify the deployed production page after pushing the implementation to GitHub `main`.

## Scope

- No artwork redesign.
- No changes to random melt outcomes.
- No changes to disc movement geometry or sensor permissions.
