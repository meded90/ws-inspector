export type frameSendingType = 'incoming' | 'outgoing';
export interface FrameEntryType {
  sendingType: frameSendingType;
  name: string;
  id: number;
  time: Date;
  length: number;
  text?: string;
  binary?: Uint8Array;
  json?: object;
};

export interface EFilter {
  regName: string;
  filter: string;
  isFilterInverse: boolean;
}

export interface WebSocketFrame {
  opcode: number;
  mask: boolean;
  payloadData: string;
}

export interface NetworkWebSocketParams {
  requestId: string;
  timestamp: number;
  response: WebSocketFrame;
}
