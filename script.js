// =========================================================
// UTIL
// =========================================================
const rand = (min, max) => Math.random() * (max - min) + min;

// =========================================================
// LOADING SCREEN
// =========================================================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1400);
});

// =========================================================
// AMBIENT FLOATING HEARTS
// =========================================================
function spawnHeart() {
  const layer = document.getElementById("ambientHearts");
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.innerHTML = "❤";
  const size = rand(12, 26);
  heart.style.left = rand(0, 100) + "vw";
  heart.style.fontSize = size + "px";
  heart.style.setProperty("--drift", rand(-60, 60) + "px");
  const duration = rand(9, 17);
  heart.style.animationDuration = duration + "s";
  layer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

function spawnSparkle() {
  const layer = document.getElementById("ambientSparkles");
  const sparkle = document.createElement("div");
  sparkle.className = "floating-sparkle";
  const size = rand(3, 7);
  sparkle.style.width = size + "px";
  sparkle.style.height = size + "px";
  sparkle.style.left = rand(0, 100) + "vw";
  sparkle.style.top = rand(0, 100) + "vh";
  const duration = rand(3, 6);
  sparkle.style.animationDuration = duration + "s";
  layer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), duration * 1000 + 500);
}

setInterval(spawnHeart, 800);
setInterval(spawnSparkle, 400);
for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 200);
for (let i = 0; i < 20; i++) setTimeout(spawnSparkle, i * 100);

// =========================================================
// PARALLAX GLOWS ON HERO (mouse + scroll)
// =========================================================
const heroParallax = document.getElementById("heroParallax");
window.addEventListener("mousemove", (e) => {
  if (!heroParallax) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  heroParallax.style.transform = `translate(${x}px, ${y}px)`;
});

window.addEventListener("scroll", () => {
  if (!heroParallax) return;
  const offset = window.scrollY * 0.3;
  heroParallax.style.setProperty("--scrollY", offset + "px");
  heroParallax.style.transform += ` translateY(${offset}px)`;
});

// =========================================================
// NAME CAROUSEL
// =========================================================
const nameWords = document.querySelectorAll(".name-word");
let nameIndex = 0;
function cycleNames() {
  nameWords.forEach((w) => w.classList.remove("active"));
  nameWords[nameIndex].classList.add("active");
  nameIndex = (nameIndex + 1) % nameWords.length;
}
if (nameWords.length) {
  cycleNames();
  setInterval(cycleNames, 2400);
}

// =========================================================
// OPEN MY HEART -> MUSIC CONSENT MODAL -> SCROLL TO PUZZLE
// =========================================================
const openHeartBtn = document.getElementById("openHeartBtn");
const consentOverlay = document.getElementById("consentOverlay");
const consentYes = document.getElementById("consentYes");
const consentNo = document.getElementById("consentNo");

function scrollToPuzzle() {
  document.getElementById("puzzleSection").scrollIntoView({ behavior: "smooth" });
}

if (openHeartBtn) {
  openHeartBtn.addEventListener("click", () => {
    consentOverlay.classList.add("show");
    consentOverlay.setAttribute("aria-hidden", "false");
  });
}

function closeConsent() {
  consentOverlay.classList.remove("show");
  consentOverlay.setAttribute("aria-hidden", "true");
}

if (consentYes) {
  consentYes.addEventListener("click", () => {
    closeConsent();
    showPlayer();
    musicPlayer.classList.remove("collapsed");
    playMusic();
    scrollToPuzzle();
  });
}

if (consentNo) {
  consentNo.addEventListener("click", () => {
    closeConsent();
    showPlayer();
    scrollToPuzzle();
  });
}

// =========================================================
// DRAGGABLE PUZZLE PIECE
// =========================================================
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzlePiece = document.getElementById("puzzlePiece");
const puzzleSlot = document.getElementById("puzzleSlot");
const puzzleHint = document.getElementById("puzzleHint");
const puzzleSuccess = document.getElementById("puzzleSuccess");
let puzzleSolved = false;

function getSnapThreshold() {
  return puzzleBoard.getBoundingClientRect().width * 0.18;
}

