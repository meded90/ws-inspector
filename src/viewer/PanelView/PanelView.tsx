import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import HexViewer from './HexViewer';
import './PanelView.scss';
import { useStores } from '../../stores/RootStore';
import { useObserver } from 'mobx-react';
import { IContentType } from '../../models/FrameEntry';
import JsonViewer from './JsonViewer';
import TextViewer from './TextViewer';

export default function PanelView() {
  const { frameStore } = useStores();

  return useObserver(() => {
    const frame = frameStore.activeFrame;

    const [panel, setPanel] = useState(frameStore.activeFrame?.contentType);

    const prevContentType = useRef(frameStore.activeFrame?.contentType);
    useEffect(() => {
      if (!prevContentType.current && frameStore.activeFrame?.contentType) {
        setPanel(frameStore.activeFrame?.contentType);
      }
      prevContentType.current = frameStore.activeFrame?.contentType;
    }, [frameStore.activeFrame?.contentType]);

    if (!frame) {
      return <span className="message">Select a frame to view its contents</span>;
    }
    return (
      <div className="FrameView">
        <ul className="tab-line">
          {frame.contentType === IContentType.json && (
            <Tab key={'json'} name={IContentType.json} panel={panel} onSelect={setPanel}>
              JSON
            </Tab>
          )}
          {frame.contentType === IContentType.binary && (
            <Tab key={'hex'} name={IContentType.binary} panel={panel} onSelect={setPanel}>
              Hex
            </Tab>
          )}
          {frame.contentType !== IContentType.text && (
            <Tab key={'text'} name={IContentType.text} panel={panel} onSelect={setPanel}>
              Text
            </Tab>
          )}
        </ul>
        {!panel || panel === IContentType.text && <TextViewer data={frame.text} />}
        {panel === IContentType.json && <JsonViewer data={frame.content} />}
        {panel === IContentType.binary && (
          <HexViewer className="tab-pane" data={frame.content as Uint8Array} />
        )}
      </div>
    );
  });
}

function Tab(props: {
  name: IContentType;
  children: ReactNode;
  onSelect: (name: IContentType) => void;
  panel?: string;
}) {
  return (
    <li
      className={cx('tab-button', { active: props.panel === props.name })}
      onClick={() => props.onSelect(props.name)}
    >
      {props.children}
    </li>
  );
}
