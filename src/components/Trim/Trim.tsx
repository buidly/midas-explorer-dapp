import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { useDebounce } from 'hooks';
import { WithClassnameType } from 'types';

interface TrimUIType extends WithClassnameType {
  text: string;
}

export const Trim = ({
  text,
  className,
  'data-testid': dataTestId = ''
}: TrimUIType) => {
  const [debounce, setDebounce] = useState(0);

  const [overflow, setOverflow] = useState(false);
  const trimRef = useRef(document.createElement('span'));
  const hiddenTextRef = useRef(document.createElement('span'));
  const debounceTracker = useDebounce(debounce, 300);

  const listener = () => {
    setDebounce(debounce + 1);
  };

  const effect = () => {
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  };

  useEffect(effect, [debounce]);

  useEffect(() => {
    if (trimRef.current && hiddenTextRef.current) {
      const diff =
        hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
      setOverflow(diff > 1);
    }
  }, [debounceTracker]);

  return (
    <span
      ref={trimRef}
      className={classNames('trim', className, { overflow: Boolean(overflow) })}
    >
      <span
        ref={hiddenTextRef}
        className='hidden-text-ref'
        data-testid={dataTestId}
      >
        {text}
      </span>

      {overflow ? (
        <>
          <span className='left'>
            <span>
              {String(text).substring(0, Math.floor(text.length / 2))}
            </span>
          </span>
          <span className='ellipsis'>...</span>
          <span className='right'>
            <span>{String(text).substring(Math.ceil(text.length / 2))}</span>
          </span>
        </>
      ) : (
        <>{text}</>
      )}
    </span>
  );
};