function dragStart(e) {
  if (puzzleSolved) return;
  e.preventDefault();
  const point = e.touches ? e.touches[0] : e;
  const pieceRect = puzzlePiece.getBoundingClientRect();
  const boardRect = puzzleBoard.getBoundingClientRect();

  const offsetX = point.clientX - pieceRect.left;
  const offsetY = point.clientY - pieceRect.top;

function move(ev) {
  const p = ev.touches ? ev.touches[0] : ev;

  let x = p.clientX - boardRect.left - offsetX;
  let y = p.clientY - boardRect.top - offsetY;

  const maxX = boardRect.width - pieceRect.width;
  const maxY = boardRect.height - pieceRect.height;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  puzzlePiece.style.left = (x / boardRect.width) * 100 + "%";
  puzzlePiece.style.top = (y / boardRect.height) * 100 + "%";
  puzzlePiece.style.transform = "rotate(6deg)";

  const inner = puzzlePiece.querySelector(".piece-inner");

  inner.style.backgroundPosition =
      `-${x}px -${y}px`;
}

  function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("touchend", up);
    checkSnap();
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  document.addEventListener("touchmove", move, { passive: false });
  document.addEventListener("touchend", up);
}

function checkSnap() {
  const pieceRect = puzzlePiece.getBoundingClientRect();
  const slotRect = puzzleSlot.getBoundingClientRect();
  const dx = pieceRect.left - slotRect.left;
  const dy = pieceRect.top - slotRect.top;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < getSnapThreshold()) {
    solvePuzzle();
  }
}

function solvePuzzle() {
  puzzleSolved = true;
  puzzlePiece.classList.add("snapped");
  puzzlePiece.style.left = "";
  puzzlePiece.style.top = "";
  puzzleHint.style.opacity = "0";
  launchConfetti();
  setTimeout(() => {
    puzzleSuccess.classList.add("show");
  }, 400);
  setTimeout(() => {
    document.getElementById("timelineSection").scrollIntoView({ behavior: "smooth" });
  }, 2400);
}

function launchConfetti() {
  const layer = document.getElementById("confettiHearts");
  const symbols = ["❤", "💕", "✨", "💖"];
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = symbols[Math.floor(rand(0, symbols.length))];
    piece.style.left = rand(0, 100) + "%";
    piece.style.animationDelay = rand(0, 0.4) + "s";
    piece.style.color = Math.random() > 0.5 ? "#b76e79" : "#c9a7eb";
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

if (puzzlePiece) {
  puzzlePiece.addEventListener("mousedown", dragStart);
  puzzlePiece.addEventListener("touchstart", dragStart, { passive: false });

  // keyboard fallback for accessibility
  puzzlePiece.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      solvePuzzle();
    }
  });
}

// =========================================================
// SCROLL REVEAL FOR MEMORY CARDS
// =========================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll(".memory-card").forEach((card) => revealObserver.observe(card));

// =========================================================
// PREMIUM FLOATING MUSIC PLAYER
// =========================================================
const bgMusic = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const playerVinyl = document.getElementById("playerVinyl");
const playerPlayPause = document.getElementById("playerPlayPause");
const iconPlay = playerPlayPause ? playerPlayPause.querySelector(".icon-play") : null;
const iconPause = playerPlayPause ? playerPlayPause.querySelector(".icon-pause") : null;
const playerProgress = document.getElementById("playerProgress");
const playerCurrentTime = document.getElementById("playerCurrentTime");
const playerDuration = document.getElementById("playerDuration");
const playerVolume = document.getElementById("playerVolume");
const playerCollapseBtn = document.getElementById("playerCollapseBtn");
const playerVisualizer = document.getElementById("playerVisualizer");
const visualizerBars = playerVisualizer ? playerVisualizer.querySelectorAll("span") : [];

let audioCtx, analyser, sourceNode, freqData;
let rafId = null;

function showPlayer() {
  if (!musicPlayer) return;
  musicPlayer.classList.add("visible");
  musicPlayer.setAttribute("aria-hidden", "false");
}

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function setPlayingUI(isPlaying) {
  musicPlayer.classList.toggle("playing", isPlaying);
  if (iconPlay && iconPause) {
    iconPlay.style.display = isPlaying ? "none" : "block";
    iconPause.style.display = isPlaying ? "block" : "none";
  }
  playerPlayPause.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function initAudioGraph() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    sourceNode = audioCtx.createMediaElementSource(bgMusic);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    freqData = new Uint8Array(analyser.frequencyBinCount);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  } catch (err) {
    // Web Audio unavailable (e.g. very old browser) — visualizer falls back to idle state.
    audioCtx = null;
  }
}

