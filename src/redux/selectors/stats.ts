import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stats;
};

export const statsSelector = createSelector(stateSelector, (state) => state);

export const refreshSelector = createSelector(stateSelector, (state) => state.refreshRate);
