import React from 'react';
import Panel from 'react-flex-panel';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import HexViewer from './HexViewer';
import {ObjectInspector} from 'react-inspector';

import './App.scss';

const padded = (num, d) => num.toFixed(0).padStart(d, '0');

const stringToBuffer = str => {
    const ui8 = new Uint8Array(str.length);
    for (let i = 0; i < str.length; ++i) {
        ui8[i] = str.charCodeAt(i);
    }
    return ui8;
};

const TimeStamp = ({time}) => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const ms = time.getMilliseconds();
    return (
        <span className="timestamp">
      {padded(h, 2)}:{padded(m, 2)}:{padded(s, 2)}.{padded(ms, 3)}
    </span>
    );
};

class ListControls extends React.Component {
    state = {
        openInput: null // 'filter' | 'name'
    };

    openNameReg = () => {
        if (this.state.openInput === 'name') {
            this.setState({openInput: null});
        } else {
            this.setState({openInput: 'name'});
        }
    };

    openFilter = () => {
        if (this.state.openInput === 'filter') {
            this.setState({openInput: null});
        } else {
            this.setState({openInput: 'filter'});
        }
    };

    render() {
        const {onClear, onStart, onStop, regName, onRegName, capturing, filter, onFilter, isFilterInverse, onFilterModeToggle} = this.props;
        return (
            <div className="list-controls">
                {capturing ? (
                    <span className="list-button record active" onClick={onStop} title="Stop"/>
                ) : (
                    <span className="list-button record" onClick={onStart} title="Start"/>
                )}
                <FontAwesome className="list-button" name="ban" onClick={onClear} title="Clear"/>
                <span className={'separator'}/>
                {/* name */}
                <FontAwesome
                    className={cx('list-button', {
                        active: !!regName
                    })}
                    name="file-signature"
                    onClick={this.openNameReg}
                    title="Clear"
                />
                <div
                    className={cx('input-wrap', {
                        hide: this.state.openInput !== 'name'
                    })}
                >
                    <input
                        className={'input'}
                        name={'reg-name'}
                        placeholder={'Name regexp:  "type":"(\\w+)"'}
                        value={regName}
                        onChange={onRegName}
                    />
                </div>

                {/* filter */}
                <FontAwesome
                    className={cx('list-button', {
                        active: !!filter
                    })}
                    name="filter"
                    onClick={this.openFilter}
                    title="Filter"
                />


                <div
                    className={cx('input-wrap', {
                        hide: this.state.openInput !== 'filter'
                    })}
                >
                    <input
                        className={'input'}
                        name={'open-filter'}
                        placeholder={'Filter regexp'}
                        value={filter}
                        onChange={onFilter}

                    />
                    <FontAwesome className="list-button" onClick={onFilterModeToggle}
                                 name={ isFilterInverse ? "check-square" : "square"}/>
                                 invert

                </div>
            </div>
        );
    }
}

class FrameList extends React.Component {
    handlerClearSelect = () => {
        this.props.onSelect(null);
    };

    render() {
        const {frames, activeId, onSelect, regName, filter, isFilterInverse} = this.props;
        return (
            <ul className="frame-list" onClick={this.handlerClearSelect}>
                {frames.map(frame => (
                    <FrameEntry
                        key={frame.id}
                        frame={frame}
                        selected={frame.id === activeId}
                        regName={regName}
                        onSelect={onSelect}
                        filter={filter}
                        isFilterInverse={isFilterInverse}
                    />
                ))}
            </ul>
        );
    }
}

function grep(text, regexp) {
    if (!(text && regexp)) {
        return;
    }
    try {
        let matchAll = text.matchAll(regexp);

        matchAll = Array.from(matchAll);
        const firstMach = matchAll[0][1] || matchAll[0][0];
        if (firstMach) {
            return firstMach;
        }
    } catch (e) {
    }
}

class FrameEntry extends React.PureComponent {
    handlerSelect = e => {
        e.stopPropagation();
        this.props.onSelect(this.props.frame.id);
    };

    getName() {
        const {frame, regName} = this.props;
        if (frame.text != null) {
            return grep(frame.text, regName) || frame.text;
        } else {
            return 'Binary Frame';
        }
    }

    checkViable() {
        const {frame, filter, isFilterInverse} = this.props;
        if (filter) {
            if (isFilterInverse) {
                return !!grep(frame.text, filter);
            } else {
                return !grep(frame.text, filter);
            }

        }
    }

    render() {
        let {frame, selected, filterMode} = this.props;
        if (this.checkViable()) return null;
        return (
            <li className={cx('frame', 'frame-' + frame.type, {'frame-selected': selected})}
                onClick={this.handlerSelect}>
                <FontAwesome name={frame.type === 'incoming' ? 'arrow-circle-down' : 'arrow-circle-up'}/>
                <TimeStamp time={frame.time}/>
                <span className="name">{this.getName()}</span>
                <span className="length">{frame.length}</span>
            </li>
        );
    }
}

const TextViewer = ({data}) => <div className="TextViewer tab-pane">{data}</div>;

