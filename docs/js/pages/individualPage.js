function renderEmojiRow(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const emojis = ["🎄", "🎁", "❄️", "🎅", "🤶", "🧦", "⛄️", "⛷️", "🥧", "🍪"];
  const selection = Array.from({ length: 6 }, () => {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }).join(" ");
  element.textContent = selection;
}

export function renderIndividualPage(state) {
  document.getElementById("person-name").textContent = state.giver || "";
  document.getElementById("pairing-name").textContent = state.receiver || "";
  renderEmojiRow("pairing-emoji-top");
  renderEmojiRow("pairing-emoji-bottom");
}
