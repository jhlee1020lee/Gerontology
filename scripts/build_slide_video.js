const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT_DIR, "manifest", "readings.json");
const EDGE_CANDIDATES = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function writeBuffer(filePath, buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

function loadManifest() {
  return JSON.parse(readText(MANIFEST_PATH));
}

function parseArgs(argv = process.argv.slice(2)) {
  const slugIndex = argv.indexOf("--slug");
  return {
    slug: slugIndex !== -1 ? argv[slugIndex + 1] : "",
  };
}

function findReading(slug) {
  const manifest = loadManifest();
  const reading = (manifest.readings || []).find((item) => item.slug === slug);
  if (!reading) {
    throw new Error(`Unknown slug: ${slug}`);
  }
  return reading;
}

function findBrowserExecutable() {
  const executable = EDGE_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!executable) {
    throw new Error("No Edge or Chrome executable found for headless rendering.");
  }
  return executable;
}

function escapeForHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function escapeJs(value) {
  return JSON.stringify(String(value ?? ""));
}

function renderHtml(spec) {
  const width = Number(spec.width) || 1280;
  const height = Number(spec.height) || 720;
  const secondsPerSlide = Math.max(4, Number(spec.seconds_per_slide) || 6);
  const slides = Array.isArray(spec.slides) ? spec.slides : [];
  const slidesJson = JSON.stringify(slides);
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeForHtml(spec.title || "설명 영상")}</title>
  <style>
    :root {
      color-scheme: light;
      --bg0: #f7f0e5;
      --bg1: #efe3cf;
      --ink: #16283b;
      --muted: #6a6d72;
      --accent: #b45f32;
      --line: rgba(22, 40, 59, 0.15);
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #111;
      font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
    }
    canvas {
      display: block;
      width: ${width}px;
      height: ${height}px;
    }
  </style>
</head>
<body>
  <canvas id="deck" width="${width}" height="${height}"></canvas>
  <script>
    const spec = {
      title: ${escapeJs(spec.title || "설명 영상")},
      subtitle: ${escapeJs(spec.subtitle || "")},
      footer: ${escapeJs(spec.footer || "")},
      width: ${width},
      height: ${height},
      secondsPerSlide: ${secondsPerSlide},
      slides: ${slidesJson}
    };

    function roundedRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function wrapText(ctx, text, maxWidth) {
      const words = String(text || "").split(/\\s+/).filter(Boolean);
      const lines = [];
      let line = "";
      for (const word of words) {
        const testLine = line ? line + " " + word : word;
        if (ctx.measureText(testLine).width <= maxWidth) {
          line = testLine;
          continue;
        }
        if (line) {
          lines.push(line);
        }
        line = word;
      }
      if (line) {
        lines.push(line);
      }
      return lines;
    }

    function drawSlide(ctx, canvas, slide, index, total) {
      const w = canvas.width;
      const h = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#f7f0e5");
      bg.addColorStop(0.55, "#efe3cf");
      bg.addColorStop(1, "#dbc7a7");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(180, 95, 50, 0.08)";
      ctx.beginPath();
      ctx.ellipse(w * 0.82, h * 0.18, 180, 120, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.18, h * 0.88, 230, 140, 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(22, 40, 59, 0.15)";
      ctx.lineWidth = 2;
      roundedRect(ctx, 42, 42, w - 84, h - 84, 30);
      ctx.stroke();

      ctx.fillStyle = "#16283b";
      ctx.font = "700 26px Malgun Gothic";
      ctx.fillText(spec.footer || "", 78, 92);
      ctx.textAlign = "right";
      ctx.fillText(String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0"), w - 78, 92);
      ctx.textAlign = "left";

      roundedRect(ctx, 78, 126, w - 156, h - 204, 28);
      ctx.fillStyle = "rgba(255, 252, 247, 0.78)";
      ctx.fill();

      ctx.fillStyle = "#b45f32";
      ctx.font = "700 24px Malgun Gothic";
      ctx.fillText(slide.kicker || spec.subtitle || "", 112, 182);

      ctx.fillStyle = "#16283b";
      ctx.font = "700 44px Malgun Gothic";
      const titleLines = wrapText(ctx, slide.title || "", w - 240);
      let cursorY = 238;
      for (const line of titleLines) {
        ctx.fillText(line, 112, cursorY);
        cursorY += 56;
      }

      ctx.font = "400 28px Malgun Gothic";
      ctx.fillStyle = "#24384d";
      const bullets = Array.isArray(slide.bullets) ? slide.bullets : [];
      const bulletMaxWidth = w - 290;
      let bulletY = cursorY + 26;
      for (const bullet of bullets) {
        const bulletLines = wrapText(ctx, bullet, bulletMaxWidth);
        ctx.fillStyle = "#b45f32";
        ctx.beginPath();
        ctx.arc(124, bulletY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#24384d";
        bulletLines.forEach((line, lineIndex) => {
          ctx.fillText(line, 148, bulletY + lineIndex * 38);
        });
        bulletY += bulletLines.length * 38 + 22;
      }

      if (slide.note) {
        ctx.fillStyle = "#6a6d72";
        ctx.font = "400 22px Malgun Gothic";
        const noteLines = wrapText(ctx, slide.note, w - 240);
        let noteY = h - 124;
        noteLines.forEach((line, lineIndex) => {
          ctx.fillText(line, 112, noteY + lineIndex * 30);
        });
      }
    }

    async function blobToBase64(blob) {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const chunkSize = 0x8000;
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }

    (async () => {
      const canvas = document.getElementById("deck");
      const ctx = canvas.getContext("2d");
      const fps = 2;
      const chunks = [];
      let finished = false;
      window.__videoDone = false;
      window.__videoBase64 = "";
      window.__videoError = "";

      try {
        const stream = canvas.captureStream(fps);
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm;codecs=vp8";
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1800000 });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size) {
            chunks.push(event.data);
          }
        };
        recorder.onstop = async () => {
          try {
            const blob = new Blob(chunks, { type: mimeType });
            window.__videoBase64 = await blobToBase64(blob);
            window.__videoDone = true;
          } catch (error) {
            window.__videoError = String(error && error.message ? error.message : error);
            window.__videoDone = true;
          }
        };

        drawSlide(ctx, canvas, spec.slides[0] || { title: spec.title, bullets: [] }, 0, spec.slides.length || 1);
        recorder.start(250);

        let index = 0;
        const advance = () => {
          if (finished) {
            return;
          }
          drawSlide(ctx, canvas, spec.slides[index] || { title: spec.title, bullets: [] }, index, spec.slides.length || 1);
          index += 1;
          if (index < spec.slides.length) {
            setTimeout(advance, spec.secondsPerSlide * 1000);
            return;
          }
          finished = true;
          setTimeout(() => recorder.stop(), 600);
        };

        advance();
      } catch (error) {
        window.__videoError = String(error && error.message ? error.message : error);
        window.__videoDone = true;
      }
    })();
  </script>
