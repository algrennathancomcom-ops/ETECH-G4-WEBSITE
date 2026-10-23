const canvas = document.querySelector(".spidey-run-canvas");
const stage = document.querySelector(".spidey-run-stage");
const overlay = document.querySelector(".spidey-run-overlay");
const overlayTitle = overlay.querySelector(".spidey-run-overlay-title");
const overlayText = overlay.querySelector(".spidey-run-overlay-text");
const scoreEl = document.querySelector(".spidey-run-score");
const bestEl = document.querySelector(".spidey-run-best");
const ctx = canvas.getContext("2d");

const BASE_W = 960;
const H = 320;
const MIN_STAGE_HEIGHT = 200;
const GROUND_Y = 268;
const HERO_X = 92;
const GRAVITY = 2600;
const JUMP_VELOCITY = -900;
const START_SPEED = 360;
const MAX_SPEED = 820;
const BEST_KEY = "spidey-run-best";

const COLORS = {
  suit: "#d81f2a",
  suitDark: "#8c1018",
  red: "#ff173d",
  ink: "#0b0b10",
  white: "#ffffff",
};

let best = Number(window.localStorage.getItem(BEST_KEY)) || 0;
let state = "ready";
let world = 0;
let speed = START_SPEED;
let feetY = GROUND_Y;
let riseVelocity = 0;
let onGround = true;
let runPhase = 0;
let obstacles = [];
let nextObstacleAt = 0;
let restartLockUntil = 0;
let viewScale = 1;
let W = BASE_W;

const rand01 = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const pad = (n) => String(n).padStart(5, "0");
const score = () => Math.floor(world / 45);

// Fixed logical height keeps the hero readable on a narrow phone stage; the
// visible world just gets shorter instead of the sprites shrinking.
const fitCanvas = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssWidth = canvas.clientWidth || BASE_W;
  const cssHeight = Math.max(Math.round(cssWidth * (H / BASE_W)), MIN_STAGE_HEIGHT);
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  viewScale = canvas.height / H;
  W = canvas.width / viewScale;
};

const reset = () => {
  world = 0;
  speed = START_SPEED;
  feetY = GROUND_Y;
  riseVelocity = 0;
  onGround = true;
  runPhase = 0;
  obstacles = [];
  nextObstacleAt = 700;
};

const showOverlay = (title, text) => {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.remove("is-hidden");
};

const makeBuilding = (x) => ({
  x,
  w: 30 + Math.random() * 26,
  h: 44 + Math.random() * 66,
  seed: Math.floor(Math.random() * 9000),
});

const spawnObstacles = () => {
  if (world < nextObstacleAt) return;
  const building = makeBuilding(W + 40);
  obstacles.push(building);
  if (Math.random() < 0.28) {
    obstacles.push(makeBuilding(W + 40 + building.w + 16 + Math.random() * 20));
  }
  nextObstacleAt = world + speed * (0.8 + Math.random() * 0.8);
};

const hitsHero = (b) => {
  const heroLeft = HERO_X - 11;
  const heroRight = HERO_X + 11;
  const heroTop = feetY - 50;
  const heroBottom = feetY - 2;
  const bTop = GROUND_Y - b.h;
  return heroRight > b.x + 3 && heroLeft < b.x + b.w - 3 && heroBottom > bTop + 4;
};

const endRun = () => {
  state = "over";
  restartLockUntil = performance.now() + 450;
  const finalScore = score();
  if (finalScore > best) {
    best = finalScore;
    window.localStorage.setItem(BEST_KEY, String(best));
  }
  showOverlay("BUSTED", `Score ${pad(finalScore)}  -  press space or tap to run it back`);
};

const jump = () => {
  if (state === "running") {
    if (onGround) {
      onGround = false;
      riseVelocity = JUMP_VELOCITY;
    }
    return;
  }
  if (performance.now() < restartLockUntil) return;
  reset();
  state = "running";
  overlay.classList.add("is-hidden");
};

