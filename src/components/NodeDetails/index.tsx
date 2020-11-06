import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, PageState } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType } from 'context/state';
import Alert from './Alert';
import NodeInformation from './NodeInformation';
import Identity from './Identity';
import NetworkMetrics from './NetworkMetrics';
import Rounds, { RoundType } from './Rounds';
import RatingsChart, { RatingType } from './RatingsChart';

const NodeDetails = () => {
  const ref = React.useRef(null);
  const { publicKey } = useParams() as any;
  const { search } = useLocation();
  const { getNode, getIdentity, getNewRounds, getHisoricRatings } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(true);
  const [node, setNode] = React.useState<ValidatorType>();
  const [identity, setIdentity] = React.useState<IdentityType>();
  const [rounds, setRounds] = React.useState<RoundType[]>();
  const [ratings, setRatings] = React.useState<RatingType[]>();

  const fetchNodes = () => {
    setDataReady(undefined);
    Promise.all([getNode(publicKey)]).then(([nodeData]) => {
      // if (ref.current !== null) {
      const newNode: ValidatorType = nodeData.data;
      if (newNode) {
        Promise.all([
          getIdentity(newNode.identity),
          getNewRounds(publicKey),
          getHisoricRatings(publicKey),
        ]).then(([identityData, roundsData, historicRatingsData]) => {
          setNode(newNode);
          setIdentity(identityData.data);
          // TODO: redo
          setRounds(
            roundsData.data.map((round: any) => ({
              key: round.id,
              value: round.blockWasProposed,
            }))
          );
          setRatings(historicRatingsData.data);
        });
      }

      setDataReady(nodeData.success);
      // }
    });
  };

  React.useEffect(fetchNodes, [search]);

  return (
    <div ref={ref}>
      {dataReady === undefined && <Loader />}
      {dataReady === true && node && (
        <>
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Node Information
                </h3>
              </div>
            </div>
            <Alert node={node} />
            <div className="row">
              <div className="col-md-8 mt-spacer">
                <NodeInformation node={node} />
              </div>
              <div className="col-md-4 mt-spacer">
                {identity && <Identity identity={identity} />}
              </div>
            </div>
            <div className="row">
              <div className="mt-spacer col-md-4">
                <NetworkMetrics node={node} />
              </div>

              <div className="col-md-4 mt-spacer">
                {ratings && <RatingsChart ratings={ratings} />}
              </div>
              <div className="col-md-4 mt-spacer">{rounds && <Rounds rounds={rounds} />}</div>
            </div>
          </div>
        </>
      )}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to locate this node"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
    </div>
  );
};

export default NodeDetails;
