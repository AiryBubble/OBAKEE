"use strict";

const choiceInput = document.getElementById("choices");
const spin = document.getElementById("spin");
const result = document.getElementById("result");
const status = document.getElementById("status");
const wheel = document.getElementById("wheel");
const removeWinner = document.getElementById("removeWinner");
let spinning = false;
let lastWinner = "";
let rotation = 0;

function unbiasedIndex(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const word = new Uint32Array(1);
  do { crypto.getRandomValues(word); } while (word[0] >= limit);
  return word[0] % max;
}

function getChoices() {
  return choiceInput.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function spinWheel() {
  if (spinning) return;
  let choices = getChoices();
  if (choices.length < 2 || choices.length > 200 || choices.some((item) => item.length > 200)) {
    status.textContent = "空行以外で2〜200件、各200文字以内にしてください。";
    return;
  }

  if (removeWinner.checked && lastWinner) {
    const remaining = choices.filter((item) => item !== lastWinner);
    if (remaining.length < 2) {
      status.textContent = remaining.length === 0
        ? "前回の当選項目を除くと候補がありません。除外をオフにするか候補を追加してください。"
        : "前回の当選項目を除くと候補が1件です。候補を追加してください。";
      return;
    }
    choices = remaining;
  }

  spinning = true;
  spin.disabled = true;
  choiceInput.readOnly = true;
  result.textContent = "回転中…";
  status.textContent = removeWinner.checked && lastWinner
    ? "前回の当選項目を除いて抽選しています。"
    : "ルーレットを回しています。";

  const winnerIndex = unbiasedIndex(choices.length);
  const winner = choices[winnerIndex];
  const slice = 360 / choices.length;
  const target = 360 - (winnerIndex + 0.5) * slice;
  rotation += 360 * 6 + target;
  wheel.classList.add("spinning");
  wheel.style.transform = `rotate(${rotation - 360 * 6 - target}deg)`;
  void wheel.offsetWidth;
  wheel.style.transform = `rotate(${rotation}deg)`;

  let settled = false;
  const finishSpin = () => {
    if (settled) return;
    settled = true;
    wheel.removeEventListener("transitionend", onTransitionEnd);
    lastWinner = winner;
    result.textContent = winner;
    status.textContent = "抽選結果を確定しました。もう一度回せます。";
    spin.disabled = false;
    spinning = false;
  };
  const onTransitionEnd = (event) => {
    if (event.target === wheel && event.propertyName === "transform") finishSpin();
  };
  wheel.addEventListener("transitionend", onTransitionEnd);
  window.setTimeout(finishSpin, 4500);
}

spin.addEventListener("click", spinWheel);
document.getElementById("reset").addEventListener("click", () => {
  lastWinner = "";
  result.textContent = "結果はここに表示されます";
  status.textContent = "候補を編集して、ルーレットを回せます。";
  choiceInput.readOnly = false;
  spin.disabled = false;
});
