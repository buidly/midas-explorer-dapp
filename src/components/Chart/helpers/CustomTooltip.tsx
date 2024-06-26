import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { formatAmount, usdValue } from 'helpers';
import { economicsSelector } from 'redux/selectors';

const getTooltipLabel = (label: string) => {
  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  if (!label) {
    return '';
  }

  switch (label.toLowerCase()) {
    case 'nolabel':
    case 'value':
      return '';

    case 'volume':
      return 'Volume';

    case 'total':
      return 'Total';
    case 'totaladdresses':
      return 'Total Addresses';
    case 'totalstaked':
      return 'Total Staked';

    default:
      return capitalize(label);
  }
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  currency,
  percentageMultiplier,
  decimals,
  customLabel,
  showUsdValue,
  dateFormat
}: {
  active?: boolean;
  payload?: any;
  label?: any;
  currency?: string;
  percentageMultiplier?: number;
  decimals?: number;
  customLabel?: string;
  showUsdValue?: boolean;
  dateFormat?: string;
}) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  if (active && payload && payload.length && isFetched) {
    return (
      <div className='custom-tooltip'>
        <ul className='recharts-tooltip-item-list list-unstyled'>
          {payload.map((entry: any) => {
            let displayValue = entry.value;
            if (decimals) {
              const formattedValue = formatAmount({
                input: new BigNumber(displayValue).toString(10),
                decimals,
                digits: 2
              });

              displayValue = formattedValue;
            }
            if (percentageMultiplier) {
              displayValue = Number(displayValue) * percentageMultiplier;
            }

            return (
              <li key={entry.name} style={{ textAlign: 'start' }}>
                {getTooltipLabel(entry.name)
                  ? `${getTooltipLabel(entry.name)}: `
                  : customLabel
                  ? `${getTooltipLabel(customLabel)}: `
                  : ''}
                <span
                  style={{ color: payload.length > 1 ? entry.color : '' }}
                  className='item-value'
                >
                  {currency === '$' ? '$' : ''}
                  {currency === '$'
                    ? new BigNumber(displayValue).toFormat(2)
                    : new BigNumber(displayValue).toFormat()}
                  {currency && currency !== '$' ? ` ${currency}` : ''}
                  {percentageMultiplier ? '%' : ''}
                </span>
                {showUsdValue && (
                  <p className='text-neutral-400 small mb-0'>
                    {usdValue({
                      amount: displayValue,
                      usd: unprocessed.price,
                      showPrefix: true
                    })}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className='recharts-tooltip-label'>
          {payload[0]?.payload?.timestamp
            ? moment
                .unix(payload[0].payload.timestamp)
                .utc()
                .format(dateFormat ?? 'D MMM YYYY')
            : label}
        </div>
      </div>
    );
  }

  return null;
};
