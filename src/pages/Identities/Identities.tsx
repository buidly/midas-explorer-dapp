import { useEffect, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import { Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { IdentityType } from 'types';

import { IdentityRow, ResiliencyRow } from './components';

export const Identities = () => {
  const ref = useRef(null);
  const { getIdentities } = useAdapter();

  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>(undefined);

  let coefficientShown = false;

  const fetchIdentities = () => {
    getIdentities().then(({ data, success }) => {
      const identitiesList: IdentityType[] = [];
      let overallStakePercent = 0;

      if (success) {
        data.forEach((identity: IdentityType) => {
          if (!identity.stake || !identity.validators) {
            return;
          }
          identitiesList.push({ ...identity, overallStakePercent });
          overallStakePercent = overallStakePercent + identity.stakePercent;
        });
        setIdentities(identitiesList);
      }

      setDataReady(success);
    });
  };

  useEffect(fetchIdentities, []);

  return (
    <div className='card identities' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load validators' isError />
      )}
      {dataReady === true && (
        <div className='card-body'>
          <div className='table-wrapper animated-list'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th className='th-rank'>#</th>
                  <th className='th-name'>Name</th>
                  <th>Stake</th>
                  <th className='th-stake-percent'>Cumulative stake</th>
                  <th className='w-10 text-end'>Nodes</th>
                  <th className='th-details'>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {identities.map((identity, i) => {
                  // temporary - will be fetched from /stake
                  const isOverCoefficient =
                    new BigNumber(
                      identity?.overallStakePercent ?? 0
                    ).isGreaterThan(33.33) && !coefficientShown;
                  if (isOverCoefficient) {
                    coefficientShown = true;
                  }
                  return (
                    <>
                      {isOverCoefficient && <ResiliencyRow coefficient={i} />}
                      <IdentityRow key={i} identity={identity} />
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
