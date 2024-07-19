import { io } from "../index.js";
import eventHandler from "../eventCases/index.js";

const socketConnection = async () => {
  try {
    io.on("connection", async (socket) => {
      console.log(`${socket.id} connected!`);
      eventHandler(socket);
      socket.on("disconnect", (error) => {
        console.log(`Socket disconnected ${error}`);
        // userDisconnect(socket);
      });
    });
  } catch (error) {
    console.log(`Error while connecting socket ${error}`);
  }
};

export { socketConnection };
