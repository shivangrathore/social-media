"use client";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_APP_URL, { addTrailingSlash: false });
export default socket;
