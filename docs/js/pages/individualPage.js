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
    const startLeft = Math.random() * 100;
    const size = Math.random() * 4 + 4;
    const duration = Math.random() * 6 + 6;
    const delay = Math.random() * 2;
    snowflake.style.left = `${startLeft}%`;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.animationDelay = `${delay}s`;
    snowflake.style.opacity = `${Math.random() * 0.5 + 0.35}`;
    const driftOffset = Math.random() * 20 + 10;
    const direction = Math.random() > 0.5 ? 1 : -1;
    snowflake.style.setProperty("--drift-start", `${direction * -driftOffset}px`);
    snowflake.style.setProperty("--drift-mid", `${direction * driftOffset}px`);
    snowflake.style.setProperty("--drift-end", `${direction * -driftOffset}px`);
    container.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), (duration + delay) * 1000);
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
