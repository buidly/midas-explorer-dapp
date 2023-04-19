import React from 'react';

import { NetworkLink, Trim } from 'components';
import { RowIcon } from 'components/NodesTable/RowIcon';
import { RowIssueIcon } from 'components/NodesTable/RowIssueIcon';
import { urlBuilder } from 'helpers';
import { NodeType } from 'types';

export const StatisticsRow = ({ nodeData }: { nodeData: NodeType }) => {
  return (
    <>
      <td>
        <div className='d-flex align-items-center'>
          <RowIcon node={nodeData} />
          <NetworkLink
            to={urlBuilder.nodeDetails(nodeData.bls)}
            className='trim-wrapper'
          >
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <RowIssueIcon node={nodeData} />
        </div>
      </td>
      <td>
        {nodeData.name ? (
          <div className='truncate-item-md'>{nodeData.name}</div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.leaderSuccess ? (
          nodeData.leaderSuccess.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.leaderFailure ? (
          nodeData.leaderFailure.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.validatorSuccess ? (
          nodeData.validatorSuccess.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.validatorFailure ? (
          nodeData.validatorFailure.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.validatorIgnoredSignatures ? (
          nodeData.validatorIgnoredSignatures.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.tempRating ? (
          nodeData.tempRating.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
    </>
  );
};
