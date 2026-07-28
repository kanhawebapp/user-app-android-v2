import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFAQ = useCallback((id: string) => {
    setExpandedId((prev: any) => (prev === id ? null : id));
  }, []);

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


      <GoBack onBack={onNavigateBack} title='Frequently Asked Questions' />
      {/* <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      /> */}

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;

          return (
            <View
              style={[
                styles.card,
                expanded && {
                  borderLeftColor: colors.primary.main,
                  borderLeftWidth: 4,
                },
              ]}>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFAQ(item.id)}
                style={styles.questionRow}>

                <Text
                  style={[
                    styles.question,
                    expanded && {
                      color: colors.primary.main,
                    },
                  ]}>
                  {item.question}
                </Text>

                <View
                  style={[
                    styles.iconContainer,
                    expanded && {
                      backgroundColor: colors.primary.main,
                    },
                  ]}>
                  <Icon
                    library="Feather"
                    name={expanded ? 'minus' : 'plus'}
                    size={18}
                    color={expanded ? '#fff' : colors.primary.main}
                  />
                </View>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
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

  listContent: {
    paddingBottom: 24,
  },
  error: {
    color: colors.error.main,
    textAlign: 'center',
    marginTop: 24,
  },


  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,

    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    paddingRight: 12,
    lineHeight: 24,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  answer: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.secondary,
  },
});

export default FaqScreen;
