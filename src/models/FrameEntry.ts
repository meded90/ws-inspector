import { computed, observable } from 'mobx';
import * as Helpers from '../viewer/Helpers/Helper';
import { frameSendingType, WebSocketFrame } from '../viewer/types';
import { ControlStore } from '../stores/controlStore';

export enum IContentType {
  json = 'JSON',
  binary = 'BINARY',
  text = 'TEXT',
}

export class FrameEntry {
  static frameIssueTime: number;
  static frameIssueWallTime: number;
  id: string;
  sendingType: frameSendingType;
  time: Date;
  length: number;
  text: string;
  opcode: number;

  constructor(
    sendingType: frameSendingType,
    requestId: string,
    timestamp: number,
    response: WebSocketFrame,
    private control: ControlStore
  ) {
    this.opcode = response.opcode;
    this.id = Date.now().toString();
    this.sendingType = sendingType;
    this.time = this.setTime(timestamp);
    this.length = response.payloadData.length;
    this.text = response.payloadData;
  }

  @observable
  private _contentType?: IContentType;

  @computed
  get contentType(): IContentType {
    if (!this._contentType) {
      this.parseContent();
    }
    return this._contentType!;
  }

  @observable
  private _content?: string | Uint8Array | object;

  @computed
  get content(): string | Uint8Array | object | undefined {
    if (!this._content) {
      this.parseContent();
    }
    return this._content;
  }

  @computed
  get name() {
    return Helpers.getName(this, this.control.regName);
  }

  @computed
  get isFiltered() {
    return Helpers.checkViable(this.text, this.control.filter, this.control.isFilterInverse);
  }

  setTime(timestamp: number) {
    if (!FrameEntry.frameIssueTime) {
      FrameEntry.frameIssueTime = timestamp;
      FrameEntry.frameIssueWallTime = new Date().getTime();
    }
    return new Date((timestamp - FrameEntry.frameIssueTime) * 1000 + FrameEntry.frameIssueWallTime);
  }

  parseContent() {
    const isDataTextOrObject = this.opcode === 1;
    const isDataBinary = this.opcode === 2;
    this._contentType = IContentType.text;
    if (isDataBinary) {
      this._content = Helpers.stringToBuffer(this.text);
      this._contentType = IContentType.binary;
    } else if (isDataTextOrObject) {
      try {
        this._content = JSON.parse(this.text);
        this._contentType = IContentType.json;
      } catch {
        this._content = this.text;
        this._contentType = IContentType.text;
      }
    } else {
      throw new Error(`Unexpected opcode in a frame: ${this.opcode}`);
    }
  }
}