function animateVisualizer() {
  if (analyser && freqData) {
    analyser.getByteFrequencyData(freqData);
    const step = Math.floor(freqData.length / visualizerBars.length);
    visualizerBars.forEach((bar, i) => {
      const value = freqData[i * step] || 0;
      const height = 4 + (value / 255) * 14;
      bar.style.height = height + "px";
    });
  }
  rafId = requestAnimationFrame(animateVisualizer);
}

function stopVisualizerIdle() {
  visualizerBars.forEach((bar) => (bar.style.height = "4px"));
}

function playMusic() {
  if (!bgMusic) return;
  initAudioGraph();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  bgMusic
    .play()
    .then(() => {
      setPlayingUI(true);
      if (!rafId) animateVisualizer();
    })
    .catch(() => {
      // File missing or autoplay blocked; leave UI in paused state.
      setPlayingUI(false);
    });
}

function pauseMusic() {
  bgMusic.pause();
  setPlayingUI(false);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  stopVisualizerIdle();
}

if (playerPlayPause) {
  playerPlayPause.addEventListener("click", () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });
}

if (playerVinyl) {
  playerVinyl.addEventListener("click", () => {
    playerPlayPause.click();
  });
}

if (bgMusic) {
  bgMusic.addEventListener("timeupdate", () => {
    if (!bgMusic.duration) return;
    const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
    playerProgress.value = pct;
    playerProgress.style.setProperty("--progress", pct + "%");
    playerCurrentTime.textContent = formatTime(bgMusic.currentTime);
  });

  bgMusic.addEventListener("loadedmetadata", () => {
    playerDuration.textContent = formatTime(bgMusic.duration);
  });

  bgMusic.addEventListener("ended", () => {
    // loop attribute handles replay; keep UI in sync just in case.
    setPlayingUI(!bgMusic.paused);
  });
}

if (playerProgress) {
  playerProgress.addEventListener("input", () => {
    if (!bgMusic.duration) return;
    const time = (playerProgress.value / 100) * bgMusic.duration;
    bgMusic.currentTime = time;
    playerProgress.style.setProperty("--progress", playerProgress.value + "%");
  });
}

if (playerVolume) {
  bgMusic.volume = parseFloat(playerVolume.value);
  playerVolume.style.setProperty("--vol", playerVolume.value * 100 + "%");
  playerVolume.addEventListener("input", () => {
    bgMusic.volume = parseFloat(playerVolume.value);
    playerVolume.style.setProperty("--vol", playerVolume.value * 100 + "%");
  });
}

if (playerCollapseBtn) {
  playerCollapseBtn.addEventListener("click", () => {
    musicPlayer.classList.toggle("collapsed");
    playerCollapseBtn.setAttribute(
      "aria-label",
      musicPlayer.classList.contains("collapsed") ? "Expand player" : "Collapse player"
    );
  });
}

// =========================================================
// ENDING: ONE MORE HUG
// =========================================================
const hugBtn = document.getElementById("hugBtn");
const hugOverlay = document.getElementById("hugOverlay");
const hugHearts = document.getElementById("hugHearts");
const restartBtn = document.getElementById("restartBtn");

function fillHugHearts() {
  hugHearts.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = "❤";
    heart.style.left = rand(0, 100) + "vw";
    heart.style.fontSize = rand(14, 30) + "px";
    heart.style.setProperty("--drift", rand(-80, 80) + "px");
    heart.style.animationDuration = rand(4, 9) + "s";
    heart.style.animationDelay = rand(0, 2) + "s";
    hugHearts.appendChild(heart);
  }
}

if (hugBtn) {
  hugBtn.addEventListener("click", () => {
    fillHugHearts();
    hugOverlay.classList.add("show");
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    hugOverlay.classList.remove("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
    puzzleSolved = false;
    puzzlePiece.classList.remove("snapped");
    puzzleSuccess.classList.remove("show");
    puzzleHint.style.opacity = "1";
  });
}
