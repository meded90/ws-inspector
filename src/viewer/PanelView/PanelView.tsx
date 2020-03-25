import { ObjectInspector, ObjectInspectorProps } from 'react-inspector';
import React from 'react';
import cx from 'classnames';
import HexViewer from './HexViewer';
import './PanelView.scss';
import { FrameEntryType } from '../types';

const TextViewer = ({ data }: { data: string | undefined }) => (
  <div className="TextViewer tab-pane">{data}</div>
);

const JsonViewer = (data: ObjectInspectorProps) => (
  <div className="JsonViewer tab-pane">
    <ObjectInspector data={data} expandLevel={2} />
  </div>
);
type PanelName = 'json' | 'hex' | 'text';
interface PanelViewState {
  panel?: PanelName | PanelName[] | null;
}
interface PanelViewProps {
  frame: FrameEntryType;
}

export default class PanelView extends React.Component<PanelViewProps, PanelViewState> {
  state = { panel: null };

  static getDerivedStateFromProps(props: PanelViewProps, state: PanelViewState) {
    const { frame } = props;
    const panels = [];
    if (frame.binary) {
      panels.push('hex');
    }

    if (frame.text != null) {
      const hasJSONProperty = Object.prototype.hasOwnProperty.call(frame, 'json');
      if (!hasJSONProperty) {
        try {
          frame.json = JSON.parse(frame.text);
        } catch {
          frame.json = undefined;
        }
      }
      if (frame.json !== undefined) {
        panels.push('json');
      }

      panels.push('text');
    }

    if (!panels.includes(state.panel as string)) {
      return { panel: panels[0] };
    }
    return null;
  }

  makePanel(name: PanelName, title: string) {
    return (
      <li
        className={cx('tab-button', { active: this.state.panel === name })}
        onClick={() => this.setState({ panel: name })}
      >
        {title}
      </li>
    );
  }

  render() {
    const { frame } = this.props;
    const { panel } = this.state;
    return (
      <div className="FrameView">
        <ul className="tab-line">
          {frame.json !== undefined && this.makePanel('json', 'JSON')}
          {frame.binary != null && this.makePanel('hex', 'Hex')}
          {frame.text != null && this.makePanel('text', 'Text')}
        </ul>
        {panel === 'text' && <TextViewer data={frame.text} />}
        {panel === 'json' && <JsonViewer data={frame.json} />}
        {panel === 'hex' && <HexViewer className="tab-pane" data={frame.binary as Uint8Array} />}
      </div>
    );
  }
}
