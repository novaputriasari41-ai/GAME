/* script.js — versi lengkap untuk CTPS + Game Interaktif */

/* ========== TAMPILKAN TAHUN OTOMATIS ========== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ========== SIMULASI CTPS 20s ========== */
const simBtn = document.getElementById("simBtn");
const simProgress = document.getElementById("simProgress");
const simTime = document.getElementById("simTime");

const simStartSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
const simTickSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
const simEndSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

if (simBtn) {
  simBtn.addEventListener("click", () => {
    let waktu = 20;
    simBtn.disabled = true;
    simProgress.style.width = "0%";
    simTime.textContent = waktu + "s";
    try { simStartSound.play(); } catch(e){}
    const interval = setInterval(() => {
      waktu--;
      simTime.textContent = waktu + "s";
      simProgress.style.width = ((20 - waktu) / 20) * 100 + "%";
      try { simTickSound.play(); } catch(e){}
      if (waktu <= 0) {
        clearInterval(interval);
        try { simEndSound.play(); } catch(e){}
        simBtn.disabled = false;
        simTime.textContent = "Selesai ✅";
        setTimeout(() => {
          simTime.textContent = "20s";
          simProgress.style.width = "0%";
        }, 2000);
      }
    }, 1000);
  });
}

/* ========== QUIZ INTERAKTIF SEDERHANA ========== */
const quiz = [
  { q: "Apa kepanjangan dari CTPS?", opts: ["Cuci Tangan Pakai Sabun", "Cuci Tubuh Pakai Sabun"], a: 0 },
  { q: "Berapa lama waktu ideal mencuci tangan?", opts: ["5 detik", "20 detik"], a: 1 },
  { q: "CTPS dapat mencegah penyakit diare.", opts: ["Benar", "Salah"], a: 0 }
];

const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const startBtn = document.getElementById("startQuizBtn");

let cur = 0, score = 0, timer = null;

function renderQuiz() {
  if (cur >= quiz.length) {
    qEl.innerHTML = `✅ Selesai! Skor kamu: <b>${score}/${quiz.length}</b>`;
    optEl.innerHTML = "";
    return;
  }
  const q = quiz[cur];
  qEl.textContent = q.q;
  optEl.innerHTML = "";
  q.opts.forEach((o, i) => {
    const btn = document.createElement("button");
    btn.textContent = o;
    btn.className = "btn btn-outline";
    btn.onclick = () => {
      if (i === q.a) score++;
      cur++;
      renderQuiz();
    };
    optEl.appendChild(btn);
  });
}

if (startBtn) startBtn.onclick = () => {
  cur = 0; score = 0;
  renderQuiz();
};

/* ========== NAVIGASI ANTAR MENU (Home, Materi, Game, dll) ========== */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");
  const navLinks = document.getElementById("navLinks");
  const hambtn = document.getElementById("hambtn");

  function showSection(id) {
    sections.forEach(sec => {
      if (sec.id === id) {
        sec.classList.add("active");
        sec.classList.remove("hidden");
      } else {
        sec.classList.remove("active");
        sec.classList.add("hidden");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.section;
      showSection(target);
      if (window.innerWidth <= 780) navLinks.classList.remove("show");
    });
  });

  document.getElementById("openQuizBtn").addEventListener("click", () => {
    showSection("quiz");
  });

  if (hambtn && navLinks) {
    hambtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  showSection("home");
});

/* ========== MODE TERANG / GELAP ========== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".toggle");
  const dot = document.querySelector(".dot");

  if (toggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }

      if (dot) {
        dot.style.transform = "scale(1.3)";
        setTimeout(() => (dot.style.transform = ""), 150);
      }
    });
  }
});

/* ========== GAME INTERAKTIF CTPS (3 PILIHAN) ========== */
const gameArea = document.getElementById("gameArea");
const game1Btn = document.getElementById("game1Btn");
const game2Btn = document.getElementById("game2Btn");
const game3Btn = document.getElementById("game3Btn");

