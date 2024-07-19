import { io } from "../index.js";

class Events {
  sendToRoom(tableId, data) {
    try {
      console.log("sendToRoom data :: >>", data);
      console.log("sendToRoom tableId :: >>", tableId);

      io.to(tableId).emit(data.eventName, data);
    } catch (error) {
      console.log("sendToRoom error", error);
    }
  }
  sendToSocket(socketId, data) {
    try {
      io.to(socketId).emit(data.eventName, data);
    } catch (error) {
      console.log("CATCH_ERROR IN SendToSocket : ", error);
    }
  }
}

export default Events = new Events();
