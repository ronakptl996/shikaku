import { Board } from "../models/board.model.js";
import { Table } from "../models/table.model.js";
import Events from "../handleEmmiter/index.js";
import { io } from "../index.js";

const createBoard = async (data, socket) => {
  const tableData = await Table.findById(socket.tableId);

  if (!tableData) {
    console.error("Table data not found!");
  }

  const createdBoardData = await Board.create({
    puzzle: data.board,
    tableId: socket.tableId,
  });

  if (!createdBoardData) {
    console.error("Error while creating board!");
  }

  tableData.boardId = createdBoardData._id;
  await tableData.save();

  const roomData = {
    eventName: "START_GAME",
    data: {
      boardId: createdBoardData._id,
      mesage: "Game Started!",
    },
  };

  Events.sendToRoom(socket.tableId, roomData);
};

export default createBoard;
