import React from 'react';
import Panel from 'react-flex-panel';
import { ControlPanel } from './ControlPanel/ControlPanel';
import FrameList from './FrameList/FrameList';
import PanelView from './PanelView/PanelView';
import Overlay from './Overlay/Overlay';
import './App.scss';

export default function App() {
  return (
    <div className="App">
      <Overlay />
      <Panel cols>
        <Panel size={330} minSize={180} resizable className="LeftPanel">
          <ControlPanel />
          <FrameList />
        </Panel>
        <Panel minSize={100} className="PanelView">
          <PanelView />
        </Panel>
      </Panel>
    </div>
  );
}
