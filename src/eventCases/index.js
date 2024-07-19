import { signUpGame } from "../playing/signUpGame.js";

function eventHandle(socket) {
  socket.onAny((eventName, data) => {
    console.log("eventHandle data :: >>", data);
    console.log("eventName", eventName);

    switch (eventName) {
      case "SIGNUP":
        signUpGame(data, socket);
        break;
    }
  });
}

export default eventHandle;
