import { io as ioClient } from "socket.io-client";

let socket = null;

const getSocketUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL?.trim();
  if (rawUrl) {
    return rawUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return undefined;
};

export const initSocket = (userId, token = null) => {
  if (!userId) return null;
  try {
    if (socket && socket.connected) return socket;

    const options = {
      withCredentials: true,
    };

    if (token) {
      options.auth = { token };
    }

    const url = getSocketUrl();
    socket = ioClient(url, options);

    socket.on("connect", () => {
      socket.emit("join", { userId });
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connect error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return socket;
  } catch (err) {
    console.error("initSocket error", err);
    return null;
  }
};

export const getSocket = () => socket;

export default { initSocket, getSocket };
