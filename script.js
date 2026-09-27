// ============ ELEMENT REFERENCES ============
const screenQuestion = document.getElementById("screen-question");
const screenNo = document.getElementById("screen-no");
const screenYes = document.getElementById("screen-yes");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const yesBtnAgain = document.getElementById("yesBtnAgain");
const noBtnAgain = document.getElementById("noBtnAgain");
const heheBtn = document.getElementById("heheBtn");

const noMessage = document.getElementById("noMessage");
const noDoodle = document.getElementById("noDoodle"); // this is now an <img>
const confettiLayer = document.getElementById("confettiLayer");

// tracks how many times NO has been clicked
let noClickCount = 0;

// helper: switch which screen is visible
function showScreen(screen) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

// the sequence of messages/buttons/photos for each NO click
const noStages = [
  {
    message: "Are you sure? 🥺",
    button: "Are you sure? 🙈",
    photo: "assets/couple-shy.png",
  },
  {
    message: "Think again... 👉👈",
    button: "Maybe? 🥺",
    photo: "assets/couple-shy.png",
  },
  {
    message: "REALLY?! 😭💔",
    button: "Really? 😭",
    photo: "assets/couple-sad.png",
  },
  {
    message: "WRONG ANSWER DETECTED 🚨",
    button: "Oops... 😭",
    photo: "assets/couple-angry.png",
  },
  {
    message: "Okay fine... TRY AGAIN 😤💕",
    button: "TRY AGAIN 💗",
    photo: "assets/couple-angry.png",
  },
];

// update the NO screen content based on current click count
function updateNoScreen() {
  const stage = noStages[Math.min(noClickCount, noStages.length - 1)];
  noMessage.textContent = stage.message;
  noBtnAgain.textContent = stage.button;
  noDoodle.src = stage.photo;
}

// handle a NO button press (works from either screen)
function handleNoClick() {
  noClickCount++;

  if (noClickCount >= noStages.length) {
    // reset back to the very first question
    noClickCount = 0;
    showScreen(screenQuestion);
    return;
  }

  updateNoScreen();
  showScreen(screenNo);

  // shake effect on the 4th stage ("Oops...")
  if (noClickCount === 4) {
    noBtnAgain.classList.add("shake");
    setTimeout(() => noBtnAgain.classList.remove("shake"), 400);
  }
}

// playful dodge: nudge the NO button away from the cursor sometimes
function playfulDodge(button) {
  button.addEventListener("mouseover", () => {
    // only dodge sometimes, and only on non-touch/desktop-ish widths
    if (window.innerWidth < 480) return; // keep it simple/usable on mobile
    if (Math.random() < 0.6) {
      const moveX = Math.random() * 60 - 30; // -30 to 30 px
      const moveY = Math.random() * 30 - 15;
      const rotate = Math.random() * 16 - 8;
      button.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
      setTimeout(() => {
        button.style.transform = "";
      }, 600);
    }
  });
}

// ============ EVENT LISTENERS ============
yesBtn.addEventListener("click", goToYesScreen);
yesBtnAgain.addEventListener("click", goToYesScreen);
noBtn.addEventListener("click", handleNoClick);
noBtnAgain.addEventListener("click", handleNoClick);

playfulDodge(noBtn);
playfulDodge(noBtnAgain);

function goToYesScreen() {
  showScreen(screenYes);
  launchConfetti(30);
}

// HEHE button spawns more hearts
heheBtn.addEventListener("click", () => {
  launchConfetti(15);
});

// ============ CONFETTI / FLOATING HEARTS ============
const confettiEmojis = ["💗", "💕", "❤️", "✨", "⭐", "♡"];

function launchConfetti(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => createConfettiPiece(), i * 40);
  }
}

function createConfettiPiece() {
  const piece = document.createElement("span");
  piece.classList.add("confetti-piece");
  piece.textContent =
    confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

  const startX = Math.random() * 100; // vw percentage
  const duration = 3 + Math.random() * 2; // 3-5s
  const drift = Math.random() * 60 - 30; // horizontal drift

  piece.style.left = startX + "vw";
  piece.style.animationDuration = duration + "s";
  piece.style.setProperty("--drift", drift + "px");
  piece.style.fontSize = 1 + Math.random() * 0.8 + "rem";

  confettiLayer.appendChild(piece);

  // clean up after animation finishes
  setTimeout(() => piece.remove(), duration * 1000);
}

// ============ SANITY CHECK ============
window.addEventListener("DOMContentLoaded", () => {
  if (!yesBtn || !noBtn || !screenQuestion) {
    console.warn("Some elements were not found — check your HTML IDs.");
  }
});
