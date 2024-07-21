import express from "express";
const app = express();
import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { socketConnection } from "./connections/socket.js";
import connectDB from "./db/index.js";

let io;

(async () => {
  let server = http.createServer(app);
  io = new Server(server);
  app.use(express.json());

  // Set Path
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  dotenv.config({
    path: "./.env",
  });

  await socketConnection();

  const PORT = process.env.SERVER_PORT || 4300;

  app.get("/", (req, res) => {
    // res.sendFile(__dirname+'/public/index.html')
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  connectDB()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`⚙️ Server is running at port: http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.log("MONGO db connection failed !!! ", err);
    });
})();

export { io };
