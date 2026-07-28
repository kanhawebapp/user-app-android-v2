/**
 * FilterSection Component Types
 */

import {FilterOptions} from '../../types';

export interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableLanguages?: string[];
  style?: any;
}
