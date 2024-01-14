import classNames from 'classnames';
import { StatsCardUIType } from './StatsCard';

export const SmallStatsCard = ({
  title,
  value,
  className
}: StatsCardUIType) => {
  return (
    <div
      className={classNames(
        'card d-flex flex-grow-1 small-stats-card',
        className
      )}
    >
      <div className='card-body d-flex stats-card-body'>
        {title && (
          <p className='text-neutral-500 mb-0 stats-card-title font-regular'>
            {title}
          </p>
        )}
        {value && <h2 className='stats-card-value mb-0'>{value}</h2>}
      </div>
    </div>
  );
};
