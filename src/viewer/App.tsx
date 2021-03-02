import React from 'react';
import { SplitPane } from 'react-collapse-pane';
import { ControlPanel } from './ControlPanel/ControlPanel';
import FrameList from './FrameList/FrameList';
import PanelView from './PanelView/PanelView';
import Overlay from './Overlay/Overlay';
import './App.scss';
import { useStores } from '../stores/RootStore';
import { observer } from 'mobx-react';

export default observer(function App() {
    const { controlStore } = useStores();
    if (!controlStore.isInitApp) return null;
    return (
      <div className="App">
        <Overlay />
        <SplitPane split="vertical" initialSizes={controlStore.sizeSplit} hooks={controlStore}>
          <div className="LeftPanel">
            <ControlPanel />
            <FrameList />
          </div>
          <div className="PanelView">
            <PanelView />
          </div>
        </SplitPane>
      </div>
    );
  },
);
