# Text Across The Room

A simple yet effective scrolling text display application that lets you create attention-grabbing messages for presentations, events, or any situation where you need to display text across a room.

## Features

- Display scrolling text that's visible from a distance
- Multiple font options (Display, Handwriting, Monospace, Serif)
- Customizable text and background colors, including rainbow text
- Adjustable scroll speed with intuitive swipe gestures
- Visual effect presets (Day, Night, Emergency, Party, Disco, Lightning)
- Quick message templates for common use cases
- Text preview before display
- Full-screen display mode
- Dark mode interface
- Mobile-friendly with touch gestures
- Responsive design works in both portrait and landscape orientations

## Project Setup

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone https://github.com/yourusername/text-across-the-room.git

# Step 2: Navigate to the project directory
cd text-across-the-room

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Usage

1. Enter your message in the text field or select from quick message templates
2. Customize the appearance (color, font, speed)
3. Select a preset or create your custom style
4. Preview how your text will look in the preview section
5. Click "DISPLAY" to show the message in full-screen mode
6. On the display screen:
   - Swipe left/right to adjust scroll speed
   - Click anywhere to return to the editor
7. Toggle between light and dark mode using the sun/moon icon

## Building for Production

To build the app for production, run:

```sh
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static file hosting service.

## Versioning

The splash screen displays the current application version directly from `package.json`.

Every completed code update must increment the patch version before it is committed or deployed:

```sh
npm run version:patch
```

For example: `0.1.2` becomes `0.1.3`. Commit both `package.json` and `package-lock.json` with the update. Use a minor or major version bump instead when intentionally publishing a larger release.

## Design documentation

See [DESIGN_RULES.md](DESIGN_RULES.md) for the required visual behavior of preset tiles and display effects. Update that reference whenever an effect's intended appearance changes.

## Copyright Notice

© 2024. All Rights Reserved.

This application is proprietary software. No part of this application may be reproduced, distributed, or transmitted in any form or by any means without prior written permission.

This is NOT an open-source project. The source code is shared for development and review purposes only.
