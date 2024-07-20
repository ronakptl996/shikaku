import { Table } from "../models/table.model.js";
import Events from "../handleEmmiter/index.js";

const signUpGame = async (signUpData, socket) => {
  try {
    console.log("signUpGame data :: >>", signUpData);

    const tableData = await Table.create({
      username: signUpData.playerName,
      status: "Running",
      socketId: socket.id,
      startTime: signUpData.time,
    });

    // if(!tableData) {

    // }

    socket.join(tableData._id);
    socket.tableId = tableData._id;

    let roomData = {
      eventName: "JOIN",
      data: {
        tableId: tableData._id,
        username: tableData.username,
      },
    };
    Events.sendToRoom(tableData._id, roomData);
  } catch (error) {
    console.log("joinGame ERROR", error);
  }
};

export default signUpGame;
