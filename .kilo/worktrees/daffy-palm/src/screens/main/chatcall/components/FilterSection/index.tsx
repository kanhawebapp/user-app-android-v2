/**
 * FilterSection Component
 * Provides filtering options for astrologers: availability, price, rating, language
 */

import React from 'react';
import {View, ScrollView, TouchableOpacity, Text} from 'react-native';
import {useTheme} from '../../../../../theme';
import {FilterSectionProps} from './types';
import {styles} from './styles';
import {FilterOptions, AvailabilityFilter, RatingFilter} from '../../types';
import {
  CHAT_CALL_LABELS,
  DEFAULTS,
} from '../../../../../constants/app.constants';

// Filter chip data
const AVAILABILITY_OPTIONS: {value: AvailabilityFilter; label: string}[] = [
  {value: 'all', label: CHAT_CALL_LABELS.FILTER_STATUS_ALL},
  {value: 'online', label: CHAT_CALL_LABELS.FILTER_STATUS_ONLINE},
  {value: 'offline', label: CHAT_CALL_LABELS.FILTER_STATUS_OFFLINE},
];

const RATING_OPTIONS: {value: RatingFilter; label: string}[] = [
  {value: 'all', label: CHAT_CALL_LABELS.FILTER_STATUS_ALL},
  {value: '4+', label: '4+'},
  {value: '3+', label: '3+'},
];

const PRICE_OPTIONS: {
  value: string;
  label: string;
  min: number;
  max: number;
}[] = [
  {
    value: 'all',
    label: CHAT_CALL_LABELS.FILTER_STATUS_ALL,
    min: 0,
    max: Infinity,
  },
  {value: '0-5', label: `${DEFAULTS.CURRENCY}0-5`, min: 0, max: 5},
  {value: '5-10', label: `${DEFAULTS.CURRENCY}5-10`, min: 5, max: 10},
  {value: '10-20', label: `${DEFAULTS.CURRENCY}10-20`, min: 10, max: 20},
  {value: '20+', label: `${DEFAULTS.CURRENCY}20+`, min: 20, max: Infinity},
];

const DEFAULT_LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali'];

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  availableLanguages = DEFAULT_LANGUAGES,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Handle availability filter change
  const handleAvailabilityChange = (value: AvailabilityFilter) => {
    onFiltersChange({
      ...filters,
      availability: value,
    });
  };

  // Handle price filter change
  const handlePriceChange = (value: string) => {
    const option = PRICE_OPTIONS.find(opt => opt.value === value);
    if (option) {
      onFiltersChange({
        ...filters,
        priceRange: {min: option.min, max: option.max},
      });
    }
  };

  // Handle rating filter change
  const handleRatingChange = (value: RatingFilter) => {
    onFiltersChange({
      ...filters,
      rating: value,
    });
  };

  // Handle language filter change
  const handleLanguageToggle = (language: string) => {
    const currentLanguages = filters.languages;
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];

    onFiltersChange({
      ...filters,
      languages: newLanguages,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.availability !== 'all' ||
    filters.rating !== 'all' ||
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== Infinity ||
    filters.languages.length > 0;

  // Clear all filters
  const handleClearFilters = () => {
    onFiltersChange({
      availability: 'all',
      priceRange: {min: 0, max: Infinity},
      rating: 'all',
      languages: [],
    });
  };

  // Get current price filter value
  const getCurrentPriceFilter = (): string => {
    if (filters.priceRange.max === Infinity) {
      return 'all';
    }
    if (filters.priceRange.min === 0 && filters.priceRange.max === 5) {
      return '0-5';
    }
    if (filters.priceRange.min === 5 && filters.priceRange.max === 10) {
      return '5-10';
    }
    if (filters.priceRange.min === 10 && filters.priceRange.max === 20) {
      return '10-20';
    }
    if (filters.priceRange.min === 20 && filters.priceRange.max === Infinity) {
      return '20+';
    }
    return 'all';
  };

  // Render filter row with chips
  const renderFilterRow = (
    label: string,
    options: {value: string; label: string}[],
    currentValue: string,
    onChange: (value: any) => void,
  ) => (
    <View style={styles.filterRow}>
      <Text style={[styles.filterLabel, {color: colors.text.primary}]}>
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}>
        {options.map(option => {
          const isActive = currentValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                isActive && {
                  backgroundColor: colors.primary.main,
                  borderColor: colors.primary.main,
                },
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.chipText,
                  isActive
                    ? {color: colors.primary.contrastText}
                    : {color: colors.text.secondary},
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {/* Availability Filter */}
      {renderFilterRow(
        CHAT_CALL_LABELS.FILTER_STATUS_LABEL,
        AVAILABILITY_OPTIONS,
        filters.availability,
        handleAvailabilityChange,
      )}

      {/* Price Filter */}
      {renderFilterRow(
        CHAT_CALL_LABELS.FILTER_PRICE_LABEL,
        PRICE_OPTIONS,
        getCurrentPriceFilter(),
        handlePriceChange,
      )}

      {/* Rating Filter */}
      {renderFilterRow(
        CHAT_CALL_LABELS.FILTER_RATING_LABEL,
        RATING_OPTIONS,
        filters.rating,
        handleRatingChange,
      )}

      {/* Language Filter */}
      <View style={styles.filterRow}>
        <Text style={[styles.filterLabel, {color: colors.text.primary}]}>
          {CHAT_CALL_LABELS.FILTER_LANGUAGE_LABEL}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}>
          {availableLanguages.map(language => {
            const isActive = filters.languages.includes(language);
            return (
              <TouchableOpacity
                key={language}
                style={[
                  styles.chip,
                  isActive && {
                    backgroundColor: colors.primary.main,
                    borderColor: colors.primary.main,
                  },
                ]}
                onPress={() => handleLanguageToggle(language)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.chipText,
                    isActive
                      ? {color: colors.primary.contrastText}
                      : {color: colors.text.secondary},
                  ]}>
                  {language}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilters}>
          <Text style={[styles.clearButtonText, {color: colors.error.main}]}>
            {CHAT_CALL_LABELS.FILTER_CLEAR_ALL}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilterSection;
