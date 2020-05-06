import { action, computed, observable } from 'mobx';
import { ControlStore } from './controlStore';
import { frameSendingType, WebSocketFrame } from '../viewer/types';
import { FrameEntry } from '../models/FrameEntry';


export class FrameStore {
  @observable
  frames: FrameEntry[] = [];

  constructor(private controlStore: ControlStore) {}

  @computed
  get activeFrame() {
    return this.frames.find((frameEntry) => frameEntry.id === this.controlStore.activeId);
  }

  @action
  addFrameEntry(
    sendingType: frameSendingType,
    requestId: string,
    timestamp: number,
    response: WebSocketFrame
  ): void {
    const newFrame = new FrameEntry(sendingType, requestId, timestamp, response, this.controlStore);
    this.frames.push(newFrame);
  }

  @action
  deleteAllFrameEntries(): void {
    this.frames = [];
  }
}


