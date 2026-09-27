"use strict";
function validEmail(value) { return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value); }
function validHttpsUrl(value) { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }
document.getElementById("generate").addEventListener("click", () => {
  const email = document.getElementById("contact").value.trim(), policy = document.getElementById("policy").value.trim(), date = document.getElementById("expires").value;
  if (!validEmail(email) || !date || (policy && !validHttpsUrl(policy))) { document.getElementById("status").textContent = "メール、HTTPSのポリシーURL、有効期限を確認してください。"; return; }
  const expires = new Date(`${date}T23:59:59Z`); if (Number.isNaN(expires.getTime()) || expires <= new Date()) { document.getElementById("status").textContent = "有効期限には未来の日付を指定してください。"; return; }
  document.getElementById("security-output").value = `Contact: mailto:${email}\n${policy ? `Policy: ${policy}\n` : ""}Expires: ${expires.toISOString()}`;
  document.getElementById("status").textContent = "security.txt を生成しました。";
});
document.getElementById("llms").addEventListener("click", () => { const name = document.getElementById("site-name").value.trim(), url = document.getElementById("site-url").value.trim(); if (!name || !validHttpsUrl(url)) { document.getElementById("status").textContent = "サイト名とHTTPS URLを入力してください。"; return; } document.getElementById("llms-output").value = `# ${name}\n\n> ${name} の概要。\n\n## 主要ページ\n\n- [ホーム](${url})\n\n## 利用上の注意\n\n- 各ページの利用条件と更新日を確認してください。`; document.getElementById("status").textContent = "llms.txt を生成しました。内容をサイトに合わせて編集してください。"; });
document.getElementById("dmarc").addEventListener("click", () => { const domain = document.getElementById("domain").value.trim().toLowerCase(), rua = document.getElementById("rua").value.trim(), policy = document.getElementById("policy-mode").value; if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain) || (rua && !validEmail(rua))) { document.getElementById("status").textContent = "有効なドメインとレポート用メールを入力してください。"; return; } document.getElementById("dmarc-output").value = `_dmarc.${domain} TXT "v=DMARC1; p=${policy}; rua=mailto:${rua || `postmaster@${domain}`}; adkim=r; aspf=r; pct=100"`; document.getElementById("status").textContent = "DMARC レコードを生成しました。導入前に SPF/DKIM と集計先を確認してください。"; });
