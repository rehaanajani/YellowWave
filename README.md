# YellowWave

YellowWave is a neon-yellow glassmorphism theme for Spotify desktop through Spicetify. It uses a dark graphite base, floating translucent surfaces, a rounded player dock, and highlighter-style yellow accents built around `#F1FC49`.

![YellowWave screenshot placeholder](assets/preview.png)

> Preview image coming soon. See `assets/preview-placeholder.md` until a real Spotify screenshot is captured.

## Features

- Neon yellow accent system replacing Spotify green.
- Dark graphite and black UI foundation.
- Glassmorphism panels with controlled blur and fallbacks.
- Floating rounded player bar with yellow progress styling.
- Rounded cards with subtle hover lift and yellow glow.
- Editorial highlighter-label accents for small labels and active states.
- Minimal `theme.js` that only marks the theme as ready after load.

## Installation on Windows

Use the included installer from PowerShell:

```powershell
.\install.ps1
```

The script copies YellowWave into your Spicetify themes folder, sets the theme and color scheme, and runs `spicetify apply`.

## Manual Install

1. Copy the `YellowWave` folder to `%appdata%\spicetify\Themes\YellowWave`.
2. Run:

```powershell
spicetify config current_theme YellowWave
spicetify config color_scheme Base
spicetify apply
```

## Development Loop

Edit `user.css`, then run:

```powershell
spicetify apply
```

Check Spotify desktop after each change. Keep CSS readable and avoid broad expensive effects on large containers.

## Roadmap

- `v0.1`: Yellow glass theme.
- `v0.2`: Highlighter labels.
- `v0.3`: Album-art dynamic background.
- `v1.0`: Marketplace-ready.
- `v2.0`: Animated controls.

## Notes

- YellowWave is original and does not copy Liquify code.
- This theme does not use Spotify API, APK changes, backend services, Vercel, Supabase, or OAuth.
- TODO: Replace `YOUR_GITHUB_USERNAME` in `manifest.json` before marketplace submission.
