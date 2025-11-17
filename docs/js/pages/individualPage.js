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

function startSnow() {
  stopSnow();
  const container = document.getElementById("snow-container");
  if (!container) return;

  snowIntervalId = setInterval(() => {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    const startLeft = Math.random() * 100;
    const size = Math.random() * 3 + 3;
    const duration = Math.random() * 4 + 4;
    snowflake.style.left = `${startLeft}%`;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.animationDuration = `${duration}s`;
    container.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), duration * 1000);
  }, 600);
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
