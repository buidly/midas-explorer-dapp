import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthSearch } from 'helpers';
import { useAdapter, useHasGrowthWidgets } from 'hooks';
import { growthSearchSelector } from 'redux/selectors';
import { setGrowthSearch } from 'redux/slices/growthSearch';

export const useFetchGrowthSearch = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthSearchSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthSearch = () => {
    if (!isFetched) {
      getGrowthWidget('/search').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthSearch = processGrowthSearch(data);
          dispatch(
            setGrowthSearch({
              ...processedGrowthSearch,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(() => {
    if (hasGrowthWidgets) {
      fetchGrowthSearch();
    }
  }, [hasGrowthWidgets]);
};
