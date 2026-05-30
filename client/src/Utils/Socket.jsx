import { io } from "socket.io-client";

const URL = import.meta.env.VITE_PATH_SERVER;
const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;