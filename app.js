/**
 * MEMBER CONFIGURATION
 * Add surnames in lowercase here for the system to recognize them.
 */
const memberStatus = {
  // ACCEPTED (Will see the Promotion Surprise + ID Card + Confetti)
  "patricio": "accepted",
  "koh": "accepted",
  "galang": "accepted",
  "donadilla": "accepted",
  "bernabeo": "accepted",
  "tejero": "accepted",
  "martin": "accepted",
  "talabador": "accepted",
  "verutiao": "accepted",
  "miranda": "accepted",
  "suyod": "accepted",
  "grey": "accepted",
  "perlado": "accepted",
  "valencia": "accepted",
  "marcos": "accepted",
  "guiyab": "accepted",
  "foronda": "accepted",

  // ON-HOLD (Will see a "Hang tight" message, No ID, No Confetti)
  "reyes": "on-hold",
  "asis": "on-hold",
  
  // NOT-ACCEPTED (Will see a "Thank you" message, No ID, No Confetti)
  "viador": "not-accepted",
  "manalo": "not-accepted",
  "villanueva": "not-accepted",
  // Anyone NOT on this list will automatically show as "Unrecognized"
};

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

  const nick  = document.getElementById("nickname").value.trim();
  const first = document.getElementById("firstName").value.trim();
  const last  = document.getElementById("lastName").value.trim();
  
  const lookupName = last.toLowerCase().replace(/\s/g, '');
  const status = memberStatus[lookupName] || "unrecognized";

  const promotedTitle = "OFFICIAL STAFFER";
  const fullName = `${first} "${nick}" ${last}`;
  const initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

  // Call the UI updater (this handles the text AND the animation)
  updateResultUI(status, nick, first, last, promotedTitle, fullName, initials);
  
  // Transition UI
  document.getElementById("page-form").classList.remove("active");
  window.scrollTo(0, 0);

  runSuspense(() => {
    document.getElementById("page-loading").classList.remove("active");
    document.getElementById("page-surprise").classList.add("active");
    window.scrollTo(0, 0);

    if (status === "accepted") {
      launchConfetti();
    }
  });
});

/**
 * UI UPDATER
 * Dynamically changes the page content based on the applicant's status
 */
/**
 * UI UPDATER
 * Dynamically changes the page content based on the applicant's status
 */
function updateResultUI(status, nick, first, last, promotedTitle, fullName, initials) {
  const messageEl = document.getElementById("s-message");
  const headingEl = document.querySelector(".s-heading");
  const idCard    = document.querySelector(".id-card");
  const sealEl    = document.getElementById("surprise-seal");

  // Reset UI state
  idCard.style.display = "none";
  sealEl.classList.remove("party-animate");

  if (status === "accepted") {
    headingEl.innerHTML = `Congratulations,<br/><span class="red-text">${nick}</span>!`;
    messageEl.innerHTML = buildMessage(nick, promotedTitle);
    
    // Fill ID Card details
    document.getElementById("id-name").textContent = fullName;
    document.getElementById("id-pos").textContent = promotedTitle;
    document.getElementById("id-avatar").textContent = initials;
    
    idCard.style.display = "flex";
    
    // Add animation wrapper for the party emoji
    sealEl.innerHTML = "<span>🎉</span>"; 
    sealEl.classList.add("party-animate");
  } 
  else if (status === "on-hold") {
    headingEl.innerHTML = `Hang tight,<br/>${nick}.`;
    messageEl.innerHTML = `Your application for The New Builder is currently <strong>ON HOLD</strong>. Our editors are performing a final review of your portfolio. Check back soon for updates!`;
    sealEl.innerHTML = "<span>⏳</span>";
  } 
  else if (status === "not-accepted") {
    headingEl.innerHTML = `Thank you,<br/>${nick}.`;
    messageEl.innerHTML = `We appreciate your interest in joining The New Builder. After careful review, we are moving forward with other candidates at this time. Keep writing and creating!`;
    sealEl.innerHTML = "<span>✉️</span>";
  } 
  else {
    // unrecognized / system error
    headingEl.innerHTML = `System Error,<br/>${nick}.`;
    messageEl.innerHTML = `<strong>Unrecognized Member.</strong> We couldn't find a record for the surname "<strong>${last}</strong>". Please contact the Features Editor or your Section Head to verify your status.`;
    sealEl.innerHTML = "<span>⚠️</span>";
  }
}

// ── Input Cleaning ──
// Removes error styling as the user types
document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", () => {
    el.classList.remove("invalid");
    const err = document.getElementById("err-" + el.id);
    if (err) err.classList.add("hidden");
  });
});

// ── Suspense Sequence ──
// Controls the fake loading bar and status messages
function runSuspense(onDone) {
  const page      = document.getElementById("page-loading");
  const statusEl  = document.getElementById("loading-status");
  const barEl     = document.getElementById("loading-bar");

  page.classList.add("active");

  const steps = [
    { pct: 15,  text: "Verifying your identity…",          delay: 0    },
    { pct: 38,  text: "Accessing member database…",        delay: 800  },
    { pct: 62,  text: "Retrieving application status…",    delay: 1700 },
    { pct: 85,  text: "Finalizing your results…",          delay: 2700 },
    { pct: 100, text: "Almost there…",                     delay: 3600 },
  ];

  steps.forEach(({ pct, text, delay }) => {
    setTimeout(() => {
      barEl.style.width = pct + "%";
      statusEl.style.opacity = "0";
      setTimeout(() => {
        statusEl.textContent  = text;
        statusEl.style.opacity = "1";
      }, 160);
    }, delay);
  });

  const total = 3800 + Math.random() * 800;
  setTimeout(onDone, total);
}

// ── Message Builder (Promotion Surprise) ──
function buildMessage(nick, position) {
  return `While you applied as a Junior, we have a special announcement! We are beyond thrilled to officially promote and welcome you, <strong>${nick}</strong>, as an <strong>${position}</strong> of The New Builder! 🎊 This is just the start of your journey with the team.`;
}

// ── Reset ──
// Clears the form and returns to the first page
function resetAll() {
  document.getElementById("main-form").reset();
  document.querySelectorAll("input, select").forEach(el => el.classList.remove("invalid"));
  document.querySelectorAll(".field-error").forEach(el => el.classList.add("hidden"));
  document.getElementById("confetti-wrap").innerHTML = "";

  document.getElementById("page-loading").classList.remove("active");
  document.getElementById("page-surprise").classList.remove("active");
  document.getElementById("page-form").classList.add("active");
  window.scrollTo(0, 0);
}

// ── Confetti ──
// Generates random falling particles for accepted members
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