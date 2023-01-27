import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdapter, Loader, ScResultsTable } from 'components';

import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { urlBuilder } from 'helpers';
import { useGetFilters, useNetworkRoute } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { ScResultType } from 'types';

import { AccountTabs } from './AccountLayout/AccountTabs';

export const AccountScResults = () => {
  const ref = React.useRef(null);
  const navigate = useNavigate();

  const { size } = useGetFilters();
  const networkRoute = useNetworkRoute();
  const { adapter, id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { txCount } = useSelector(accountSelector);

  const { getAccountScResults, getAccountScResultsCount } = useAdapter();

  const { hash: address } = useParams() as any;
  const scResultsActive = adapter === 'api';

  const [isDataReady, setIsDataReady] = React.useState<boolean | undefined>();
  const [accountScResults, setAccountScResults] = React.useState<
    ScResultType[]
  >([]);
  const [accountScResultsCount, setAccountScResultsCount] = React.useState(0);

  const fetchAccountScResults = () => {
    if (scResultsActive) {
      Promise.all([
        getAccountScResults({
          size,
          address
        }),
        getAccountScResultsCount(address)
      ]).then(([accountScResultsData, accountScResultsCountData]) => {
        if (ref.current !== null) {
          if (
            accountScResultsData.success &&
            accountScResultsCountData.success
          ) {
            setAccountScResults(accountScResultsData.data);
            setAccountScResultsCount(accountScResultsCountData.data);
          }
          setIsDataReady(
            accountScResultsData.success && accountScResultsCountData.success
          );
        }
      });
    }
  };

  React.useEffect(() => {
    fetchAccountScResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txCount, activeNetworkId, address, size]);

  return !scResultsActive ? (
    navigate(networkRoute(urlBuilder.accountDetails(address)))
  ) : (
    <div className='card' ref={ref}>
      <div className='row'>
        <div className='col-12'>
          {isDataReady === true && accountScResults.length > 0 ? (
            <ScResultsTable
              scResults={accountScResults}
              address={address}
              totalScResults={accountScResultsCount}
              size={size}
              title={<AccountTabs />}
            />
          ) : (
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center'>
                  <AccountTabs />
                </div>
              </div>
              {isDataReady === undefined && <Loader />}
              {isDataReady === false && <FailedScResults />}
              {isDataReady === true && accountScResults.length === 0 && (
                <NoScResults />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
