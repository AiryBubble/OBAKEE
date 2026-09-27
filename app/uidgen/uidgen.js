"use strict";
const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const nanoAlphabet = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomBytes(size) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytes; }
function randomIndex(max) {
  const ceiling = Math.floor(0x100000000 / max) * max;
  const word = new Uint32Array(1);
  do { crypto.getRandomValues(word); } while (word[0] >= ceiling);
  return word[0] % max;
}
function uuid() { return crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = randomIndex(16); return (c === "x" ? r : (r & 3) | 8).toString(16); }); }
function ulid() {
  let time = Date.now();
  let timePart = "";
  for (let i = 0; i < 10; i++) { timePart = alphabet[time % 32] + timePart; time = Math.floor(time / 32); }
  const bytes = randomBytes(10);
  let bits = 0, value = 0, randomPart = "";
  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { bits -= 5; randomPart += alphabet[(value >>> bits) & 31]; } }
  return timePart + randomPart;
}
function nanoid() { let out = ""; while (out.length < 21) { for (const byte of randomBytes(32)) { if (byte < 256 - (256 % nanoAlphabet.length)) out += nanoAlphabet[byte % nanoAlphabet.length]; if (out.length === 21) break; } } return out; }
const results = document.getElementById("results");
document.getElementById("generate").addEventListener("click", () => {
  const count = Math.max(1, Math.min(100, Number.parseInt(document.getElementById("id-count").value, 10) || 1));
  document.getElementById("id-count").value = count;
  const make = { uuid, ulid, nanoid }[document.getElementById("id-type").value] || uuid;
  results.replaceChildren();
  for (let i = 0; i < count; i++) {
    const item = document.createElement("li"), value = document.createElement("code"), button = document.createElement("button");
    value.textContent = make(); button.type = "button"; button.textContent = "コピー";
    button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(value.textContent); button.textContent = "コピーしました"; setTimeout(() => button.textContent = "コピー", 1200); } catch { document.getElementById("status").textContent = "クリップボードにアクセスできません。IDを選択してコピーしてください。"; } });
    item.append(value, button); results.append(item);
  }
  document.getElementById("status").textContent = `${count}件生成しました。`;
});
