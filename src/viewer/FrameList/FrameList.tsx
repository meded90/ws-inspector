/* eslint max-classes-per-file: 0 */
import React, { MouseEvent, useCallback } from 'react';
import cx from 'classnames';
import FontAwesome from 'react-fontawesome';
import { TimeStamp } from '../Helpers/Helper';
import './FrameList.scss';
import { useStores } from '../../stores/RootStore';
import { FrameEntry } from '../../models/FrameEntry';
import { useObserver } from 'mobx-react';
import { frameSendingType } from '../types';

export default function FrameList() {
  const { controlStore, frameStore } = useStores();

  const handlerClearSelect = useCallback(() => {
    controlStore.activeId = null;
  }, []);

  const handlerSelect = useCallback((id) => {
    controlStore.activeId = id;
  }, []);

  //TODO: ADD auto scroll to new frame

  return useObserver(() => (
    <ul className="frame-list" onClick={handlerClearSelect}>
      {frameStore.frames.map((frameEntry) => (
        <FrameItem
          key={frameEntry.id}
          frameEntry={frameEntry}
          selected={frameEntry.id === controlStore.activeId}
          onSelect={handlerSelect}
        />
      ))}
    </ul>
  ));
}

interface FrameItemProps {
  frameEntry: FrameEntry;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

function FrameItem(props: FrameItemProps) {
  const { frameEntry, selected } = props;

  const handlerSelect = (e: MouseEvent) => {
    e.stopPropagation();
    props.onSelect(props.frameEntry.id);
  };

  return useObserver(() => (
    <li
      className={cx('frame', `frame-${frameEntry.sendingType}`, {
        'frame-selected': selected,
        hide: frameEntry.isFiltered,
      })}
      onClick={handlerSelect}
    >
      <FontAwesome
        name={
          frameEntry.sendingType === frameSendingType.INC ? 'arrow-circle-down' : 'arrow-circle-up'
        }
      />
      <span className="name">{frameEntry.name}</span>
      <span className="length">{frameEntry.length}</span>
      <span className="timestamp">{TimeStamp(frameEntry.time)}</span>
    </li>
  ));
}
