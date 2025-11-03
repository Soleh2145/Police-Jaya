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

// ==== HANDLE TOKEN (login callback) ====
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
    })
    .catch(() => {
      alert("Gagal login Discord. Coba lagi.");
      window.location.href = "index.html";
    });
}

// ==== CEK LOGIN & SET USER ====
const user = JSON.parse(localStorage.getItem("discordUser") || "{}");

function protectPage() {
  if (!user.id) {
    window.location.href = "index.html";
    return;
  }

  // tampilkan info user di navbar
  const discordContainer = document.getElementById("discordUser");
  const avatarImg = document.getElementById("avatar");
  const usernameSpan = document.getElementById("username");

  if (discordContainer && avatarImg && usernameSpan) {
    discordContainer.style.display = "flex";
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    usernameSpan.textContent = user.username;
  }

  // ==== CEK ADMIN ====
  const adminId = "1434896126242455664";
  const isAdmin = user.id === adminId;

  // sembunyikan atau tampilkan menu admin
  const adminTabs = document.querySelectorAll(".admin-only");
  adminTabs.forEach((tab) => {
    tab.style.display = isAdmin ? "inline-block" : "none";
  });
}

// ==== LOGOUT ====
function logout() {
  localStorage.removeItem("discordUser");
  window.location.href = "index.html";
}

// ==== PROTECT PAGE SAAT LOAD ====
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.href.includes("index.html")) {
    protectPage();
  }

  // tombol login di index
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", loginDiscord);

  // tombol logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
