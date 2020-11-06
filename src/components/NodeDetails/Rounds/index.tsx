import * as React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export interface RoundType {
  key: string;
  value: boolean;
}

const Rounds = ({ rounds }: { rounds: RoundType[] }) => {
  return (
    <>
      <div className="card" data-testid="roundsContainer">
        {/* {roundsFetched === false && (
          <PageState
            icon={faCogs}
            title={isWaiting ? 'Validator not in consensus' : 'Unable to load rounds'}
            className="page-state-sm d-flex h-100 align-items-center justify-content-center"
            dataTestId="roundsErrorScreen"
          />
        )} */}

        <>
          <div className="card-header">
            <div className="card-header-item">
              <h6 className="m-0">Last Consensus Rounds</h6>
            </div>
          </div>
          <div className="card-body">
            <div className="squares" data-testid="rounds">
              {rounds.length &&
                rounds.map((round: any) => (
                  <OverlayTrigger
                    key={round.key}
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props: any) => (
                      <Tooltip id={round.key} {...props}>
                        Block {round.value ? ' ' : ' not '} proposed{' '}
                        {round.key.indexOf('_') > 0 ? round.key.split('_').pop() : round.key}
                      </Tooltip>
                    )}
                  >
                    <div className={round.value ? 'full square-block' : 'square-block'} />
                  </OverlayTrigger>
                ))}
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Rounds;
