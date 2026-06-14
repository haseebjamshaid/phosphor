# phosphor

A browser-based, music-reactive visualizer. Audio playing on your machine drives
real-time generative visuals — an iridescent oil-slick centerpiece, drifting blue
bokeh, film grain, chromatic aberration, beat-triggered glitch bursts, and a radial
kaleidoscope. Dark, grainy, dreamlike.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Click **Enter** (this unlocks audio), then choose a source.

## Audio sources

- **System audio** — captures everything playing on your machine. The hero path.
  **Chromium desktop only** (Chrome/Edge on macOS/Windows): in the share dialog, pick
  a screen/tab and tick **"Share audio"**.
- **Audio file** — drag-drop or pick an `.mp3`. Works in any browser; great for a
  reliable demo.
- **Idle preview** — synthetic self-animation, no audio needed. The default cold open,
  and the fallback on browsers that can't capture audio (Safari, Firefox, mobile).

> Raw audio can't be tapped from Spotify/YouTube (DRM / cross-origin). Reactivity comes
> from capturing **playback** via `getDisplayMedia`, so the music source is irrelevant.

## Customize

Open the **leva** panel (top-right) to tweak palette, reactivity, and every effect, or
switch between the named presets (Blue Séance, Datamosh, Oil Spill) from the toolbar.
Each preset is a `VisualizerConfig` — the single typed object the whole renderer reads from.

## Tech

Vite · React · TypeScript · react-three-fiber · drei · @react-three/postprocessing ·
zustand · leva · zod · Web Audio API.

**Performance:** FFT audio data never flows through React state. It goes
`AnalyserNode → a mutable AudioFrame → useFrame → shader/effect uniforms`, so React
never re-renders on audio frames and the scene holds 60fps.

## Scripts

```bash
npm run dev        # dev server
npm run build      # typecheck + production build
npm run test       # unit tests (frequency bands, beat detection, config, store)
npm run lint       # eslint
```

## Deploy

Static site, no backend. Pushing to `main` deploys to GitHub Pages via
`.github/workflows/deploy.yml`. The Vite `base` is set to `/phosphor/` for project-page
hosting. Requires HTTPS (GitHub Pages provides it) for system-audio capture.

## Browser support

Chrome/Edge desktop for the full experience (system audio + WebGL postprocessing).
Other browsers fall back to file upload and the idle animation.
