"use strict";
const choiceInput = document.getElementById("choices"), spin = document.getElementById("spin"), result = document.getElementById("result");
let locked = false;
function unbiasedIndex(max) { const limit = Math.floor(0x100000000 / max) * max, word = new Uint32Array(1); do { crypto.getRandomValues(word); } while (word[0] >= limit); return word[0] % max; }
spin.addEventListener("click", () => { if (locked) return; const choices = choiceInput.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean); if (choices.length < 2 || choices.length > 200 || choices.some(x => x.length > 200)) { document.getElementById("status").textContent = "空行以外で2〜200件、各200文字以内にしてください。"; return; } result.textContent = choices[unbiasedIndex(choices.length)]; locked = true; spin.disabled = true; choiceInput.readOnly = true; document.getElementById("status").textContent = "抽選結果を確定しました。"; });
document.getElementById("reset").addEventListener("click", () => { locked = false; spin.disabled = false; choiceInput.readOnly = false; result.textContent = "結果はここに表示されます"; document.getElementById("status").textContent = ""; });
