let socket = io();

let playerName;
let timerId;
let isPaused = false;
let selectedDimension = null;

document.getElementById("startbtn").addEventListener("click", () => {
  if (!selectedDimension) {
    alert("Please select the dimension");
    return;
  }
  do {
    playerName = prompt("Enter your name :");
    socket.emit("SIGNUP", { playerName, time: Date.now(), selectedDimension });
  } while (!playerName);
});

eventHandler(socket);

const dimensionButtons = document.querySelectorAll(".dimension-button");

dimensionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dimensionButtons.forEach((btn) => btn.classList.remove("selected"));

    button.classList.add("selected");
    selectedDimension = button.dataset.dimension;
    document.getElementById("startbtn").disabled = false;
  });
});

// Find the 5x5 button and simulate a click
const defaultDimensionButton = document.querySelector(
  '.dimension-button[data-dimension="5x5"]'
);
defaultDimensionButton.click();

$("#resetBtn").click(function () {
  localStorage.removeItem("tableId");
  localStorage.removeItem("boardId");
  location.reload();
});

$("#timerChangeBtn").click(function () {
  isPaused = !isPaused;
  document.getElementById("timerChangeBtn").innerText = isPaused
    ? "Resume"
    : "Pause";

  if (isPaused) {
    $("#canvas").off("mousedown");
    $("#canvas").off("mouseup");
    $("#submitBtn").attr("disabled", true);
  } else {
    $("#canvas").on("mousedown", canvasMouseDown);
    $("#canvas").on("mouseup", canvasMouseUp);
    $("#submitBtn").attr("disabled", false);
  }
});

function startTimer() {
  let timer = 0;
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timer++;
      // Update the timer display here (e.g., using innerHTML)
      document.getElementById("timer").textContent = formatTime(timer);
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

function startGame(data) {
  document.querySelector(".gameWrapperInner").style.display = "block";
  document.querySelector(".intialState").style.display = "none";
  const poUp = `<div class="win-alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>Game Started!
    </div>`;
  const winPopup = document.querySelector(".alertBox");
  winPopup.innerHTML = poUp;
  localStorage.setItem("boardId", data.boardId);
  startTimer();
  setTimeout(() => {
    document.querySelector(".alertBox").innerHTML = "";
  }, 4000);
}

function winnerHandler(data) {
  clearInterval(timerInterval);
  let poUp = `<div class="win-alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>${data.message}
    </div>`;
  const winPopup = document.querySelector(".alertBox");
  winPopup.innerHTML = poUp;

  setTimeout(() => {
    location.reload();
    localStorage.removeItem("tableId");
    localStorage.removeItem("boardId");
  }, 5000);
}

function eventHandler(socket) {
  socket.onAny((eventName, data) => {
    switch (eventName) {
      case "JOIN":
        drawCanvas(data.data);
        break;

      case "START_GAME":
        startGame(data.data);
        break;

      case "WINNER":
        winnerHandler(data.data);
        break;
    }
  });
}
