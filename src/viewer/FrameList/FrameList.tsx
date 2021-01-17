/* eslint max-classes-per-file: 0 */
import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import FontAwesome from 'react-fontawesome';
import { TimeStamp } from '../Helpers/Helper';
import './FrameList.scss';
import { useStores } from '../../stores/RootStore';
import { FrameEntry } from '../../models/FrameEntry';
import { useObserver } from 'mobx-react';
import debounce from 'lodash/debounce';
import { IFrameSendingType } from '../types';
import { reaction } from 'mobx';
import { useDocumentEventListener } from '../../hooks/useEventListener';

export default function FrameList() {
  const { controlStore, frameStore } = useStores();
  const [isBottom, setIsBottom] = useState(true);
  const wrapperRef = useRef<HTMLUListElement>(null);
  const checkIsBottomScroll = useCallback(
    debounce(() => {
      if (wrapperRef.current) {
        const el = wrapperRef.current;
        if (el.clientHeight + el.scrollTop >= el.scrollHeight) {
          setIsBottom(true);
        } else {
          setIsBottom(false);
        }
      }
    }, 100),
    [],
  );

  const handlerClearSelect = useCallback(() => {
    controlStore.activeId = null;
  }, [controlStore]);

  const handlerSelect = useCallback(
    (id) => {
      controlStore.activeId = id;
    },
    [controlStore],
  );

  const handlerScroll = useCallback(() => {
    checkIsBottomScroll();
  }, []);

  useEffect(() => {
    return reaction(
      () => [frameStore.frames.length, controlStore.isFilterInverse, controlStore.filter],
      () => {
        requestAnimationFrame(() => {
          if (isBottom && wrapperRef.current) {
            wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
          }
        });
      },
    );
  });

  const handlerKeydown = useCallback((e) => {
    e.preventDefault();
  }, []);

  useDocumentEventListener('keydown', (e) => {
    if (controlStore.activeId) {
      e.preventDefault();
      if (e.key === 'ArrowUp') {
        console.log(`===  \n ArrowUp \n===`);
      }
      if (e.key === 'ArrowDown') {
        console.log(`===  \n ArrowDown \n===`);
      }
    }
  });

  return useObserver(() => {
    return (
      <ul
        className="frame-list"
        onScroll={handlerScroll}
        ref={wrapperRef}
        onClick={handlerClearSelect}
        onKeyDown={handlerKeydown}
      >
        {frameStore.frames.map((frameEntry) => (
          <FrameItem
            key={frameEntry.id}
            frameEntry={frameEntry}
            selected={frameEntry.id === controlStore.activeId}
            onSelect={handlerSelect}
          />
        ))}
      </ul>
    );
  });
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
          frameEntry.sendingType === IFrameSendingType.INC ? 'arrow-circle-down' : 'arrow-circle-up'
        }
      />
      <span className="name">{frameEntry.name}</span>
      <span className="length">{frameEntry.length}</span>
      <span className="timestamp">{TimeStamp(frameEntry.time)}</span>
    </li>
  ));
}
