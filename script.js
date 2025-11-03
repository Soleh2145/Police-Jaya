// Cek login dan simpan data user Discord
function checkLogin(adminIDs = []) {
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    localStorage.setItem("discord_token", token);
    window.location.hash = "";
  }

  const token = localStorage.getItem("discord_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      localStorage.setItem("discord_id", user.id);
      localStorage.setItem("discord_name", user.username);

      if (adminIDs.includes(user.id)) {
        document.getElementById("adminTab").style.display = "inline-block";
      }
    })
    .catch(() => {
      localStorage.removeItem("discord_token");
      window.location.href = "login.html";
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// Lindungi halaman admin
function protectAdmin(adminIDs = []) {
  const token = localStorage.getItem("discord_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (!adminIDs.includes(user.id)) {
        alert("🚫 Kamu tidak memiliki akses ke halaman ini!");
        window.location.href = "beranda.html";
      }
    })
    .catch(() => {
      localStorage.clear();
      window.location.href = "login.html";
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}