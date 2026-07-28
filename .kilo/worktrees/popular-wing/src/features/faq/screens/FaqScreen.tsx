import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFAQs } from '../../../services/api/faq/useFAQs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoBack, Icon, useTheme } from '../../../components';
import { colors } from '../../../theme/colors';

interface FaqScreenProps {
  onNavigateBack?: () => void;
}

const FaqScreen = ({ onNavigateBack }: FaqScreenProps) => {
  const { data, loading, error } = useFAQs();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load FAQs: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            iconLibrary="MaterialIcons"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
       
        <View style={{width: 48}} />
      </View> */}

      <GoBack onBack={onNavigateBack} title='Frequently Asked Questions' />

      {/* FAQ List */}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  faqItem: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  listContent: {
    paddingBottom: 24,
  },
  error: {
    color: colors.error.main,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default FaqScreen;
