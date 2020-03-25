/* eslint max-classes-per-file: 0 */
import React, { MouseEvent } from 'react';
import cx from 'classnames';
import FontAwesome from 'react-fontawesome';
import { TimeStamp } from '../Helpers/Helper';
import './FrameTable.scss';
import { FrameEntry } from '../../FrameData';

interface FrameListProps {
  frameViewArray: FrameEntry[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export default class FrameList extends React.Component<FrameListProps> {
  handlerClearSelect = () => {
    this.props.onSelect(null);
  };

  render() {
    const { frameViewArray, activeId, onSelect } = this.props;
    return (
      <ul className="frame-list" onClick={this.handlerClearSelect}>
        {frameViewArray.map((frameEntry) => (
          <FrameEntryComponent
            key={frameEntry.id}
            frameEntry={frameEntry}
            selected={frameEntry.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    );
  }
}

interface FrameEntryProps {
  key: string;
  frameEntry: FrameEntry;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

class FrameEntryComponent extends React.PureComponent<FrameEntryProps> {
  handlerSelect = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.onSelect(this.props.frameEntry.id);
  };

  render() {
    const { frameEntry, selected } = this.props;
    return (
      <li
        className={cx('frame', `frame-${frameEntry.sendingType}`, { 'frame-selected': selected })}
        onClick={this.handlerSelect}
      >
        <FontAwesome
          name={frameEntry.sendingType === 'incoming' ? 'arrow-circle-down' : 'arrow-circle-up'}
        />
        /* <span className="timestamp">{TimeStamp(frameEntry.time)}</span> */
        <span className="name">{frameEntry.text}</span>
        <span className="length">{frameEntry.length}</span>
      </li>
    );
  }
}