function loadGame(type){
  if(type === "urutan"){
    gameArea.innerHTML = `
      <h3>🧩 Susun Urutan Langkah CTPS</h3>
      <p>Urutkan langkah di bawah ini sesuai urutan yang benar!</p>
      <ul id="stepsList" style="list-style:none;padding:0;">
        <li draggable="true">Gunakan sabun</li>
        <li draggable="true">Basahi tangan</li>
        <li draggable="true">Bilas tangan</li>
        <li draggable="true">Keringkan tangan</li>
      </ul>
      <button class="btn btn-primary" id="checkOrder">Cek Urutan</button>
      <div id="resultOrder"></div>
    `;
    const ul = document.getElementById("stepsList");
    let dragItem = null;
    ul.querySelectorAll("li").forEach(li=>{
      li.ondragstart = e => dragItem = li;
      li.ondragover = e => e.preventDefault();
      li.ondrop = e => {
        if(dragItem && dragItem!==li){
          const tmp = li.textContent;
          li.textContent = dragItem.textContent;
          dragItem.textContent = tmp;
        }
      };
    });
    document.getElementById("checkOrder").onclick = ()=>{
      const correct = ["Basahi tangan","Gunakan sabun","Bilas tangan","Keringkan tangan"];
      const current = Array.from(ul.querySelectorAll("li")).map(li=>li.textContent);
      document.getElementById("resultOrder").innerHTML =
        JSON.stringify(current)===JSON.stringify(correct)
        ? "✅ Benar! Kamu menyusun langkah CTPS dengan tepat!"
        : "❌ Urutan belum benar, coba lagi!";
    };
  }
  else if(type === "sabun"){
    gameArea.innerHTML = `
      <h3>🧼 Tangkap Sabunnya!</h3>
      <canvas id="sabunGame" width="300" height="400" style="background:#e0fff4;border-radius:10px;"></canvas>
      <p>Gunakan tombol panah ← → untuk menangkap sabun!</p>
    `;
    const canvas = document.getElementById("sabunGame");
    const ctx = canvas.getContext("2d");
    let sabun = {x:Math.random()*260, y:0, size:30};
    let tangan = {x:130, y:370, w:60, h:10};
    let skor = 0;
    function loop(){
      ctx.clearRect(0,0,300,400);
      ctx.fillStyle="#28d8a3";
      ctx.fillRect(tangan.x, tangan.y, tangan.w, tangan.h);
      ctx.beginPath(); ctx.arc(sabun.x+15,sabun.y+15,15,0,Math.PI*2);
      ctx.fillStyle="#089981"; ctx.fill();
      sabun.y += 3;
      if(sabun.y>370 && sabun.x>tangan.x-20 && sabun.x<tangan.x+tangan.w){
        skor++; sabun.y=0; sabun.x=Math.random()*260;
      }
      if(sabun.y>400){ sabun.y=0; sabun.x=Math.random()*260; }
      ctx.fillStyle="#000"; ctx.fillText("Skor: "+skor,10,20);
      requestAnimationFrame(loop);
    }
    loop();
    document.onkeydown = e=>{
      if(e.key==="ArrowLeft" && tangan.x>0) tangan.x-=15;
      if(e.key==="ArrowRight" && tangan.x<240) tangan.x+=15;
    };
  }
  else if(type === "benarsalah"){
    const qas = [
      {q:"CTPS dilakukan minimal 20 detik.", a:true},
      {q:"CTPS cukup dengan air tanpa sabun.", a:false},
      {q:"CTPS bisa mencegah penyakit diare.", a:true}
    ];
    let i=0, skor=0;
    gameArea.innerHTML = `
      <h3>✅ Benar atau Salah</h3>
      <p id="tfq">${qas[i].q}</p>
      <button id="trueBtn" class="btn btn-primary">Benar</button>
      <button id="falseBtn" class="btn btn-primary">Salah</button>
      <p id="tfres"></p>
    `;
    function next(){
      if(i<qas.length){
        document.getElementById("tfq").textContent=qas[i].q;
      } else {
        gameArea.innerHTML = `<h3>Skor akhir kamu: ${skor}/${qas.length}</h3>`;
      }
    }
    document.getElementById("trueBtn").onclick=()=>{
      if(qas[i].a){skor++; document.getElementById("tfres").textContent="Benar!";}
      else document.getElementById("tfres").textContent="Salah!";
      i++; setTimeout(next,700);
    };
    document.getElementById("falseBtn").onclick=()=>{
      if(!qas[i].a){skor++; document.getElementById("tfres").textContent="Benar!";}
      else document.getElementById("tfres").textContent="Salah!";
      i++; setTimeout(next,700);
    };
  }
}

