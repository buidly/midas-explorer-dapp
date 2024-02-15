import {
  PAGE_SIZE,
  AUCTION_LIST_EXPAND_ROW_POSITION,
  AUCTION_LIST_MIN_DISPLAY_ROW_COUNT
} from 'appConstants';
import { NodeType } from 'types';

export const getExpandRowDetails = (nodes: NodeType[] = []) => {
  const MIN_ROW_COUNT = 9;

  const hasMinElements = nodes.length >= PAGE_SIZE;
  const closedRowPosition = Math.floor(AUCTION_LIST_MIN_DISPLAY_ROW_COUNT / 2);
  let qualifiedExpandPosition,
    dangerZoneExpandPosition,
    notQualifiedExpandPosition,
    qualifiedExpandClosePosition,
    dangerZoneExpandClosePosition,
    notQualifiedExpandClosePosition,
    remainingQualifiedValidators,
    remainingDangerZoneValidators,
    remainingNotQualifiedValidators;

  const qualifiedNotInDangerZoneValidators = nodes.filter(
    (node) => node.auctionQualified && !node.isInDangerZone
  );
  const dangerZoneValidators = nodes.filter((nodes) => nodes.isInDangerZone);
  const notQualifiedValidators = nodes.filter((node) => !node.auctionQualified);

  if (
    hasMinElements &&
    qualifiedNotInDangerZoneValidators.length >= MIN_ROW_COUNT
  ) {
    qualifiedExpandPosition =
      qualifiedNotInDangerZoneValidators[AUCTION_LIST_EXPAND_ROW_POSITION]
        .auctionPosition;

    qualifiedExpandClosePosition =
      qualifiedNotInDangerZoneValidators.length - closedRowPosition;

    remainingQualifiedValidators =
      qualifiedNotInDangerZoneValidators.length -
      AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && dangerZoneValidators.length >= MIN_ROW_COUNT) {
    dangerZoneExpandPosition =
      qualifiedNotInDangerZoneValidators[AUCTION_LIST_EXPAND_ROW_POSITION]
        .auctionPosition;

    dangerZoneExpandClosePosition =
      dangerZoneValidators.length - closedRowPosition;

    remainingDangerZoneValidators =
      dangerZoneValidators.length - AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && notQualifiedValidators.length >= MIN_ROW_COUNT) {
    notQualifiedExpandPosition =
      qualifiedNotInDangerZoneValidators[AUCTION_LIST_EXPAND_ROW_POSITION]
        .auctionPosition;

    notQualifiedExpandClosePosition =
      notQualifiedValidators.length - closedRowPosition;

    remainingNotQualifiedValidators =
      notQualifiedValidators.length - AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }

  return {
    qualifiedExpandPosition,
    dangerZoneExpandPosition,
    notQualifiedExpandPosition,
    qualifiedExpandClosePosition,
    dangerZoneExpandClosePosition,
    notQualifiedExpandClosePosition,
    remainingQualifiedValidators,
    remainingDangerZoneValidators,
    remainingNotQualifiedValidators
  };
};
