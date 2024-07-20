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

$("#timerChangeBtn").click(function () {
  isPaused = !isPaused;

  if (isPaused) {
    document.getElementById("timerChangeBtn").innerText = "Resume";
  } else {
    document.getElementById("timerChangeBtn").innerText = "Pause";
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
  document.querySelector("#startbtn").style.display = "none";
  document.querySelector(".alertBox").innerHTML = "GAME STARTED";
  localStorage.setItem("boardId", data.boardId);
  startTimer();
  setTimeout(() => {
    document.querySelector(".alertBox").innerHTML = "";
  }, 4000);
}

function winnerHandler(data) {
  clearInterval(timerInterval);
  console.log({ winnerData: data });
  let poUp = `<div class="win-alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>${data.message}
    </div>`;
  const winPopup = document.querySelector(".alertBox");
  winPopup.innerHTML = poUp;
}

function eventHandler(socket) {
  socket.onAny((eventName, data) => {
    console.log({ eventName });
    switch (eventName) {
      case "JOIN":
        console.log("joinGame evenHandler data", data);
        // joinGame(data.data);
        drawCanvas(data.data);
        break;

      case "START_GAME":
        console.log("game started event called..", data);
        startGame(data.data);
        break;

      case "WINNER":
        winnerHandler(data.data);
        break;
    }
  });
}
