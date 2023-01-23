import * as React from 'react';
import BigNumber from 'bignumber.js';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import { faChartArea } from '@fortawesome/pro-solid-svg-icons/faChartArea';

import { EpochGear } from 'pages/Layout/GlobalStatsCard/EpochGear';
import { CardItem } from 'components';

import { useSelector } from 'react-redux';
import { economicsSelector, statsSelector } from 'redux/selectors';

export const GlobalStatsCard = () => {
  const ref = React.useRef(null);

  const { economicsFetched, circulatingSupply, staked, totalStakedPercent, marketCap, price } =
    useSelector(economicsSelector);
  const { statsFetched, accounts, transactions } = useSelector(statsSelector);

  return (
    <div ref={ref} className="global-stats-card">
      <div className="row">
        <div className="col">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center">
                <EpochGear />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="n3 lg title-bold" title="Market Info" icon={faChartArea}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary me-3">EGLD Price:</span>
                      {economicsFetched ? `$${new BigNumber(price).toFormat(2)}` : '...'}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary me-3">Market Cap:</span>
                      {economicsFetched ? `$${new BigNumber(marketCap).toFormat(0)}` : '...'}
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg title-bold" title="Economics" icon={faChartPie}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary me-1">Circulating Supply:</span>

                      {economicsFetched ? new BigNumber(circulatingSupply).toFormat(0) : '...'}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary me-1">Total Staked:</span>
                      {economicsFetched ? new BigNumber(staked).toFormat(0) : '...'} (
                      {economicsFetched
                        ? `${new BigNumber(totalStakedPercent).toFormat(0)}%`
                        : '...'}
                      )
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg title-bold" title="Usage" icon={faUsers}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary me-3">Addresses:</span>
                      {statsFetched ? new BigNumber(accounts).toFormat(0) : '...'}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary me-3">Transactions:</span>
                      {statsFetched ? new BigNumber(transactions).toFormat(0) : '...'}
                    </div>
                  </div>
                </CardItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
