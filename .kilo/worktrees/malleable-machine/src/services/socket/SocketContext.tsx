import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import {Socket} from 'socket.io-client';
import {socketService} from './socket.service';
import {ServerToClientEvents, ClientToServerEvents} from './socket.types';

// Context type
interface ISocketContext {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectSocket: () => Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null;
  disconnectSocket: () => void;
  connected: boolean;
}

// Create context with default value
export const SocketContext = createContext<ISocketContext>({
  socket: null,
  connectSocket: () => null,
  disconnectSocket: () => {},
  connected: false,
});

// Props type
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
  const [connected, setConnected] = useState<boolean>(
    socketService.isConnected(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const isConn = socketService.isConnected();
      setConnected(isConn);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const connectSocket = useCallback(() => {
    console.log(
      '[SocketContext] connectSocket called - delegating to socketService',
    );
    socketService
      .connectAndWait()
      .then(socket => {
        console.log('[SocketContext] Socket connected via service');
        setConnected(true);
        return socket;
      })
      .catch(err => {
        console.log('[SocketContext] Socket connection failed:', err);
        setConnected(false);
      });
    return socketService.getSocket();
  }, []);

  const disconnectSocket = useCallback(() => {
    console.log(
      '[SocketContext] disconnectSocket called - delegating to socketService',
    );
    socketService.disconnect();
    setConnected(false);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketService.getSocket(),
        connectSocket,
        disconnectSocket,
        connected,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
