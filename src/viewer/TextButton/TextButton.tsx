import React, { ReactNode, useCallback } from 'react';
import './TextButton.scss';

interface TextButtonProps {
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export default function TextButton(props: TextButtonProps) {
  const { children, onClick } = props;
  const handlerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(e);
    },
    [onClick],
  );
  return (
    <div className={'TextButton'} onClick={handlerClick}>
      {children}
    </div>
  );
}
