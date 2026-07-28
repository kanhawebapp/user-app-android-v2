import {useCallback} from 'react';
import {GuidanceItem} from '../type';

export const useAstrologyGuidance = (
  items: GuidanceItem[],
  onItemPress?: (item: GuidanceItem) => void,
) => {
  // Handle item press with callback
  const handleItemPress = useCallback(
    (item: GuidanceItem) => {
      onItemPress?.(item);
    },
    [onItemPress],
  );

  return {
    items,
    handleItemPress,
  };
};
