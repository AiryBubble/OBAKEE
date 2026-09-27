"use strict";
const source = document.getElementById("source"), output = document.getElementById("output"), status = document.getElementById("status");
function transform(minify) {
  const kind = document.getElementById("language").value, text = source.value;
  if (text.length > 200000) { status.textContent = "入力は200,000文字以内にしてください。"; return; }
  if (minify) {
    let out = "", i = 0, quote = "", comment = false, lineComment = false, space = false;
    while (i < text.length) {
      const c = text[i], n = text[i + 1];
      if (comment) { if (c === "*" && n === "/") { comment = false; i += 2; } else i++; continue; }
      if (lineComment) { if (c === "\n" || c === "\r") lineComment = false; else { i++; continue; } }
      if (quote) { out += c; if (c === "\\" && i + 1 < text.length) out += text[++i]; else if (c === quote) quote = ""; i++; continue; }
      if ((kind === "css" || kind === "js") && c === "/" && n === "*") { comment = true; i += 2; continue; }
      if (kind === "js" && c === "/" && n === "/") { lineComment = true; i += 2; continue; }
      if (c === "'" || c === '"' || (kind === "js" && c === "`")) { if (space && /[\w$]/.test(out.at(-1) || "") && /[\w$]/.test(c)) out += " "; space = false; quote = c; out += c; i++; continue; }
      if (/\s/.test(c)) { space = true; i++; continue; }
      if (space && /[\w$]/.test(out.at(-1) || "") && /[\w$]/.test(c)) out += " ";
      space = false; out += c; i++;
    }
    output.value = out.trim();
  } else {
    let out = "", depth = 0, quote = "", comment = false, lineComment = false, line = "";
    const compact = text.replace(/\r\n?/g, "\n").split("\n");
    for (const raw of compact) {
      const trimmed = raw.trim(); if (!trimmed) continue;
      if (kind === "html") {
        const parts = trimmed.replace(/>\s*</g, ">\n<").split("\n");
        for (const part of parts) { const p = part.trim(); if (/^<\//.test(p)) depth = Math.max(0, depth - 1); out += "  ".repeat(depth) + p + "\n"; if (/^<[A-Za-z][^>]*>$/.test(p) && !/\/>$/.test(p) && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(p)) depth++; }
      } else {
        line = ""; quote = ""; comment = false; lineComment = false;
        for (let i = 0; i < trimmed.length; i++) { const c = trimmed[i], n = trimmed[i + 1]; if (comment) { line += c; if (c === "*" && n === "/") { line += n; i++; comment = false; } continue; } if (lineComment) { line += c; continue; } if (quote) { line += c; if (c === "\\" && i + 1 < trimmed.length) line += trimmed[++i]; else if (c === quote) quote = ""; continue; } if (c === "'" || c === '"' || (kind === "js" && c === "`")) quote = c; if (c === "/" && n === "*") comment = true; if (kind === "js" && c === "/" && n === "/") lineComment = true; if (c === "}" || c === ";" || (kind === "js" && c === "{")) { out += "  ".repeat(Math.max(0, depth)) + line.trim() + "\n"; if (c === "}") depth = Math.max(0, depth - 1); if (c === "{") depth++; line = ""; } else line += c; }
        if (line.trim()) out += "  ".repeat(Math.max(0, depth)) + line.trim() + "\n";
      }
    }
    output.value = out.trim();
  }
  status.textContent = "完了しました。";
}
document.getElementById("beautify").addEventListener("click", () => transform(false));
document.getElementById("minify").addEventListener("click", () => transform(true));
document.getElementById("copy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(output.value); status.textContent = "コピーしました。"; } catch { status.textContent = "コピーできませんでした。出力を選択してコピーしてください。"; } });
