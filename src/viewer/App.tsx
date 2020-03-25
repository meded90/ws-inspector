import React from 'react';
import Panel from 'react-flex-panel';
import ControlPanel from './ControlPanel/ControlPanel';
import FrameList from './FrameTable/FrameTable';
import PanelView from './PanelView/PanelView';
import { stringToBuffer } from './Helpers/Helper';
import './App.scss';
import { FrameEntryType, frameSendingType, WebSocketFrame } from './types';
import { FrameEntry } from '../FrameData';

interface AppProps {
  handlers: any;
  frameViewArray: FrameEntry[];
}
interface AppState {
  [key: string]: any;
  frameViewArray: FrameEntry[];
  activeId: string | null;
  isCapturing: boolean;
  regName: string;
  filter: string;
  isFilterInverse: boolean;
}
export default class App extends React.Component<AppProps, AppState> {
  //  frameUniqueId = 0;

  frameIssueTime: number;

  frameIssueWallTime: number;

  cacheKey = ['isCapturing', 'regName', 'filter', 'isFilterInverse'];

  constructor(props: AppProps) {
    super(props);
    //    this.props.handlers['Network.webSocketFrameReceived'] = this.webSocketFrameReceived.bind(this);
    //    this.props.handlers['Network.webSocketFrameSent'] = this.webSocketFrameSent.bind(this);
    this.state = {
      frameViewArray: props.frameViewArray,
      activeId: '',
      isCapturing: true,
      regName: '',
      filter: '',
      isFilterInverse: false,
    };
  }

  componentDidMount() {
    const cacheState = this.cacheKey.reduce<Record<string, string | boolean>>((acc, key) => {
      const value = window.localStorage.getItem(key);
      if (value !== null && value !== undefined) {
        acc[key] = value;
        if (value === 'true') {
          acc[key] = true;
        }
        if (value === 'false') {
          acc[key] = false;
        }
      }
      return acc;
    }, {});
    this.setState(cacheState);
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    this.cacheKey.forEach((key) => {
      if (prevState[key] !== this.state[key]) {
        localStorage.setItem(key, this.state[key]);
      }
    });
  }

  getTime(timestamp: number) {
    if (this.frameIssueTime == null) {
      this.frameIssueTime = timestamp;
      this.frameIssueWallTime = new Date().getTime();
    }
    return new Date((timestamp - this.frameIssueTime) * 1000 + this.frameIssueWallTime);
  }

  render() {
    const { frameViewArray, activeId, regName, filter, isFilterInverse, isCapturing } = this.state;
    const active = frameViewArray.find((frameEntry) => frameEntry.id === activeId);
    return (
      <Panel cols className="App">
        <Panel size={330} minSize={180} resizable className="LeftPanel">
          <ControlPanel
            onClear={this.clearFrames}
            onCapturingToggle={this.onCapturingToggle}
            isCapturing={isCapturing}
            regName={regName}
            handleRegName={this.setRegName}
            filter={filter}
            handleFilter={this.setFilter}
            isFilterInverse={isFilterInverse}
            onFilterModeToggle={this.onFilterModeToggle}
          />
          <FrameList
            frameViewArray={frameViewArray}
            activeId={activeId}
            onSelect={this.selectFrame}
          />
        </Panel>
        <Panel minSize={100} className="PanelView">
          {active != null ? (
            <PanelView frame={active} />
          ) : (
            <span className="message">Select a frame to view its contents</span>
          )}
        </Panel>
      </Panel>
    );
  }

  selectFrame = (id: string) => {
    this.setState({ activeId: id });
  };

  clearFrames = () => {
    this.setState({ frames: [] });
  };

  onCapturingToggle = () => {
    this.setState({ isCapturing: !this.state.isCapturing });
  };

  setRegName = (regName: string) => {
    this.setState({ regName });
  };

  setFilter = (filter: string) => {
    this.setState({ filter });
  };

  onFilterModeToggle = () => {
    this.setState({ isFilterInverse: !this.state.isFilterInverse });
  };

  /*  addFrame(sendingType: frameSendingType, timestamp: number, response: WebSocketFrame) {
    if ((response.opcode === 1 || response.opcode === 2) && this.state.isCapturing) {
      const frame: FrameEntryType = {
        sendingType: sendingType,
        name: sendingType,
        id: this.frameUniqueId,
        time: this.getTime(timestamp),
        length: response.payloadData.length,
      };
      this.frameUniqueId += 1;
      if (response.opcode === 1) {
        frame.text = response.payloadData;
      } else {
        frame.binary = stringToBuffer(response.payloadData);
      }
      this.setState(({ frames }) => ({ frames: [...frames, frame] }));
    }
  }

  webSocketFrameReceived({ timestamp, response }: { timestamp: number; response: WebSocketFrame }) {
    if (this.state.isCapturing) {
      this.addFrame('incoming', timestamp, response);
    }
  }

  webSocketFrameSent({ timestamp, response }: { timestamp: number; response: WebSocketFrame }) {
    if (this.state.isCapturing) {
      this.addFrame('outgoing', timestamp, response);
    }
  }*/
}