if (game1Btn) game1Btn.onclick = () => loadGame("urutan");
if (game2Btn) game2Btn.onclick = () => loadGame("sabun");
if (game3Btn) game3Btn.onclick = () => loadGame("benarsalah");

/* === GAME SECTION === */
document.addEventListener("DOMContentLoaded", () => {
  // ========== ELEMENT REFERENSI ==========
  const openOrder = document.getElementById("openOrderGame");
  const openCatch = document.getElementById("openCatchGame");
  const openTF = document.getElementById("openTrueFalse");
  const backBtn = document.getElementById("backToGameMenu");

  const orderGame = document.getElementById("orderGame");
  const catchGame = document.getElementById("catchGame");
  const tfGame = document.getElementById("tfGame");

  function showGame(gameId) {
    orderGame.style.display = catchGame.style.display = tfGame.style.display = "none";
    document.getElementById(gameId).style.display = "block";
  }

  function backToMenu() {
    orderGame.style.display = catchGame.style.display = tfGame.style.display = "none";
  }

  openOrder.addEventListener("click", () => {
    backToMenu();
    renderOrderList();
    showGame("orderGame");
  });

  openCatch.addEventListener("click", () => {
    backToMenu();
    showGame("catchGame");
  });

  openTF.addEventListener("click", () => {
    backToMenu();
    showGame("tfGame");
  });

  backBtn.addEventListener("click", backToMenu);

  // ========== GAME 1: URUTAN LANGKAH ==========
  const orderSteps = [
    "Basahi tangan",
    "Gunakan sabun",
    "Gosok telapak tangan",
    "Gosok punggung tangan",
    "Bilas tangan",
    "Keringkan tangan"
  ];
  const correctOrder = [...orderSteps];
  const orderList = document.getElementById("orderList");
  const orderResult = document.getElementById("orderResult");
  const checkOrderBtn = document.getElementById("checkOrderBtn");

  function renderOrderList() {
    orderList.innerHTML = "";
    const shuffled = [...orderSteps].sort(() => Math.random() - 0.5);
    shuffled.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      li.draggable = true;
      li.style.margin = "6px 0";
      li.style.padding = "8px";
      li.style.background = "#f8fff9";
      li.style.border = "2px solid var(--primary)";
      li.style.borderRadius = "8px";
      li.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", step));
      li.addEventListener("dragover", e => e.preventDefault());
      li.addEventListener("drop", e => {
        e.preventDefault();
        const dragged = e.dataTransfer.getData("text/plain");
        const target = li.textContent;
        const items = [...orderList.children].map(li => li.textContent);
        const from = items.indexOf(dragged);
        const to = items.indexOf(target);
        items.splice(from, 1);
        items.splice(to, 0, dragged);
        orderSteps.splice(0, orderSteps.length, ...items);
        renderOrderList();
      });
      orderList.appendChild(li);
    });
  }

  checkOrderBtn.addEventListener("click", () => {
    const isCorrect = JSON.stringify(orderSteps) === JSON.stringify(correctOrder);
    orderResult.textContent = isCorrect
      ? "Selamat! Kamu sudah mencuci tangan dengan benar 🧼✨"
      : "Urutan masih salah, coba lagi!";
    orderResult.style.color = isCorrect ? "#089981" : "#e53935";
  });

  // ========== GAME 2: TANGKAP SABUN ==========
  const canvas = document.getElementById("soapCanvas");
  const ctx = canvas.getContext("2d");
  const player = { x: 130, y: 370, w: 40, h: 10 };
  let soap = { x: Math.random() * 280, y: 0, r: 12 };
  let score = 0, timeLeft = 20;
  const catchScore = document.getElementById("catchScore");
  const catchResult = document.getElementById("catchResult");
  const startCatchGame = document.getElementById("startCatchGame");
  let catchInterval = null, catchTimer = null;

  function drawCatchGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1ed5a4";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.beginPath();
    ctx.arc(soap.x, soap.y, soap.r, 0, Math.PI * 2);
    ctx.fillStyle = "#089981";
    ctx.fill();
  }

  function resetSoap() {
    soap.x = Math.random() * 280;
    soap.y = 0;
  }

  function updateCatch() {
    soap.y += 5;
    if (
      soap.y + soap.r >= player.y &&
      soap.x > player.x &&
      soap.x < player.x + player.w
    ) {
      score++;
      catchScore.textContent = "Skor: " + score;
      resetSoap();
    }
    if (soap.y > 400) resetSoap();
    drawCatchGame();
  }

  startCatchGame.addEventListener("click", () => {
    if (catchInterval) clearInterval(catchInterval);
    if (catchTimer) clearInterval(catchTimer);
    score = 0;
    timeLeft = 20;
    catchResult.textContent = "";
    catchScore.textContent = "Skor: 0";
    catchInterval = setInterval(updateCatch, 30);
    catchTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(catchInterval);
        clearInterval(catchTimer);
        catchResult.textContent = `Selesai! Skor kamu: ${score} 🧼`;
      }
    }, 1000);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= 15;
    if (e.key === "ArrowRight" && player.x < 260) player.x += 15;
  });

  // ========== GAME 3: BENAR / SALAH ==========
  const tfQuestions = [
    { q: "CTPS dilakukan minimal 20 detik.", a: true },
    { q: "CTPS cukup dilakukan hanya dengan air.", a: false },
    { q: "CTPS dapat mencegah diare dan ISPA.", a: true },
    { q: "Sabun tidak diperlukan untuk membunuh kuman.", a: false },
    { q: "CTPS termasuk pilar keempat STBM.", a: true }
  ];

  const tfQ = document.getElementById("tfQuestion");
  const btnTrue = document.getElementById("btnTrue");
  const btnFalse = document.getElementById("btnFalse");
  const tfButtons = document.getElementById("tfButtons");
  const tfResult = document.getElementById("tfResult");
  const startTF = document.getElementById("startTF");
  let tfIndex = 0, tfScore = 0, tfTimer = null;

  function nextTF() {
    if (tfIndex >= tfQuestions.length) {
      tfButtons.style.display = "none";
      startTF.style.display = "inline";
      tfResult.textContent = `Selesai! Skor kamu: ${tfScore}/${tfQuestions.length}`;
      return;
    }
    const q = tfQuestions[tfIndex];
    tfQ.textContent = q.q;
    let time = 1;
    clearInterval(tfTimer);
    tfTimer = setInterval(() => {
      time--;
      if (time <= 0) {
        clearInterval(tfTimer);
        tfIndex++;
        nextTF();
      }
    }, 1000);
  }

  startTF.addEventListener("click", () => {
    tfIndex = 0;
    tfScore = 0;
    tfResult.textContent = "";
    tfButtons.style.display = "block";
    startTF.style.display = "none";
    nextTF();
  });

  btnTrue.addEventListener("click", () => checkTF(true));
  btnFalse.addEventListener("click", () => checkTF(false));

  function checkTF(ans) {
    clearInterval(tfTimer);
    if (ans === tfQuestions[tfIndex].a) tfScore++;
    tfIndex++;
    nextTF();
  }
});
