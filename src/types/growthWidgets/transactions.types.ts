import { SliceType } from 'types/general.types';
import { GrowthChartDataType } from 'types/growthWidgets/chart.types';

export interface GrowthTransactionsType {
  totalTransactions: number;
  scResults: number;
  transactions: number;
}

export interface GrowthTransactionsSliceType extends SliceType {
  unprocessed: GrowthTransactionsType;

  totalTransactions: number;
  scResults: number;
  transactions: number;

  scResults30d: GrowthChartDataType[];
  scResultsAll: GrowthChartDataType[];
  transactions30d: GrowthChartDataType[];
  transactionsAll: GrowthChartDataType[];
}
