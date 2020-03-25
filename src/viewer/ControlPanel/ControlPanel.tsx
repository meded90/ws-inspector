import React, { ChangeEvent, MouseEvent } from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import './ControlPanel.scss';
import { EFilter } from '../types';

type ControlPanelMode = {
  isCapturing: boolean;
  onClear: (event: MouseEvent) => void;
  onFilterModeToggle: (event: MouseEvent) => void;
  onCapturingToggle: (event: MouseEvent) => void;
  handleRegName: (arg0: string) => void;
  handleFilter: (arg0: string) => void;
};
interface ControlPanelProps extends ControlPanelMode, EFilter {}
interface ControlPanelState {
  openInput?: null | 'filter' | 'name';
}

export default class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
  constructor(props: ControlPanelProps) {
    super(props);
    this.state = {
      openInput: null, // 'filter' | 'name'
    };
  }

  openNameReg = () => {
    if (this.state.openInput === 'name') {
      this.setState({ openInput: null });
    } else {
      this.setState({ openInput: 'name' });
    }
  };

  openFilter = () => {
    if (this.state.openInput === 'filter') {
      this.setState({ openInput: null });
    } else {
      this.setState({ openInput: 'filter' });
    }
  };

  render() {
    const {
      onClear,
      onCapturingToggle,
      regName,
      handleRegName,
      isCapturing,
      filter,
      handleFilter,
      isFilterInverse,
      onFilterModeToggle,
    } = this.props;

    const onRegName = (e: ChangeEvent<HTMLInputElement>) => {
      handleRegName(e.target.value);
    };

    const onFilter = (e: ChangeEvent<HTMLInputElement>) => {
      handleFilter(e.target.value);
    };

    return (
      <div className="list-controls">
        <span
          className={isCapturing ? 'list-button record active' : 'list-button record'}
          onClick={onCapturingToggle}
          title={isCapturing ? 'Stop' : 'Start'}
        />
        <FontAwesome className="list-button" name="ban" onClick={onClear} title="Clear" />
        <span className={'separator'} />
        {/* name */}
        <FontAwesome
          className={cx('list-button', {
            active: !!regName,
          })}
          name="file-signature"
          onClick={this.openNameReg}
          title="RexExp"
        />
        <div
          className={cx('input-wrap', {
            hide: this.state.openInput !== 'name',
          })}
        >
          <input
            className={'input'}
            name={'reg-name'}
            placeholder={'Name regexp: "type":"(\\w+)"'}
            value={regName}
            onChange={onRegName}
          />
        </div>

        {/* filter */}
        <FontAwesome
          className={cx('list-button', {
            active: !!filter,
          })}
          name="filter"
          onClick={this.openFilter}
          title="Filter"
        />

        <div
          className={cx('input-wrap', {
            hide: this.state.openInput !== 'filter',
          })}
        >
          <input
            className={'input'}
            name={'open-filter'}
            placeholder={'Filter regexp'}
            value={filter}
            onChange={onFilter}
          />
          <FontAwesome
            className="list-button"
            onClick={onFilterModeToggle}
            name={isFilterInverse ? 'check-square' : 'square'}
          />
          invert
        </div>
      </div>
    );
  }
}
