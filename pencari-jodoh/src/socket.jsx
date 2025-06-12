import { io } from "socket.io-client";

const URL = "http://localhost:3001"; //connect ke server

const socket = io(URL, {
  autoConnect: false
});

export default socket;