const word = "MULTO"; // target word
let currentInput = "";
const wordDisplay = document.getElementById("wordDisplay");
const keyboardContainer = document.getElementById("keyboard");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");

function updateDisplay() {
  wordDisplay.textContent = currentInput
    .padEnd(word.length, "_")
    .split("")
    .join(" ");
}

function createKeyboard() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  letters.split("").forEach((letter) => {
    const key = document.createElement("button");
    key.textContent = letter;
    key.className = "key";
    key.setAttribute("data-key", letter);
    key.addEventListener("click", () => handleInput(letter, key));
    keyboardContainer.appendChild(key);
  });

  const enterKey = document.createElement("button");
  enterKey.textContent = "Enter";
  enterKey.className = "key enter";
  enterKey.addEventListener("click", checkAnswer);
  keyboardContainer.appendChild(enterKey);
}

function handleInput(letter, keyElement = null) {
  if (currentInput.length < word.length) {
    currentInput += letter;
    updateDisplay();

    // Visually mark key as clicked
    if (keyElement) {
      keyElement.classList.add("clicked");
      setTimeout(() => keyElement.classList.remove("clicked"), 200);
    }
  }
}

function checkAnswer() {
  if (currentInput === word) {
    videoContainer.style.display = "block";
    video.play().then(() => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }).catch((error) => {
      console.error("Video play or fullscreen failed:", error);
    });
  } else {
    alert("Wrong spelling. Try again!");
    currentInput = "";
    updateDisplay();
  }
}

// Handle physical keyboard typing
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  if (/^[A-Z]$/.test(key)) {
    const virtualKey = document.querySelector(`.key[data-key="${key}"]`);
    handleInput(key, virtualKey);
  } else if (event.key === "Enter") {
    checkAnswer();
  }
});

// Reset after video ends
video.addEventListener("ended", () => {
  document.exitFullscreen?.();
  videoContainer.style.display = "none";
  currentInput = "";
  updateDisplay();
});

// Initialize game
createKeyboard();
updateDisplay();
