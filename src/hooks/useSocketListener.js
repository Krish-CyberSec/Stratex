import { useEffect, useRef } from "react";
import { getSocket } from "../utils/socketClient";

// Generic hook to listen to socket events and dispatch window events.
// If the socket isn't ready immediately, poll briefly until it becomes available.
export const useSocketListener = () => {
  const attachedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const notificationHandler = (payload) => {
      try {
        window.dispatchEvent(new CustomEvent("socket:notification", { detail: payload }));
      } catch (err) {
        console.error("socket:notification dispatch error", err);
      }
    };

    const attachSocket = () => {
      const socket = getSocket();
      if (socket && !attachedRef.current) {
        socket.on("notification:new", notificationHandler);
        attachedRef.current = true;
      }
    };

    attachSocket();

    if (!attachedRef.current) {
      intervalId = window.setInterval(() => {
        if (!isMounted) return;
        attachSocket();
        if (attachedRef.current && intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, 250);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      const socket = getSocket();
      if (socket && attachedRef.current) {
        socket.off("notification:new", notificationHandler);
      }
    };
  }, []);
};

export default useSocketListener;