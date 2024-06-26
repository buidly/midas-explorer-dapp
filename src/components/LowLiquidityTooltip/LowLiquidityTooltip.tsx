import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FormatUSD, Overlay } from 'components';
import { faSquareInfo } from 'icons/solid';
import { TokenType, WithClassnameType } from 'types';

export interface LowLiquidityTooltipUIType extends WithClassnameType {
  token?: TokenType;
  showTotalLiquidity?: boolean;
}

export const LowLiquidityTooltip = ({
  token,
  showTotalLiquidity = true,
  className
}: LowLiquidityTooltipUIType) => {
  if (!token) {
    return null;
  }

  const { totalLiquidity, isLowLiquidity } = token;
  if (!isLowLiquidity) {
    return null;
  }

  return (
    <Overlay
      title={
        <>
          Less than 0.5% of total Token Supply captured in xExchange Liquidity
          Pools.
          {showTotalLiquidity && totalLiquidity && (
            <>
              (<FormatUSD value={totalLiquidity} usd={1} />)
            </>
          )}
        </>
      }
      className={classNames(className)}
      persistent
    >
      <FontAwesomeIcon icon={faSquareInfo} className='text-warning' />
    </Overlay>
  );
};
