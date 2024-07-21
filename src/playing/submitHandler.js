import { Table } from "../models/table.model.js";
import Events from "../handleEmmiter/index.js";

const submitHandler = async (data, socket) => {
  try {
    const tableData = await Table.findById(data.tableId);

    if (tableData && tableData.boardId.toString() === data.boardId) {
      tableData.endTime = Date.now();
      tableData.totalTime = data.totalTime;
      tableData.status = "Completed";

      await tableData.save();

      const response = {
        eventName: "WINNER",
        data: {
          tableId: tableData._id,
          message: `Congratulations! You have solved the puzzle in ${data.totalTime}`,
        },
      };
      Events.sendToRoom(socket.tableId, response);
    }
  } catch (error) {
    console.log("Submit Handler Error: ", error);
  }
};

export default submitHandler;
