import React from 'react';

export default function TextViewer({ data }: { data: string | undefined }) {
  return <div className="TextViewer tab-pane">{data}</div>;
}