const JsonViewer = ({data}) => (
    <div className="JsonViewer tab-pane">
        <ObjectInspector data={data} expandLevel={1}/>
    </div>
);

class FrameView extends React.Component {
    state = {panel: null};

    static getDerivedStateFromProps(props, state) {
        const {frame} = props;
        const panels = [];
        if (frame.binary) {
            panels.push('hex');
        }

        if (frame.text != null) {


            if (!frame.hasOwnProperty('json')) {
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

        if (!panels.includes(state.panel)) {
            return {panel: panels[0]};
        }
        return null;
    }

    makePanel(name, title) {
        return (
            <li className={cx('tab-button', {active: this.state.panel === name})}
                onClick={() => this.setState({panel: name})}>
                {title}
            </li>
        );
    }

    render() {
        const {frame} = this.props;
        const {panel} = this.state;
        return (
            <div className="FrameView">
                <ul className="tab-line">

                    {frame.json !== undefined && this.makePanel('json', 'JSON')}
                    {frame.binary != null && this.makePanel('hex', 'Hex')}
                    {frame.text != null && this.makePanel('text', 'Text')}
                </ul>
                {panel === 'text' && <TextViewer data={frame.text}/>}
                {panel === 'json' && <JsonViewer data={frame.json}/>}
                {panel === 'hex' && <HexViewer className="tab-pane" data={frame.binary}/>}
            </div>
        );
    }
}

export default class App extends React.Component {
    _uniqueId = 0;
    _issueTime = null;
    _issueWallTime = null;
    state = {frames: [], activeId: null, capturing: true, regName: '', filter: '', isFilterInverse: false};
    cacheKey = ['capturing', 'regName', 'filter', 'filterMode'];

    constructor(props) {
        super(props);
        props.handlers['Network.webSocketFrameReceived'] = this.webSocketFrameReceived.bind(this);
        props.handlers['Network.webSocketFrameSent'] = this.webSocketFrameSent.bind(this);
    }

    componentDidMount() {
        const cacheState = this.cacheKey.reduce((acc, key) => {
            const value = localStorage.getItem(key);
            if (value !== null && value !== undefined) {
                acc[key] = value
            }
            return acc
        }, {});
        this.setState(cacheState)

    }

    componentDidUpdate(prevProps, prevState) {
        this.cacheKey.forEach(key => {
            if (prevState[key] !== this.state[key]) {
                localStorage.setItem(key, this.state[key])
            }
        })
    }

    getTime(timestamp) {
        if (this._issueTime == null) {
            this._issueTime = timestamp;
            this._issueWallTime = new Date().getTime();
        }
        return new Date((timestamp - this._issueTime) * 1000 + this._issueWallTime);
    }

    render() {
        const {frames, activeId, regName, filter, isFilterInverse} = this.state;
        const active = frames.find(f => f.id === activeId);
        return (
            <Panel cols className="App">
                <Panel size={330} minSize={180} resizable className="LeftPanel">
                    <ListControls
                        onClear={this.clearFrames}
                        onStart={this.startCapture}
                        capturing={this.state.capturing}
                        onStop={this.stopCapture}
                        regName={regName}
                        onRegName={this.setRegName}
                        filter={filter}
                        onFilter={this.setFilter}
                        isFilterInverse={this.state.isFilterInverse}
                        onFilterModeToggle={this.onFilterModeToggle}


                    />
                    <FrameList
                        frames={frames}
                        activeId={activeId}
                        onSelect={this.selectFrame}
                        regName={regName}
                        filter={filter}
                        isFilterInverse={isFilterInverse}
                    />
                </Panel>
                <Panel minSize={100} className="PanelView">
                    {active != null ? <FrameView frame={active}/> :
                        <span className="message">Select a frame to view its contents</span>}
                </Panel>
            </Panel>
        );
    }

    selectFrame = id => {
        this.setState({activeId: id});
    };

    clearFrames = () => {
        this.setState({frames: []});
    };

    startCapture = () => {
        this.setState({capturing: true});
    };

    stopCapture = () => {
        this.setState({capturing: false});
    };

    setRegName = e => {
        this.setState({regName: e.target.value});
    };
    setFilter = e => {
        this.setState({filter: e.target.value});
    };

    onFilterModeToggle = () => {
        this.setState({isFilterInverse: !this.state.isFilterInverse})
    };



    addFrame(type, timestamp, response) {
        if (response.opcode === 1 || response.opcode === 2) {
            const frame = {
                type,
                name: type,
                id: ++this._uniqueId,
                time: this.getTime(timestamp),
                length: response.payloadData.length
            };
            if (response.opcode === 1) {
                frame.text = response.payloadData;
            } else {
                frame.binary = stringToBuffer(response.payloadData);
            }
            this.setState(({frames}) => ({frames: [...frames, frame]}));
        }
    }

    webSocketFrameReceived({timestamp, response}) {
        if (this.state.capturing === true) {
            this.addFrame('incoming', timestamp, response);
        }
    }

    webSocketFrameSent({timestamp, response}) {
        if (this.state.capturing === true) {
            this.addFrame('outgoing', timestamp, response);
        }
    }
}
