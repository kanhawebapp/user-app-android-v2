import {useContext, useCallback} from 'react';
import {SocketContext} from './SocketContext';
import {ServerToClientEvents, ClientToServerEvents} from './socket.types';
import {Socket} from 'socket.io-client';

interface ISocketContext {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectSocket: () => Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null;
  disconnectSocket: () => void;
  connected: boolean;
}

export const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);

  if (!context) {
    console.warn(
      '[useSocket] SocketContext not found. Make sure SocketProvider is wrapping your component.',
    );
  }

  return context;
};

export const useEmit = () => {
  const {socket, connected} = useSocket();

  const emit = useCallback(
    (event: string, data: unknown): boolean => {
      if (!socket || !connected) {
        console.warn(`[useEmit] Cannot emit ${event}: socket not connected`);
        return false;
      }
      (socket as any).emit(event, data);
      return true;
    },
    [socket, connected],
  );

  return {emit};
};
