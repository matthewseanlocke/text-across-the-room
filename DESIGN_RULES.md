# Text Across the Room Design Rules

These decisions define the app's visual language and should be preserved during future UI changes.

## Effect preset tiles

- Presets are visual preview tiles, not labeled menu items. Do not show the preset name inside a tile.
- Static color-look tiles use the same bold `TEXT` sample for direct comparison.
- Animated tiles use short descriptive samples: `RAINBOW`, `RAINBOW`, `LIGHTNING`, `POLICE`, `HEARTBEAT`, and `USA`.
- Descriptive samples must shrink as needed to remain on one line inside the tile.
- Keep the preset name in `aria-label` and `title` attributes for accessibility and discovery.
- The selected tile retains a visible checkmark and selection outline.
- Animate every animated-look tile continuously so users can compare behaviors before selecting one.
- Respect `prefers-reduced-motion` by showing representative still frames instead.
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
- Treatment contains mutually exclusive structural styles; Solid remains the default.
- Black outline, Shadow, and Glow are independent finishing toggles that can stack with any treatment.
- Double outline is not offered.
- Outline uses the active text color as its stroke with a transparent fill.
- Glow uses the active text color and must remain readable rather than becoming a large blurred haze.
- Typography choices persist locally and apply identically to the editor preview and full-screen display.
- Auto-fit measurements must include the active letter spacing.
- Flash one word at a time always auto-fits each word in both the preview and full-screen display; do not expose a separate auto-fit setting.
- Emoji-only flashed words receive a small optical upward adjustment in the editor preview because native color-emoji fonts include extra space below the visible glyph.
- On narrow portrait screens, stack each typography label above its control instead of using a compact label column.
- Mobile typography buttons use at least a 46px height and 14px option labels for comfortable touch and reading; group labels use 15px type.
- Long treatment names wrap normally instead of shrinking or overflowing.
- Mobile section titles use 27px type, effect titles use 17px, and supporting descriptions use 14px.
- Mobile effect rows and switches grow with the typography instead of crowding larger labels into desktop-sized controls.
- Mobile subsection labels—including Color looks, Animated looks, Typeface, Spacing, Case, and Treatment—share the same 15px bold style.
- Mobile helper copy uses 12px type, form controls use 15px type, and preset demo text uses a consistent 26px size.
- Selected states change color, background, border, and weight—not font size—so options never appear typographically mismatched.
- The mobile message input uses a 92px height, 26px message type, and generous padding so the app's primary action feels appropriately prominent.
- Mobile treatments use two columns; never compress the full treatment list into three tiny columns.

## Splash screen

- Center the logo within the dynamic visible viewport (`dvh`), not the legacy mobile layout viewport.
- Tapping anywhere on the splash or pressing Enter/Space dismisses it immediately with a short fade.
- Keep the Buy Me a Coffee icon in the bottom-left corner, offset by device safe-area insets.
- Clicking the coffee link must not dismiss or navigate the app underneath it.

## Responsive editor layout

- Portrait and narrow upright screens stack the live preview above the controls.
- Short landscape screens use two panes regardless of coarse-pointer or mobile-device detection.
- In mobile landscape, the live preview occupies the sticky left pane and the editor controls scroll in the right pane.
- Landscape spacing must respect left and right device safe-area insets.
- Do not rely on width alone to classify mobile landscape; real Safari viewports can fall below the tablet breakpoint while emulators do not.

## Full-screen text fitting

- Tapping the full-screen display highlights the close button with a brief red pulse and shake, teaching users how to exit without making accidental taps dismiss the display.
- The close-button attention cue must restart on every display tap and respect reduced-motion preferences.
- Speed-change feedback uses a large, high-contrast panel with an 18px label, prominent numeric badge, and thick progress track so it remains legible at phone-viewing distance.

- Landscape text must fit complete glyphs within the visible viewport; never size it larger than the screen height.
- Measure `window.visualViewport.height` when available so mobile Safari browser chrome is excluded.
- Recalculate text size when either the window or visual viewport changes size.
- Use roughly 76% of the visible landscape height as the base font size, leaving room for ascenders, descenders, outlines, and glow.
