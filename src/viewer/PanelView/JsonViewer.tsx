import { ObjectInspector, ObjectInspectorProps } from 'react-inspector';
import React from 'react';
import { toJS } from 'mobx';

export default function JsonViewer(data: ObjectInspectorProps) {
  return (
    <div className="JsonViewer tab-pane">
      <ObjectInspector data={toJS(data)} expandLevel={2} />
    </div>
  );
}
