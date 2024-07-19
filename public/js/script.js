let socket = io();

let playerName;

document.getElementById("startbtn").addEventListener("click", () => {
  do {
    playerName = prompt("Enter your name :");
    socket.emit("SIGNUP", { playerName, time: Date.now() });
  } while (!playerName);
});

eventHandler(socket);

function eventHandler(socket) {
  socket.onAny((eventName, data) => {
    switch (eventName) {
      case "START":
        console.log("game started event called..");
        // Start(data);
        break;

      case "JOIN":
        console.log("joinGame evenHandler data", data);
        // joinGame(data.data);
        break;

      case "WINNER":
        // checkWinnner(data.data);
        break;

      case "DISCONNECT_USER":
      // disconnectUser(data.data);
    }
  });
}
