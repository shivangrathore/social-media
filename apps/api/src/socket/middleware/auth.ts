import { verifyJWT } from "@/utils/jwt";
import { Socket } from "socket.io";

export async function verifyToken(
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> {
  try {
    const header = socket.handshake.headers.authorization;
    if (!header) {
      throw new Error("Authentication token is required");
    }
    const token = header.split(" ")[1];
    const result = await verifyJWT(token);
    socket.data.userId = parseInt(result.payload.sub!);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(new Error("Authentication failed"));
  }
}
