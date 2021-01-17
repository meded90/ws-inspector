import { action, computed, observable } from 'mobx';
import { ControlStore } from './controlStore';
import { IFrameSendingType, WebSocketFrame } from '../viewer/types';
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
  addFrameEntry(sendingType: IFrameSendingType, requestId: string, timestamp: number, response: WebSocketFrame): void {
    const newFrame = new FrameEntry(sendingType, requestId, timestamp, response, this.controlStore);
    this.frames.push(newFrame);
  }

  findNexActiveFrame() {
    if (!this.activeFrame) {
      return this.frames[this.frames.length - 1];
    }

    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      if (i === this.frames.length) {
        return frame;
      }
      if (frame.id === this.activeFrame.id) {
        for (let j = i + 1; j < this.frames.length; j++) {
          const frameNext = this.frames[j];
          if (!frameNext.isFiltered) {
            return frameNext;
          }
        }
      }
    }
    return this.activeFrame;
  }

  @action
  deleteAllFrameEntries(): void {
    this.frames = [];
  }
}
