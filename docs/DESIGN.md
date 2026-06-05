# YellowWave Design

## Color Palette

- Primary yellow: `#F1FC49`
- Bright yellow: `#F2FE47`
- Hover/darker yellow: `#DDE835`
- Glow: `rgba(241, 252, 73, 0.45)`
- Background: `#0B0D0E`
- Sidebar: `#08090A`
- Player: `#101213`
- Card: `#171A1B`
- Text: `#F5F5F0`
- Subtext: `#B7B9A9`

## Visual Principles

YellowWave should feel like a premium underground music magazine translated into Spotify desktop. The interface stays dark, dense, and usable, with neon yellow acting as an editorial marker rather than decoration everywhere.

Core principles:

- Use yellow for active states, progress, key controls, selected navigation, and short highlighter labels.
- Keep panels translucent but readable.
- Round cards and player surfaces without making the UI feel toy-like.
- Keep album art recognizable.
- Use glow as feedback, not a permanent blanket effect.

## Difference From Liquify

Liquify is useful as a reference for package scale and theme completeness: flat Spicetify files, CSS plus optional JavaScript, preview metadata, and a polished end-user README.

YellowWave should differ clearly:

- YellowWave uses neon yellow as the identity color, not a Liquify palette.
- YellowWave prioritizes editorial highlighter accents and a dark magazine feel.
- YellowWave v0.1 is CSS-first, with only safe readiness JavaScript.
- YellowWave avoids copying selectors, structure blocks, logic, assets, or wording from Liquify.

## What Not To Do

- Do not copy Liquify code directly.
- Do not use copyrighted character or brand assets.
- Do not make the interface childish or overly cartoonish.
- Do not cover album art with destructive filters.
- Do not depend on Spotify APIs, OAuth, backends, APK changes, Vercel, or Supabase.
- Do not minify CSS.
- Do not add player logic in `theme.js` for v0.1.

## Performance Rules

- Use `backdrop-filter` only on contained panels and the player dock.
- Avoid blur on massive root containers.
- Provide opaque fallbacks with `@supports not`.
- Keep animations short and disable them under `prefers-reduced-motion`.
- Prefer color, border, and box-shadow changes over layout-heavy effects.
- Avoid selectors that force expensive repeated repainting across the full app.