const update = (dt) => {
  world += speed * dt;
  speed = Math.min(MAX_SPEED, START_SPEED + world * 0.02);
  runPhase += dt * (speed / 58);

  if (!onGround) {
    riseVelocity += GRAVITY * dt;
    feetY += riseVelocity * dt;
    if (feetY >= GROUND_Y) {
      feetY = GROUND_Y;
      riseVelocity = 0;
      onGround = true;
    }
  }

  spawnObstacles();
  obstacles.forEach((b) => { b.x -= speed * dt; });
  obstacles = obstacles.filter((b) => b.x + b.w > -30);
  if (obstacles.some(hitsHero)) endRun();

  scoreEl.textContent = pad(score());
  bestEl.textContent = `HI ${pad(best)}`;
};

const drawSky = () => {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, "#04040a");
  sky.addColorStop(0.62, "#12060c");
  sky.addColorStop(1, "#2a0a12");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, GROUND_Y);

  const moonX = W - 150 - ((world * 0.05) % (W + 300));
  const glow = ctx.createRadialGradient(moonX, 92, 10, moonX, 92, 96);
  glow.addColorStop(0, "rgba(255, 23, 61, 0.34)");
  glow.addColorStop(1, "rgba(255, 23, 61, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(moonX - 100, -8, 200, 200);
  ctx.strokeStyle = "rgba(255, 23, 61, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(moonX, 92, 54, 0, Math.PI * 2);
  ctx.stroke();
};

const drawSkyline = (parallax, unit, color, seedBase, litRatio) => {
  const offset = (world * parallax) % unit;
  const first = Math.floor((world * parallax) / unit);
  for (let i = -1; i * unit - offset < W + unit; i += 1) {
    const id = first + i + seedBase;
    const height = 46 + rand01(id) * 118;
    const width = unit * (0.6 + rand01(id + 401) * 0.32);
    const x = i * unit - offset;
    ctx.fillStyle = color;
    ctx.fillRect(x, GROUND_Y - height, width, height);
    if (litRatio > 0) {
      for (let r = 0; r < Math.floor(height / 26); r += 1) {
        for (let c = 0; c < Math.floor(width / 18); c += 1) {
          if (rand01(id * 13 + r * 7 + c) > litRatio) {
            ctx.fillStyle = "rgba(255, 23, 61, 0.5)";
            ctx.fillRect(x + 6 + c * 18, GROUND_Y - height + 10 + r * 26, 5, 7);
          }
        }
      }
    }
  }
};

const drawGround = () => {
  ctx.fillStyle = "#08080d";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = COLORS.red;
  ctx.fillRect(0, GROUND_Y - 2, W, 3);

  ctx.fillStyle = "rgba(255, 23, 61, 0.3)";
  const dash = 48;
  for (let x = -(world % dash); x < W; x += dash) {
    ctx.fillRect(x, GROUND_Y + 18, 24, 3);
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  const dash2 = 74;
  for (let x = -((world * 1.4) % dash2); x < W; x += dash2) {
    ctx.fillRect(x, GROUND_Y + 34, 34, 2);
  }
};

const drawBuilding = (b) => {
  const top = GROUND_Y - b.h;
  ctx.fillStyle = "#130d12";
  ctx.fillRect(b.x, top, b.w, b.h);
  ctx.strokeStyle = COLORS.red;
  ctx.lineWidth = 2;
  ctx.strokeRect(b.x + 1, top + 1, b.w - 2, b.h - 2);

  const cols = Math.floor((b.w - 12) / 12);
  const rows = Math.floor((b.h - 14) / 16);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lit = rand01(b.seed + (r * 7) + (c * 13)) > 0.52;
      ctx.fillStyle = lit ? "rgba(255, 23, 61, 0.9)" : "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(b.x + 7 + c * 12, top + 8 + r * 16, 6, 8);
    }
  }
};

const strokePath = (points, width, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
  ctx.stroke();
};

const drawEye = (x, y, rx, ry, tilt) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();
  ctx.restore();
};

