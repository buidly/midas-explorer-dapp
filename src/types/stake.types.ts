import { SliceType } from 'types/general.types';

export interface StakeType {
  totalValidators: number;
  activeValidators: number;
  totalStaked: string;
  nakamotoCoefficient?: number;

  totalObservers?: number;
  queueSize?: number;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: number;
  qualifiedAuctionValidators?: number;
  dangerZoneValidators?: number;
  eligibleValidators?: number;
  waitingValidators?: number;
  allStakedNodes?: number;

  // not in API
  totalNodes?: string;
  totalValidatorNodes?: string;
  notQualifiedAuctionValidators?: number;
}

export interface StakeSliceType extends SliceType {
  unprocessed: StakeType;

  totalValidators: string;
  activeValidators: string;
  totalStaked: string;
  nakamotoCoefficient?: string;
  totalObservers?: string;

  queueSize?: string;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: string;
  qualifiedAuctionValidators?: string;
  dangerZoneValidators?: string;
  eligibleValidators?: string;
  waitingValidators?: string;
  allStakedNodes?: string;

  // not in API
  totalNodes?: string;
  totalValidatorNodes?: string;
  notQualifiedAuctionValidators?: string;
}
