let currentUser = "";

function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if ((username === "rino" && password === "rino") || (username === "wina" && password === "wina")) {
    localStorage.setItem("user", username);
    window.location.href = "game.html";
  } else {
    alert("Username atau password salah!");
  }
}

window.onload = function () {
  const user = localStorage.getItem("user");
  if (window.location.pathname.includes("game.html")) {
    if (!user) {
      window.location.href = "index.html";
    } else {
      document.getElementById("welcome").textContent = `Selamat datang, ${user}`;
      setupRealtime(user);
    }
  }
};

function choose(choice) {
  const user = localStorage.getItem("user");
  firebase.database().ref(`choices/${user}`).set({
    choice: choice,
    fight: false
  });
  alert(`Kamu memilih ${choice}`);
}

function fight() {
  const user = localStorage.getItem("user");
  firebase.database().ref(`choices/${user}/fight`).set(true);
}

function setupRealtime(currentUser) {
  firebase.database().ref('choices/').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.rino && data.wina) {
      if (data.rino.fight && data.wina.fight) {
        const p1 = data.rino.choice;
        const p2 = data.wina.choice;
        showResult(p1, p2, currentUser);
      }
    }
  });
}

function showResult(p1, p2, currentUser) {
  const lawan = currentUser === "rino" ? p2 : p1;
  const kamu = currentUser === "rino" ? p1 : p2;
  let hasil = "";

  if (kamu === lawan) {
    hasil = "Seri!";
  } else if (
    (kamu === "batu" && lawan === "gunting") ||
    (kamu === "gunting" && lawan === "kertas") ||
    (kamu === "kertas" && lawan === "batu")
  ) {
    hasil = "Kamu Menang! 🎉";
  } else {
    hasil = "Kamu Kalah 😢";
  }

  document.getElementById("result").innerHTML = `
    <p>Pilihan Kamu: ${kamu}</p>
    <p>Pilihan Lawan: ${lawan}</p>
    <h2>${hasil}</h2>
  `;
}
