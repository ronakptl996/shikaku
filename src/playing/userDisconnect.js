import { Table } from "../models/table.model.js";

const userDisconnect = async (socket) => {
  if (socket && socket.tableId) {
    const tableData = await Table.findById(socket.tableId);
    console.log({ tableData });

    if (tableData.status === "Running") {
      tableData.status = "Left";
      tableData.endTime = Date.now();

      await tableData.save();
    }
  }
};

export default userDisconnect;