</body>
</html>`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, retries = 60) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      // Retry until the browser comes up.
    }
    await sleep(500);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let messageId = 0;

  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) {
        reject(new Error(payload.error.message || "CDP error"));
      } else {
        resolve(payload.result || {});
      }
    }
  };

  const ready = new Promise((resolve, reject) => {
    socket.onopen = () => resolve();
    socket.onerror = (error) => reject(error);
  });

  async function send(method, params = {}) {
    await ready;
    messageId += 1;
    const id = messageId;
    const promise = new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
    socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  async function close() {
    try {
      socket.close();
    } catch (error) {
      // Ignore close errors.
    }
  }

  return { send, close };
}

async function renderVideoWithBrowser(htmlPath, outputPath) {
  const executable = findBrowserExecutable();
  const port = 9234;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "slide-video-profile-"));
  const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;
  const browser = spawn(executable, [
    "--headless",
    "--disable-gpu",
    "--mute-audio",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${port}`,
    "--allow-file-access-from-files",
    fileUrl,
  ], {
    stdio: "ignore",
    windowsHide: true,
  });

  try {
    const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`);
    const pageTarget = targets.find((item) => item.type === "page" && item.url.startsWith("file:///"));
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error("Could not find a debuggable page target for video rendering.");
    }

    const client = createCdpClient(pageTarget.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    for (let attempt = 0; attempt < 360; attempt += 1) {
      const result = await client.send("Runtime.evaluate", {
        expression: "({done: !!window.__videoDone, error: window.__videoError || '', base64: window.__videoBase64 || ''})",
        returnByValue: true,
      });
      const value = result?.result?.value || {};
      if (value.done) {
        if (value.error) {
          throw new Error(`Browser render failed: ${value.error}`);
        }
        writeBuffer(outputPath, Buffer.from(value.base64, "base64"));
        await client.close();
        return;
      }
      await sleep(500);
    }

    await client.close();
    throw new Error("Timed out waiting for browser video render to finish.");
  } finally {
    try {
      browser.kill();
    } catch (error) {
      // Ignore kill errors.
    }
  }
}

async function main() {
  const { slug } = parseArgs();
  if (!slug) {
    throw new Error("Use --slug <reading-slug>.");
  }

  const reading = findReading(slug);
  const contentDir = path.join(ROOT_DIR, reading.content_dir);
  const specPath = path.join(contentDir, "video_slides.json");
  const outputPath = path.join(contentDir, "notebooklm.webm");
  if (!fs.existsSync(specPath)) {
    throw new Error(`Missing slide spec: ${specPath}`);
  }

  const spec = JSON.parse(readText(specPath));
  const htmlPath = path.join(contentDir, "_video_render.html");
  fs.writeFileSync(htmlPath, renderHtml(spec), "utf8");

  try {
    await renderVideoWithBrowser(htmlPath, outputPath);
  } finally {
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }
  }
  console.log(`[rendered] ${path.relative(ROOT_DIR, outputPath)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
