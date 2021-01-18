import React, { ChangeEvent } from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import './ControlPanel.scss';
import { useStores } from '../../stores/RootStore';
import { IOpenInput } from '../../stores/controlStore';
import { useObserver } from 'mobx-react';

export const ControlPanel = () => {
  const { controlStore, frameStore, chromeStore } = useStores();

  const onRegName = (e: ChangeEvent<HTMLInputElement>) => {
    controlStore.regName = e.target.value;
  };

  const onFilter = (e: ChangeEvent<HTMLInputElement>) => {
    controlStore.filter = e.target.value;
  };

  const openNameReg = () => {
    if (controlStore.openInput === IOpenInput.name) {
      controlStore.openInput = IOpenInput.close;
    } else {
      controlStore.openInput = IOpenInput.name;
    }
  };
  const openFilter = () => {
    if (controlStore.openInput === IOpenInput.filter) {
      controlStore.openInput = IOpenInput.close;
    } else {
      controlStore.openInput = IOpenInput.filter;
    }
  };

  const onClear = () => {
    frameStore.deleteAllFrameEntries();
  };
  const onFilterModeToggle = () => {
    controlStore.isFilterInverse = !controlStore.isFilterInverse;
  };
  const toggleIsCapturing = () => {
    controlStore.isCapturing = !controlStore.isCapturing;
  };

  return useObserver(() => (
    <div className="list-controls">
      {!chromeStore.isAttached ?
        <span
          className={'list-button record'}
          onClick={chromeStore.startDebugging}
          title={'Start'}
        />
        : <span
          className={controlStore.isCapturing ? 'list-button record active' : 'list-button record'}
          onClick={toggleIsCapturing}
          title={controlStore.isCapturing ? 'Stop' : 'Start'}
        />}
      <FontAwesome className="list-button" name="ban" onClick={onClear} title="Clear" />
      <div>{controlStore.isCapturing}</div>
      <span className={'separator'} />
      {/* name */}
      <FontAwesome
        className={cx('list-button', {
          active: !!controlStore.regName,
        })}
        name="file-signature"
        onClick={openNameReg}
        title="Parse Name"
      />
      <div
        className={cx('input-wrap', {
          hide: controlStore.openInput !== IOpenInput.name,
        })}
      >
        <input
          className={'input'}
          name={'reg-name'}
          placeholder={'Name: "type":\\s?"(\\w+)"'}
          value={controlStore.regName}
          onChange={onRegName}
        />
      </div>

      {/* filter */}
      <FontAwesome
        className={cx('list-button', {
          active: !!controlStore.filter,
        })}
        name="filter"
        onClick={openFilter}
        title="Filter"
      />

      <div
        className={cx('input-wrap', {
          hide: controlStore.openInput !== IOpenInput.filter,
        })}
      >
        <input
          className={'input'}
          name={'open-filter'}
          placeholder={'Filter regexp: PING|PONG'}
          value={controlStore.filter}
          onChange={onFilter}
        />
        <FontAwesome
          className="list-button"
          onClick={onFilterModeToggle}
          name={controlStore.isFilterInverse ? 'check-square' : 'square'}
        /> invert
      </div>
    </div>
  ));
};
