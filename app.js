// ── Form submit ──
document.getElementById("main-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = [
    ["firstName",  "err-firstName"],
    ["lastName",   "err-lastName"],
    ["nickname",   "err-nickname"],
    ["position",   "err-position"],
  ];

  let valid = true;

  fields.forEach(([id, errId]) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el.value.trim()) {
      el.classList.add("invalid");
      err.classList.remove("hidden");
      valid = false;
    } else {
      el.classList.remove("invalid");
      err.classList.add("hidden");
    }
  });

  if (!valid) return;

  const nick     = document.getElementById("nickname").value.trim();
  const pos      = document.getElementById("position").value.trim();
  const first    = document.getElementById("firstName").value.trim();
  const last     = document.getElementById("lastName").value.trim();
  const fullName = `${first} "${nick}" ${last}`;
  const initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

  // Populate surprise page
  document.getElementById("s-nick").textContent    = nick;
  document.getElementById("s-message").innerHTML   = buildMessage(nick, pos);
  document.getElementById("id-name").textContent   = fullName;
  document.getElementById("id-pos").textContent    = pos;
  document.getElementById("id-avatar").textContent = initials;

  // Switch to surprise
  document.getElementById("page-form").classList.remove("active");
  document.getElementById("page-surprise").classList.add("active");
  window.scrollTo(0, 0);

  launchConfetti();
});

// ── Clear invalid on input ──
document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", () => {
    el.classList.remove("invalid");
    const err = document.getElementById("err-" + el.id);
    if (err) err.classList.add("hidden");
  });
});

// ── Message builder ──
function buildMessage(nick, position) {
  return `We are beyond thrilled to officially welcome you, <strong>${nick}</strong>, as a <strong>${position}</strong> of our organization! 🎊 This moment marks the beginning of an incredible journey — we've been waiting for someone just like you. Get ready to grow, connect, and make a real difference with the team!`;
}

// ── Reset ──
function resetAll() {
  document.getElementById("main-form").reset();
  document.querySelectorAll("input, select").forEach(el => el.classList.remove("invalid"));
  document.querySelectorAll(".field-error").forEach(el => el.classList.add("hidden"));
  document.getElementById("confetti-wrap").innerHTML = "";

  document.getElementById("page-surprise").classList.remove("active");
  document.getElementById("page-form").classList.add("active");
  window.scrollTo(0, 0);
}

// ── Confetti ──
function launchConfetti() {
  const wrap   = document.getElementById("confetti-wrap");
  wrap.innerHTML = "";
  const colors = ["#e02020", "#ff6b6b", "#fca5a5", "#fde68a", "#86efac", "#93c5fd", "#f9a8d4", "#fff"];

  for (let i = 0; i < 110; i++) {
    const el     = document.createElement("div");
    el.className = "confetto";
    const size   = Math.random() * 9 + 5;
    const circle = Math.random() > 0.5;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${circle ? size : size * 0.45}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${circle ? "50%" : "2px"};
      animation-duration: ${Math.random() * 2.8 + 2}s;
      animation-delay: ${Math.random() * 2}s;
      opacity: ${Math.random() * 0.5 + 0.5};
    `;
    wrap.appendChild(el);
  }
}