import { Table } from "../models/table.model.js";
import Events from "../handleEmmiter/index.js";

const signUpGame = async (signUpData, socket) => {
  try {
    const tableData = await Table.create({
      username: signUpData.playerName,
      status: "Running",
      socketId: socket.id,
      startTime: signUpData.time,
      dimension: signUpData.selectedDimension,
    });

    if (!tableData) {
      throw new Error("Table not created!");
    }

    socket.join(tableData._id);
    socket.tableId = tableData._id;

    const roomData = {
      eventName: "JOIN",
      data: {
        tableId: tableData._id,
        username: tableData.username,
        dimension: tableData.dimension,
      },
    };
    Events.sendToRoom(tableData._id, roomData);
  } catch (error) {
    console.log("joinGame ERROR", error);
  }
};

export default signUpGame;
