# To My Pretty Girl ❤️ — Interactive Apology Website

A single-page, cinematic apology site built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step — just open `index.html` or host the folder as-is.

## Replace before sending

1. **Photos** — everything lives in `/images`, with soft placeholder graphics so you can see where each one goes:
   - `couple-full.jpg` — the puzzle photo. Use a square-ish photo of the two of you; her face should be somewhere near the center so the missing piece (currently placed top-right) lines up believably.
   - `memory1.jpg` through `memory6.jpg` — the six timeline photos, in order.
   - Just drop in your real photos using the exact same filenames and everything updates automatically.

2. **Music (optional)** — add your song to the existing `/music` folder, named exactly `our-song.mp3`. Nothing plays automatically: when she clicks "Open My Heart," a gentle popup asks if she'd like to listen while reading. Choosing "Yes" starts the song and reveals a floating glassmorphism music player (rotating vinyl, progress bar, volume, and a small live visualizer) that stays on screen for the rest of the experience. Choosing "Maybe later" skips the music, but the player still appears in its collapsed circular state so it can be started manually at any time. If no MP3 file is present, playback simply fails silently and the UI stays in its paused state.

3. **Text** — open `index.html` and search for the section you want to change (hero names, memory captions, the letter, the ending message). Everything is plain text in the markup, no build tools required.

## Hosting on GitHub Pages

1. Create a new repository and upload `index.html`, `style.css`, `script.js`, and the `images` folder (and `music` folder if used).
2. In the repo settings, open **Pages**, choose the `main` branch and `/root`, and save.
3. Your link will look like `https://yourusername.github.io/repo-name/`.

## Notes

- The puzzle piece is draggable with a mouse or a finger on touch screens, and can also be "solved" with Enter/Space when focused, for keyboard accessibility.
- Respects `prefers-reduced-motion` for visitors who have that turned on.
- Everything is fully responsive down to small phone widths.
