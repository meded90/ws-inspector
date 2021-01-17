import React, { useCallback, useState } from 'react';
import { useStores } from '../../stores/RootStore';
import { useObserver } from 'mobx-react';
import './Overlay.scss';
import cx from 'classnames';
import TextButton from '../TextButton/TextButton';

export default function Overlay() {
  const { chromeStore } = useStores();
  const [isSmall, setSmall] = useState(false);
  const handlerToggleSmall = useCallback(() => {
    setSmall(!isSmall);
  }, [isSmall, setSmall]);
  return useObserver(() => {
    return (
      <div
        className={cx('Overlay', {
          hide: chromeStore.isAttached,
          small: isSmall,
        })}
        onClick={handlerToggleSmall}
      >
        <div>
          Attaches debugger to the given page. <br />
          <TextButton onClick={chromeStore.startDebugging}>Activate</TextButton>
        </div>
      </div>
    );
  });
}
