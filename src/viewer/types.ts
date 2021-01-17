export enum IFrameSendingType {
  INC = 'incoming',
  OUT = 'outgoing'
};

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

export interface NetworkWebSocketCreatedParams {
  requestId: string;
  url: string;
}
