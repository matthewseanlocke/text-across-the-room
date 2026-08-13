# Text Across the Room Design Rules

These decisions define the app's visual language and should be preserved during future UI changes.

## Effect preset tiles

- Presets are visual preview tiles, not labeled menu items. Do not show the preset name inside a tile.
- Every tile contains the same bold `TEXT` sample so users can compare readability at a glance.
- Keep the preset name in `aria-label` and `title` attributes for accessibility and discovery.
- The selected tile retains a visible checkmark and selection outline.
- Animate an effect tile only while it is selected. Unselected tiles show a representative still frame.
- A tile must demonstrate the real preset behavior. Do not substitute decorative gradients, stripes, icons, or unrelated animation.

## Preset appearance

- **Day:** black text on white; static.
- **Night:** white text on black; static.
- **Emergency:** white text on red; the selected tile may alternate between red tones.
- **Party:** rainbow-cycling text on a black background. The background is not rainbow.
- **Disco:** white text on a rainbow-cycling background. The text is not the rainbow effect.
- **Lightning:** white text on pure black, flashing instantly to black text on pure white.
- **Siren:** white text over stepped blue, white, black, and red emergency flashes.
- **Heartbeat:** white text over a dark-red background that pulses brighter red.

## Controls organization

- Full-screen color treatments belong exclusively in **Choose the look**: Day, Night, Emergency, Party, Disco, Lightning, Siren, and Heartbeat.
- Group Day, Night, and Emergency under **Color looks**, with their custom color controls immediately below.
- Group Party, Disco, Lightning, Siren, and Heartbeat under **Animated looks**.
- Animated looks own their color behavior, so both custom color controls are visibly disabled while one is selected.
- Do not duplicate those treatments as switches in **Effects**.
- **Effects** contains only message/layout modifiers: Flash one word at a time, its conditional Auto-fit option, and Two rows in portrait.

## Lightning behavior

- Lightning is a binary black/white strobe. Never use yellow, a lightning-bolt stripe, a gradient, or a decorative flash icon.
- Use stepped timing so the background never interpolates through gray.
- Text contrast must switch at the same instant as the background.
- Apply the same behavior to the preset tile, editor preview, and full-screen display.

## Consistency check

When changing a preset, compare its tile against the live preview and full-screen display. All three surfaces must communicate the same colors, text treatment, and animation.

## Speed behavior

- The scroll-speed control must update the editor preview immediately at every step.
- Changing speed retimes the current pass in place; it must not restart the text or create a new off-screen delay.
- Preview text begins at the preview's right edge, never one full text-width beyond it.
- The editor preview and full-screen display use the same ten-level duration scale.
- Word-flash timing is controlled by the same speed setting.

## Typography controls

- Typography controls live beside Typeface, not in Effects.
- Spacing offers three intentional choices: Tight (`-0.04em`), Normal (`0`), and Wide (`0.12em`).
- Case offers As typed and UPPERCASE; never rewrite the user's saved message when changing case.
- Treatment offers Solid, Outline, and Glow. Solid remains the default.
- Outline uses the active text color as its stroke with a transparent fill.
- Glow uses the active text color and must remain readable rather than becoming a large blurred haze.
- Typography choices persist locally and apply identically to the editor preview and full-screen display.
- Auto-fit measurements must include the active letter spacing.

## Splash screen

- Center the logo within the dynamic visible viewport (`dvh`), not the legacy mobile layout viewport.
- Tapping anywhere on the splash or pressing Enter/Space dismisses it immediately with a short fade.
- Keep the Buy Me a Coffee icon in the bottom-left corner, offset by device safe-area insets.
- Clicking the coffee link must not dismiss or navigate the app underneath it.
