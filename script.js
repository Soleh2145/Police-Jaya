// ==== CONFIG DISCORD LOGIN ====
const clientId = "1434896126242455664";
const redirectUri = "https://police-jaya.vercel.app/beranda.html";
const scope = "identify email";

function loginDiscord() {
  const oauth2Url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${encodeURIComponent(scope)}`;
  window.location.href = oauth2Url;
}

// ==== HANDLE TOKEN ====
const hash = window.location.hash;
if (hash.includes("access_token")) {
  const params = new URLSearchParams(hash.substring(1));
  const token = params.get("access_token");

  fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((user) => {
      localStorage.setItem("discordUser", JSON.stringify(user));
      window.location.href = "beranda.html";
    });
}

// ==== CEK LOGIN DI SETIAP HALAMAN ====
function protectPage() {
  const user = JSON.parse(localStorage.getItem("discordUser") || "{}");
  if (!user.id) {
    window.location.href = "index.html";
  } else {
    const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    document.getElementById("discordUser").style.display = "flex";
    document.getElementById("avatar").src = avatar;
    document.getElementById("username").textContent = user.username;
  }
}

function logout() {
  localStorage.removeItem("discordUser");
  window.location.href = "index.html";
}
