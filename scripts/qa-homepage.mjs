import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright";

const root = path.resolve("_site");
const outDir = path.resolve("work/qa");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const viewports = [
  { name: "desktop-short", width: 2000, height: 1127 },
  { name: "laptop", width: 1536, height: 864 },
  { name: "tablet", width: 1024, height: 1366 },
  { name: "mobile", width: 390, height: 844 }
];

function safeJoin(base, targetPath) {
  const resolved = path.resolve(base, "." + targetPath);
  return resolved.startsWith(base) ? resolved : null;
}

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = safeJoin(root, decodeURIComponent(urlPath.split("?")[0]));

    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  });
}

fs.mkdirSync(outDir, { recursive: true });

const server = createServer();
await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(outDir, `homepage-${viewport.name}-${viewport.width}x${viewport.height}.png`),
      fullPage: false
    });
    await page.close();
  }
  console.log(`Saved homepage QA screenshots to ${outDir}`);
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}
