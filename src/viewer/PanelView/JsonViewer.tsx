import { ObjectInspector, ObjectInspectorProps } from 'react-inspector';
import React from 'react';

export default function JsonViewer(data: ObjectInspectorProps) {
  return (
    <div className="JsonViewer tab-pane">
      <ObjectInspector data={data} expandLevel={3} />
    </div>
  );
}
