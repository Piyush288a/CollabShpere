import React, { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { socketService } from '../services/socket.service';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketInstance = socketService.connect(token);
      setSocket(socketInstance);

      return () => {
        socketService.disconnect();
        setSocket(null);
      };
    } else {
      socketService.disconnect();
      setSocket(null);
    }
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, socketService }}>
      {children}
    </SocketContext.Provider>
  );
};
