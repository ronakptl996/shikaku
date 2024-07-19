let socket = io();

let playerName;
let timerId;
let isPaused = false;

document.getElementById("startbtn").addEventListener("click", () => {
  do {
    playerName = prompt("Enter your name :");
    socket.emit("SIGNUP", { playerName, time: Date.now() });
  } while (!playerName);
});

eventHandler(socket);

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  isPaused = false;
}

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
  document.querySelector("#startbtn").style.display = "none";
  document.querySelector(".alertBox").innerHTML = "GAME STARTED";
  startTimer();
  setTimeout(() => {
    document.querySelector(".alertBox").innerHTML = "";
  }, 4000);
}

function eventHandler(socket) {
  socket.onAny((eventName, data) => {
    console.log({ eventName });
    switch (eventName) {
      case "JOIN":
        console.log("joinGame evenHandler data", data);
        // joinGame(data.data);
        drawCanvas();
        break;

      case "START_GAME":
        console.log("game started event called..", data);
        startGame(data.data);
        break;
    }
  });
}
