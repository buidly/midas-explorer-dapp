import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { Loader, PageState, SharedIdentity } from 'components';
import { BlocksTable } from 'components/BlocksTable/BlocksTable';
import { FailedBlocks } from 'components/BlocksTable/components/FailedBlocks';
import { NoBlocks } from 'components/BlocksTable/components/NoBlocks';
import { useAdapter, useIsMainnet } from 'hooks';
import { faCogs } from 'icons/regular';
import { statsSelector } from 'redux/selectors';
import {
  BlockType,
  IdentityType,
  NodeType,
  NodeStatusEnum,
  NodeTypeEnum
} from 'types';

import { NetworkMetrics } from './components/NetworkMetrics';
import { NodeInformation } from './components/NodeInformation';
import { Rounds, RoundType } from './components/Rounds';
import { ValidatorDetails } from './components/ValidatorDetails';

interface NodeDetailType<T> {
  data?: T;
  success: boolean | undefined;
}

const initialState = {
  success: undefined
};

export const NodeDetails = () => {
  const ref = useRef(null);

  const { hash: publicKey } = useParams() as any;
  const { search } = useLocation();
  const { getNode, getIdentity, getRounds, getBlocks } = useAdapter();
  const isMainnet = useIsMainnet();

  const stats = useSelector(statsSelector);

  const {
    isFetched,
    unprocessed: { epoch }
  } = stats;

  const [dataReady, setDataReady] = useState<boolean | undefined>(true);
  const [node, setNode] = useState<NodeDetailType<NodeType>>(initialState);
  const [identity, setIdentity] =
    useState<NodeDetailType<IdentityType>>(initialState);
  const [rounds, setRounds] =
    useState<NodeDetailType<RoundType[]>>(initialState);
  const [blocks, setBlocks] =
    useState<NodeDetailType<BlockType[]>>(initialState);

  const fetchNodes = () => {
    setDataReady(undefined);
    getNode(publicKey).then((nodeData) => {
      if (ref.current !== null) {
        if (nodeData.success) {
          const fetchIdentity =
            isMainnet && nodeData.data.identity !== undefined;
          const hasExtendedInfo =
            nodeData.data.type !== NodeTypeEnum.observer &&
            nodeData.data.status !== NodeStatusEnum.queued;

          const shard = nodeData.data.shard;

          if (hasExtendedInfo && isFetched) {
            const promises = [
              getRounds({ validator: publicKey, shard, epoch }),
              getBlocks({ proposer: publicKey, shard, epoch }),
              ...(fetchIdentity ? [getIdentity(nodeData.data.identity)] : [])
            ];
            Promise.all(promises).then((response) => {
              const [roundsData, blocksData, identityData] = response;
              if (ref.current !== null) {
                setNode(nodeData);

                setBlocks({
                  data: blocksData.success ? blocksData.data.blocks : [],
                  success: blocksData.success
                });

                setRounds({
                  data: roundsData.success
                    ? (roundsData as any).data.map((round: any) => ({
                        key: round.round,
                        value: round.blockWasProposed
                      }))
                    : [],
                  success: roundsData.success
                });

                if (isMainnet && identityData) {
                  setIdentity(identityData);
                }

                setDataReady(nodeData.success);
              }
            });
          } else {
            if (isMainnet && nodeData.data.identity !== undefined) {
              getIdentity(nodeData.data.identity).then((identityData) => {
                if (ref.current !== null) {
                  if (isMainnet && identityData) {
                    setIdentity(identityData);
                    setNode(nodeData);
                    setDataReady(true);
                  }
                }
              });
            } else {
              setNode(nodeData);
              setDataReady(true);
            }
          }
        } else {
          setDataReady(false);
        }
      }
    });
  };

  useEffect(fetchNodes, [search, publicKey, isFetched]);

  const showIdentity =
    identity.success === false ||
    (identity.success && identity.data !== undefined);

  const showExtendedInfo =
    node.data !== undefined &&
    node.data.type !== NodeTypeEnum.observer &&
    node.data.status !== NodeStatusEnum.queued;

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to locate this Node' isError />
      )}
      <div ref={ref}>
        {dataReady === true && node.data !== undefined && (
          <>
            {showIdentity && (
              <div className='row'>
                <div className='col mb-3'>
                  <SharedIdentity.Summary identity={identity.data} />
                </div>
              </div>
            )}

            <div className='row'>
              <div className='mb-3 col'>
                <NodeInformation nodeData={node.data} />
              </div>
            </div>

            {showExtendedInfo && (
              <>
                <div className='row'>
                  <div className='mb-3 col'>
                    <ValidatorDetails nodeData={node.data} />
                  </div>
                </div>

                <div className='row'>
                  <div className='mb-3 col-md-6'>
                    <NetworkMetrics node={node.data} />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <Rounds rounds={rounds} node={node.data} />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <div className='card'>
                      {blocks.success === false && <FailedBlocks />}
                      {blocks.success && blocks.data && (
                        <>
                          {blocks.data.length === 0 && (
                            <NoBlocks
                              title={`${
                                node.data.status === 'eligible'
                                  ? 'No blocks'
                                  : 'Validator not in consensus'
                              }`}
                            />
                          )}
                          {blocks.data.length > 0 && (
                            <>
                              <div className='card-header'>
                                <div className='card-header-item'>
                                  <h5 className='mb-0 d-flex align-items-center'>
                                    Latest Proposed Blocks
                                  </h5>
                                </div>
                              </div>
                              <div className='card-body'>
                                <BlocksTable
                                  blocks={blocks.data}
                                  shard={undefined}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
