import { useState, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { NetworkLink } from 'components';
import { useIsMainnet } from 'hooks';
import { faGrid, faGrid2 } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';
import { Applications } from './components/Applications';
import { Links } from './components/Links';
import { Switcher } from './components/Switcher';
import { HeaderPropsType } from './types';

export const Header = (props: HeaderPropsType) => {
  const isMainnet = useIsMainnet();

  const { id, name } = useSelector(activeNetworkSelector);
  const explorerTitle = id !== 'mainnet' ? `${name} Explorer` : 'Explorer';

  const { onExpand } = props;

  const [menuActive, setMenuActive] = useState(false);
  const [applicationsActive, setApplicationsActive] = useState(false);

  const onMenuToggle = (event: MouseEvent) => {
    if (window.innerWidth <= 768) {
      onExpand(!menuActive);
    }

    event.preventDefault();
    setApplicationsActive(false);
    setTimeout(
      () => setMenuActive((menuActive) => !menuActive),
      applicationsActive ? 400 : 0
    );
  };

  const onApplicationsToggle = (event: MouseEvent) => {
    event.preventDefault();
    setMenuActive(false);

    setTimeout(
      () => {
        if (window.innerWidth <= 768) {
          onExpand(!applicationsActive);
        }

        setApplicationsActive((applicationsActive) => !applicationsActive);
      },
      menuActive ? 400 : 0
    );
  };

  const onApplicationsClose = () => {
    setApplicationsActive(false);
    onExpand(false);
  };

  const onMenuClose = () => {
    setMenuActive(false);
    onExpand(false);
  };

  return (
    <header className='header'>
      <div className='wrapper'>
        <NetworkLink to='/' className='logo' aria-label='MultiversX Explorer'>
          {isMainnet ? (
            <MultiversXLogo />
          ) : (
            <span className='header-symbol'>
              <MultiversXSymbol />
              <span className='header-title'>{explorerTitle}</span>
            </span>
          )}
        </NetworkLink>
      </div>

      <div className='burger' onClick={onMenuToggle}>
        <div className={classNames('bars', { active: menuActive })}>
          {Array.from({ length: 3 }).map((_item, index) => (
            <span className='bar' key={`bar-${index}`} />
          ))}
        </div>
      </div>

      <div
        tabIndex={0}
        onClick={onApplicationsToggle}
        onBlur={() => setTimeout(onApplicationsClose, 100)}
        className={classNames('matrix', {
          active: applicationsActive
        })}
      >
        <FontAwesomeIcon icon={faGrid} className='desktop' />
        <FontAwesomeIcon icon={faGrid2} className='mobile' />
      </div>

      <div
        className={classNames('applicationswrapper', {
          active: applicationsActive
        })}
      >
        <Applications />
      </div>

      <div
        className={classNames('menuwrapper', {
          active: menuActive
        })}
      >
        <Links onClick={onMenuClose} />
        <Switcher />
      </div>
    </header>
  );
};
