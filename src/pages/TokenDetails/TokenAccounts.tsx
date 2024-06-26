import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD } from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  FormatAmount,
  PageState,
  AccountLink,
  FormatNumber,
  FormatUSD,
  PercentageBar
} from 'components';
import { formatBigNumber, parseAmount } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { faUser } from 'icons/regular';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { AccountType } from 'types';

export const TokenDetailsAccounts = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { token } = useSelector(tokenSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { page, size } = useGetPage();
  const { getTokenAccounts, getTokenAccountsCount } = useAdapter();

  const {
    identifier,
    price,
    marketCap,
    supply,
    isLowLiquidity,
    decimals,
    accounts: totalAccounts
  } = token;

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchAccounts = () => {
    Promise.all([
      getTokenAccounts({ tokenId: identifier, page, size }),
      getTokenAccountsCount({ tokenId: identifier })
    ]).then(([tokenAccountsData, tokenAccountsCountData]) => {
      if (ref.current !== null) {
        if (tokenAccountsData.success && tokenAccountsCountData.success) {
          setAccounts(tokenAccountsData.data);
          setAccountsCount(tokenAccountsCountData.data);
          setDataReady(true);
        }
      }
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, totalAccounts, searchParams, identifier]);

  const hasSupply = new BigNumber(supply ?? 0).isGreaterThan(0);
  const showAccounts = dataReady === true && accounts.length > 0;
  const showValue =
    price &&
    marketCap &&
    (!isLowLiquidity ||
      new BigNumber(marketCap).isLessThan(
        LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
      ));

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <TokenTabs />
            <Pager
              total={accountsCount}
              show={accounts.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          </div>
        </div>
        {showAccounts ? (
          <>
            <div className='card-body'>
              <div className='table-wrapper animated-list'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th className={classNames({ 'w-50': !price })}>
                        Address
                      </th>
                      <th>Balance</th>
                      {hasSupply && (
                        <th className='percentage-column'>Percentage</th>
                      )}
                      {showValue && <th className='value-column'>Value</th>}
                    </tr>
                  </thead>
                  <tbody data-testid='accountsTable'>
                    {accounts.map((account) => {
                      const holdingsPercentage = new BigNumber(account.balance)
                        .times(100)
                        .dividedBy(parseAmount(supply, decimals));

                      return (
                        <tr key={account.address}>
                          <td>
                            <div className='d-flex align-items-center gap-2'>
                              <AccountLink
                                address={account.address}
                                assets={account?.assets}
                                className={price ? 'hash hash-xl' : 'full-hash'}
                                linkClassName={price ? '' : 'trim-only-sm'}
                              />
                            </div>
                          </td>
                          <td>
                            <FormatAmount
                              value={account.balance}
                              decimals={decimals}
                              showLastNonZeroDecimal={true}
                              showLabel={false}
                              showSymbol={false}
                              showUsdValue={false}
                            />
                          </td>
                          {hasSupply && (
                            <td>
                              <div className='mb-1'>
                                <FormatNumber
                                  value={holdingsPercentage}
                                  label='%'
                                />
                              </div>
                              <PercentageBar
                                overallPercent={0}
                                fillPercent={holdingsPercentage.toNumber()}
                                fillPercentLabel={`${formatBigNumber({
                                  value: holdingsPercentage
                                })}%`}
                                type='small'
                              />
                            </td>
                          )}
                          {showValue && (
                            <td>
                              <FormatUSD
                                value={account.balance}
                                decimals={decimals}
                                usd={price}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer table-footer'>
              <PageSize />
              <Pager total={accountsCount} show={accounts.length > 0} />
            </div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader data-testid='tokenAccountsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title='Unable to load Accounts'
                isError
              />
            )}
            {dataReady === true && accounts.length === 0 && (
              <PageState icon={faUser} title='No Accounts' />
            )}
          </>
        )}
      </div>
    </div>
  );
};
