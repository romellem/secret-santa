function renderEmojiRow(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const emojis = ["🎄", "🎁", "❄️", "🎅", "🤶", "🧦", "⛄️", "⛷️", "🥧", "🍪"];
  const selection = Array.from({ length: 6 }, () => {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }).join(" ");
  element.textContent = selection;
}

let snowIntervalId = null;
const MAX_SNOWFLAKES = 80;

function startSnow() {
  stopSnow();
  const container = document.getElementById("snow-container");
  if (!container) return;

  const createSnowflake = () => {
    if (!container) return;
    if (container.childElementCount >= MAX_SNOWFLAKES) {
      return;
    }
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    const inner = document.createElement("span");
    snowflake.appendChild(inner);

    const startLeft = Math.random() * 100;
    const size = Math.random() * 4 + 4;
    const fallDuration = Math.random() * 6 + 6;
    const driftDuration = Math.random() * 4 + 4;
    const driftDistance = Math.random() * 20 + 10;
    const phaseOffset = Math.random() * fallDuration;

    snowflake.style.left = `${startLeft}%`;
    snowflake.style.setProperty("--drift-duration", `${driftDuration}s`);
    snowflake.style.setProperty("--drift-distance", `${driftDistance}px`);
    snowflake.style.animationDelay = `-${phaseOffset}s`;

    inner.style.setProperty("--flake-size", `${size}px`);
    inner.style.setProperty("--fall-duration", `${fallDuration}s`);
    inner.style.animationDelay = `-${phaseOffset}s`;

    container.appendChild(snowflake);
    const remaining = Math.max(fallDuration - (phaseOffset % fallDuration), 0.2);
    setTimeout(() => snowflake.remove(), remaining * 1000);
  };

  for (let i = 0; i < MAX_SNOWFLAKES; i++) {
    setTimeout(createSnowflake, Math.random() * 2000);
  }

  snowIntervalId = setInterval(() => {
    createSnowflake();
  }, 400);
}

function stopSnow() {
  if (snowIntervalId) {
    clearInterval(snowIntervalId);
    snowIntervalId = null;
  }
  const container = document.getElementById("snow-container");
  if (container) {
    container.innerHTML = "";
  }
}

export function renderIndividualPage(state) {
  document.getElementById("person-name").textContent = state.giver || "";
  document.getElementById("pairing-name").textContent = state.receiver || "";
  renderEmojiRow("pairing-emoji-top");
  renderEmojiRow("pairing-emoji-bottom");
  startSnow();
}

export function clearIndividualPageEffects() {
  stopSnow();
}
