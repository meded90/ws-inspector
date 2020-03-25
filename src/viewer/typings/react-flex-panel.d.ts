declare module 'react-flex-panel' {
  export class Panel {
    rows: boolean;
    cols: boolean;
    size: number;
    minSize: number;
    maxSize: number;
    flex: number;
    resizable: boolean;
    panelRef: void;
    constructor(props: any, context: any);
    onResize: () => number;
    renderChildren: () => void;
    onRef: () => void;
    render: () => any;
  }
}
