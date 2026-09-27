"use strict";
const idInput = document.getElementById("user-id"), status = document.getElementById("status"), profile = document.getElementById("profile");
document.getElementById("lookup").addEventListener("click", async () => {
  const id = idInput.value.trim(); profile.hidden = true;
  if (!/^\d{17,20}$/.test(id)) { status.textContent = "17〜20桁の Discord ユーザー ID を入力してください。"; return; }
  status.textContent = "取得中…";
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${id}`, { headers: { Accept: "application/json" }, credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error(response.status === 404 ? "ユーザーが見つかりません。" : `Discord API エラー (${response.status})`);
    const data = await response.json();
    if (!data || data.id !== id) throw new Error("応答を確認できませんでした。");
    document.getElementById("username").textContent = data.global_name || data.username || "Discord ユーザー";
    const images = document.getElementById("images"); images.replaceChildren();
    const addImage = (label, url, alt) => { const box = document.createElement("figure"), caption = document.createElement("figcaption"), img = document.createElement("img"); caption.textContent = label; img.src = url; img.alt = alt; img.loading = "lazy"; img.referrerPolicy = "no-referrer"; box.append(caption, img); images.append(box); };
    if (data.avatar) { const ext = data.avatar.startsWith("a_") ? "gif" : "png"; addImage("アバター", `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.${ext}?size=512`, "Discord アバター"); }
    if (data.banner) { const ext = data.banner.startsWith("a_") ? "gif" : "png"; addImage("プロフィールバナー", `https://cdn.discordapp.com/banners/${id}/${data.banner}.${ext}?size=1024`, "Discord バナー"); }
    const color = data.banner_color;
    document.getElementById("banner-color").textContent = color ? `バナー色: ${color}` : (data.banner ? "画像バナーを表示しています。" : "バナーは設定されていません。");
    status.textContent = "取得しました。"; profile.hidden = false;
  } catch (error) { status.textContent = error instanceof TypeError ? "Discord に接続できませんでした。時間をおいて再度お試しください。" : error.message; }
});
