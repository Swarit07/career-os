import { chromium } from "playwright";
const [,, url, outDir, fps = "30", dur = "30"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const n = Math.round(Number(fps) * Number(dur));
for (let i = 0; i < n; i++) {
  await p.evaluate((x) => window.render(x), i / Number(fps));
  await p.screenshot({ path: `${outDir}/f${String(i).padStart(4, "0")}.png` });
}
console.log("frames", n);
await b.close();