const drawHero = () => {
  const cx = HERO_X;
  const hipY = feetY - 24;
  const shY = feetY - 44;
  const headY = feetY - 55;
  const frame = Math.floor(runPhase) % 2;
  let nearLeg;
  let farLeg;
  let nearArm;
  let farArm;

  if (!onGround) {
    nearLeg = [cx + 9, hipY + 7, cx + 4, hipY + 17];
    farLeg = [cx - 5, hipY + 9, cx - 13, hipY + 14];
    nearArm = [cx + 7, shY + 6, cx + 14, shY - 2];
    farArm = [cx - 6, shY + 8, cx - 13, shY + 2];
  } else if (frame === 0) {
    nearLeg = [cx + 7, hipY + 11, cx + 14, feetY];
    farLeg = [cx - 6, hipY + 11, cx - 13, feetY];
    nearArm = [cx - 5, shY + 9, cx - 12, shY + 14];
    farArm = [cx + 6, shY + 9, cx + 12, shY + 13];
  } else {
    nearLeg = [cx + 3, hipY + 12, cx + 5, feetY];
    farLeg = [cx - 3, hipY + 11, cx - 7, feetY - 5];
    nearArm = [cx + 5, shY + 9, cx + 11, shY + 14];
    farArm = [cx - 5, shY + 9, cx - 10, shY + 13];
  }

  const limb = (ox, oy, pts, width, color) => {
    const all = [ox, oy, pts[0], pts[1], pts[2], pts[3]];
    strokePath(all, width + 3, COLORS.ink);
    strokePath(all, width, color);
  };

  // far side first so the near side reads in front
  limb(cx, shY + 2, farArm, 5, COLORS.suitDark);
  limb(cx, hipY, farLeg, 5, COLORS.suitDark);

  limb(cx, hipY, nearLeg, 6, COLORS.suit);

  ctx.fillStyle = COLORS.suit;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cx - 8, shY - 4, 17, hipY - shY + 10, 7);
  ctx.fill();
  ctx.stroke();

  // spider emblem
  ctx.fillStyle = COLORS.ink;
  ctx.beginPath();
  ctx.ellipse(cx + 1, shY + 7, 2.6, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 2; i += 1) {
    const dir = i === 0 ? -1 : 1;
    ctx.moveTo(cx + 1, shY + 6);
    ctx.lineTo(cx + 1 + 5 * dir, shY + 1);
    ctx.moveTo(cx + 1, shY + 8);
    ctx.lineTo(cx + 1 + 5 * dir, shY + 11);
  }
  ctx.stroke();

  // head
  ctx.save();
  ctx.translate(cx + 2, headY);
  ctx.rotate(0.1);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.suit;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();
  ctx.lineWidth = 0.9;
  ctx.strokeStyle = "rgba(11, 11, 16, 0.55)";
  ctx.beginPath();
  for (let i = -1; i <= 1; i += 1) {
    ctx.moveTo(0, 8);
    ctx.lineTo(i * 7, -8.4);
  }
  ctx.moveTo(-9.6, -1);
  ctx.lineTo(9.6, -1);
  ctx.stroke();
  drawEye(4.2, -1.4, 5.4, 3.1, -0.36);
  drawEye(-5.2, -0.4, 3.4, 2.3, -0.18);
  ctx.restore();

  limb(cx, shY + 2, nearArm, 6, COLORS.suit);
};

const draw = () => {
  ctx.setTransform(viewScale, 0, 0, viewScale, 0, 0);
  drawSky();
  drawSkyline(0.16, 96, "#0f0f18", 0, 0);
  drawSkyline(0.38, 74, "#1a1017", 900, 0.82);
  drawGround();
  obstacles.forEach(drawBuilding);
  drawHero();
};

let lastFrame = performance.now();
let onScreen = true;

const frameLoop = (now) => {
  const dt = Math.min(0.034, (now - lastFrame) / 1000);
  lastFrame = now;
  if (onScreen) {
    if (state === "running") {
      update(dt);
    } else if (state === "ready") {
      world += 90 * dt;
      runPhase += dt * 1.6;
    }
    draw();
  }
  window.requestAnimationFrame(frameLoop);
};

// Keyed to the stage so Space keeps scrolling the page everywhere else.
stage.addEventListener("keydown", (event) => {
  if (event.code !== "Space" && event.code !== "ArrowUp" && event.code !== "KeyW") return;
  if (event.repeat) return;
  event.preventDefault();
  jump();
});

stage.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  stage.focus({ preventScroll: true });
  jump();
});

if ("IntersectionObserver" in window) {
  const stageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { onScreen = entry.isIntersecting; });
  }, { rootMargin: "160px" });
  stageObserver.observe(stage);
}

window.addEventListener("resize", fitCanvas);

fitCanvas();
reset();
bestEl.textContent = `HI ${pad(best)}`;
scoreEl.textContent = pad(0);
showOverlay("SPIDEY RUN", "Press space, up, or tap to jump the skyline");
window.requestAnimationFrame(frameLoop);
