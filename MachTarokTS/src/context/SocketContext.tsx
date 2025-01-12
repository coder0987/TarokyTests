import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthProvider, useUserContext } from "./AuthContext";

const SocketContext = createContext(null);

const generateSocketId = () => {
  const existingSocketId = localStorage.getItem("socketId");
  if (existingSocketId) {
    return parseInt(existingSocketId, 10);
  }

  const newSocketId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1)) + 1; // Generate random number >= 1
  localStorage.setItem("socketId", ''+newSocketId); // Store socketId in localStorage for future use
  return newSocketId;
};

export const SocketProvider = ({ children }) => {
  const { account, isAuthenticated } = useUserContext(); // Use the authentication context
  const [socket, setSocket] = useState(null);
  const socketId = generateSocketId();

  useEffect(() => {
    // Create the socket connection with the socketId (persisted from previous sessions)
    const newSocket = io("http://localhost:3000", { //!!CHANGE THIS BEFORE BUILDING!!
      auth: {
        token: socketId,
        username: account?.user || null,
        signInToken: account?.authToken || null,
      },
    });

    setSocket(newSocket);

    // Handle connection success or failure
    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error", err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const signInUser = () => {
    if (socket && isAuthenticated) {
      socket.emit("signIn", {
        username: account.user,
        token: account.authToken,
      });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, signInUser }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
