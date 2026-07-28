import { RTCSessionDescriptionInit } from 'react-native-webrtc/lib/typescript/RTCSessionDescription';
import {SignalingMessage, SignalingEventType} from '../types/call.types';

type MessageHandler = (message: SignalingMessage) => void;

class SignalingService {
  private ws: WebSocket | null = null;
  private url: string = '';
  private handlers: Map<SignalingEventType, MessageHandler[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private isConnected: boolean = false;
  private userId: string = '';
  private roomId: string = '';

  connect(url: string, userId: string, roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.url = url;
      this.userId = userId;
      this.roomId = roomId;

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('Signaling WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.joinRoom(roomId);
          resolve();
        };

        this.ws.onmessage = event => {
          try {
            const message: SignalingMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (err) {
            console.warn('Failed to parse signaling message:', err);
          }
        };

        this.ws.onerror = error => {
          console.error('Signaling WebSocket error:', error);
          if (!this.isConnected) {
            reject(error);
          }
        };

        this.ws.onclose = () => {
          console.log('Signaling WebSocket closed');
          this.isConnected = false;
          this.handleDisconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.handlers.clear();
  }

  private joinRoom(roomId: string): void {
    const message: SignalingMessage = {
      type: 'call-initiate',
      roomId,
      senderId: this.userId,
      payload: {},
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  private handleMessage(message: SignalingMessage): void {
    const handlers = this.handlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    if (message.type === 'peer-disconnected') {
      this.handlePeerDisconnected();
    } else if (message.type === 'peer-reconnected') {
      this.handlePeerReconnected();
    }
  }

  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );
      setTimeout(() => {
        this.connect(this.url, this.userId, this.roomId).catch(() => {
          console.log('Reconnection failed');
        });
      }, this.reconnectDelay);
    }
  }

  private handlePeerDisconnected(): void {
    console.log('Peer disconnected');
  }

  private handlePeerReconnected(): void {
    console.log('Peer reconnected');
  }

  send(message: SignalingMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  on(eventType: SignalingEventType, handler: MessageHandler): () => void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);

    return () => {
      const currentHandlers = this.handlers.get(eventType) || [];
      const filtered = currentHandlers.filter(h => h !== handler);
      this.handlers.set(eventType, filtered);
    };
  }

  sendOffer(
    offer: RTCSessionDescriptionInit,
    roomId: string,
    targetId?: string,
  ): void {
    const message: SignalingMessage = {
      type: 'offer',
      roomId,
      senderId: this.userId,
      targetId,
      payload: offer,
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  sendAnswer(
    answer: RTCSessionDescriptionInit,
    roomId: string,
    targetId?: string,
  ): void {
    const message: SignalingMessage = {
      type: 'answer',
      roomId,
      senderId: this.userId,
      targetId,
      payload: answer,
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  sendICECandidate(
    candidate: any,
    roomId: string,
    targetId?: string,
  ): void {
    const message: SignalingMessage = {
      type: 'ice-candidate',
      roomId,
      senderId: this.userId,
      targetId,
      payload: candidate,
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  sendCallEnd(roomId: string, targetId?: string): void {
    const message: SignalingMessage = {
      type: 'call-end',
      roomId,
      senderId: this.userId,
      targetId,
      payload: {},
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  sendCallAccept(roomId: string, targetId: string): void {
    const message: SignalingMessage = {
      type: 'call-accept',
      roomId,
      senderId: this.userId,
      targetId,
      payload: {},
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  sendCallReject(roomId: string, targetId: string): void {
    const message: SignalingMessage = {
      type: 'call-reject',
      roomId,
      senderId: this.userId,
      targetId,
      payload: {},
      timestamp: new Date().toISOString(),
    };
    this.send(message);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const signalingService = new SignalingService();
export default signalingService;
