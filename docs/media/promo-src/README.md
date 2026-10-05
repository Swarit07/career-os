# Promo source

How [`../careeros-promo-30s.mp4`](../careeros-promo-30s.mp4) was made: a single HTML composition animated by time, screenshotted frame by frame, then encoded with ffmpeg.

- `promo.html` is the 30-second composition. `window.render(t)` draws the frame at `t` seconds, using the screenshots in this folder (sample data for a fictional user).
- `render.mjs` opens the page in Playwright and saves one PNG per frame.

```bash
npx serve .                                    # serve this folder
mkdir -p frames
node render.mjs http://localhost:3000/promo.html frames 30 30
ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 -an ../careeros-promo-30s.mp4
```
