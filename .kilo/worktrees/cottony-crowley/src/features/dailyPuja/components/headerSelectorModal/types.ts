/**
 * Header Selector Modal Types
 * Type definitions for the header selector modal component
 */

import { HeaderImageOption } from '../../types';

export interface HeaderSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  options: HeaderImageOption[];
  selectedOption?: HeaderImageOption;
  onSelect: (option: HeaderImageOption) => void;
}

