# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FigGen is a Figma Plugin for generative art. It allows users to create generative art patterns from selected frames/artboards in Figma with two main modes:
- **Randomize Artboards**: Creates a grid of randomly selected frames with optional rotation and custom spacing
- **Combine Artboards**: Overlays random frames from selections into combined artboards in an auto-layout container

## Development Commands

### Building and Running
```bash
npm run build    # Production build (minified with Terser)
npm run dev      # Development mode with watch and livereload
npm run start    # Serve the public directory (usually called automatically in dev mode)
```

### Testing the Plugin
After building, load the plugin in Figma Desktop:
1. Run `npm run dev` to start development mode
2. In Figma: Plugins → Development → Import plugin from manifest
3. Select the `public/manifest.json` file
4. The plugin will auto-reload on changes in dev mode

## Architecture

### Two-Part Figma Plugin Architecture

FigGen follows the standard Figma plugin pattern with separate backend and frontend code:

**Backend (src/code.ts)**
- Runs in Figma's main thread with full access to Figma API
- Handles all Figma node manipulation (creating frames, cloning, positioning)
- Receives messages from UI via `figma.ui.onmessage`
- Sends data to UI via `figma.ui.postMessage`
- Compiled to `public/code.js`

**Frontend (src/PluginUI.svelte)**
- Runs in an isolated iframe (no direct Figma API access)
- Svelte component providing the plugin UI
- Uses `figma-plugin-ds-svelte` for Figma-style UI components
- Communicates with backend via `parent.postMessage`
- Bundled into `public/index.html` as a single-file HTML

### Build Pipeline (Rollup)

The `rollup.config.js` defines two separate build targets:

1. **UI Bundle** (`src/main.js` → `src/build/bundle.js` → `public/index.html`)
   - Processes Svelte components
   - Bundles CSS with PostCSS and cssnano
   - Inlines everything into a single HTML file using `rollup-plugin-html-bundle`
   - Enables livereload in dev mode

2. **Plugin Code** (`src/code.ts` → `public/code.js`)
   - TypeScript compilation
   - CommonJS format (required by Figma)
   - Minified in production builds

### Communication Pattern

```
User interacts with UI
    ↓
PluginUI.svelte sends postMessage with parameters
    ↓
code.ts receives message via figma.ui.onmessage
    ↓
code.ts manipulates Figma nodes (frames, rectangles, etc.)
    ↓
code.ts closes plugin or sends data back to UI
```

## Key Implementation Details

### Selection Requirement
The plugin requires at least one frame to be selected before running. It captures `figma.currentPage.selection[0]` on plugin run and validates the selection exists.

### Randomization Logic
- **Random Selection**: Randomly picks from all selected frames to clone
- **Random Rotation**: Applies one of four rotation angles: 0°, 90°, 180°, 270° (implemented via `relativeTransform` matrix)
- **Grid Layout**: Uses spacing parameter to position clones in a grid pattern

### Mode-Specific Behavior

**Randomize Artboards Mode**:
- Creates a container frame below the current selection
- Generates `count × count` grid of cloned frames
- Each position randomly selects from available selections
- Supports custom spacing and optional random rotation

**Combine Artboards Mode**:
- Creates horizontal auto-layout frame
- Generates `count` artboards, each randomly combining elements from selections
- Spacing and rotation are disabled in this mode
- Elements are layered at (0,0) within each container

## Technology Stack

- **TypeScript**: Plugin backend code
- **Svelte 3**: UI framework
- **Rollup**: Module bundler
- **figma-plugin-ds-svelte**: Figma design system components for Svelte
- **@figma/plugin-typings**: TypeScript definitions for Figma Plugin API

## Working with the Codebase

### Adding New Features
- UI changes: Modify `src/PluginUI.svelte`
- Plugin logic: Modify `src/code.ts`
- Both files communicate via postMessage, so update message types in both places

### Modifying UI Parameters
The UI sends these parameters to the backend:
- `count`: Number of artboards/grid size
- `spacing`: Distance between elements (px)
- `randomDegrees`: Boolean for rotation toggle
- `selectedItem`: Mode selection (item1 = Randomize, item2 = Combine)

### Debugging
- UI console: Right-click the plugin UI → Inspect Element → Console
- Plugin code: Use `console.log()` in code.ts, view in Figma Desktop → Plugins → Development → Open Console
