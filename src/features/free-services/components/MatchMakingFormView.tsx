/**
 * Free Match Making - Kundli Milan form.
 *
 * Collects the male and the female birth details (name, date, time, birth
 * place) using the same inputs the Kundli form uses, resolves both birth
 * places into coordinates + timezone, then runs the five Match Making
 * endpoints in parallel behind a loading state.
 */

import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {NameInput} from '../../../components/Modal/ChatRequestModal/components/NameInput';
import {DatePickerInput} from '../../../components/Modal/ChatRequestModal/components/DatePickerInput';
import {TimePickerInput} from '../../../components/Modal/ChatRequestModal/components/TimePickerInput';
import {PlaceOfBirthInput} from '../../../components/Modal/ChatRequestModal/components/PlaceOfBirthInput';
import {useToast} from '../../../context/ToastContext';
import {resolveBirthPlace} from '../../../services/api/astrologyApi/astrology.api';
import type {MatchMakingPayload} from '../../../services/api/astrologyApi/astrology.types';
import {useTheme} from '../../../theme';
import {renderHeader} from './KundliDoshaView';
import {cacheMatchMakingBundle} from '../hooks/useMatchMaking';
import {
  MATCH_MAKING_FORM_TITLE,
  buildMatchMakingPayload,
  buildMatchPartiesSummary,
  fetchMatchMakingBundle,
  getBirthMoment,
  getFirstErrorMessage,
  getInitialMatchFormValues,
  validateMatchForm,
  type MatchFormErrors,
  type MatchFormValues,
  type MatchPartyErrors,
  type MatchPartyForm,
  type MatchMakingBundle,
} from '../utils/matchMaking';

export interface MatchMakingFormResult {
  payload: MatchMakingPayload;
  bundle: MatchMakingBundle;
}

export interface MatchMakingFormViewProps {
  onBack: () => void;
  onSuccess: (result: MatchMakingFormResult) => void;
}

type PartyKey = 'male' | 'female';

const PARTY_META: Record<
  PartyKey,
  {title: string; icon: string; namePlaceholder: string}
> = {
  male: {
    title: "Male's Details",
    icon: 'person',
    namePlaceholder: 'Enter the male name',
  },
  female: {
    title: "Female's Details",
    icon: 'person-outline',
    namePlaceholder: 'Enter the female name',
  },
};

const MatchMakingFormView: React.FC<MatchMakingFormViewProps> = ({
  onBack,
  onSuccess,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  const [values, setValues] = useState<MatchFormValues>(
    getInitialMatchFormValues,
  );
  const [errors, setErrors] = useState<MatchFormErrors>({
    male: {},
    female: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePartyChange = useCallback(
    (party: PartyKey, key: keyof MatchPartyForm, value: string) => {
      setValues(previous => ({
        ...previous,
        [party]: {...previous[party], [key]: value},
      }));
      setErrors(previous => ({
        ...previous,
        [party]: {...previous[party], [key]: undefined},
      }));
      setSubmitError(null);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    // Guards against a second press while the requests are still running.
    if (submitting) {
      return;
    }

    const nextErrors = validateMatchForm(values);
    setErrors(nextErrors);

    const firstError = getFirstErrorMessage(nextErrors);
    if (firstError) {
      showError(firstError);
      return;
    }

    const maleMoment = getBirthMoment(values.male);
    const femaleMoment = getBirthMoment(values.female);

    if (!maleMoment || !femaleMoment) {
      showError('Please select a valid date and time for both people.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Both places resolve independently, so they are looked up in parallel.
      const [maleBirthPlace, femaleBirthPlace] = await Promise.all([
        resolveBirthPlace(values.male.address, maleMoment),
        resolveBirthPlace(values.female.address, femaleMoment),
      ]);

      const payload = buildMatchMakingPayload({
        male: {party: values.male, birthPlace: maleBirthPlace},
        female: {party: values.female, birthPlace: femaleBirthPlace},
      });

      const bundle = await fetchMatchMakingBundle(payload);

      if (!bundle.hasAnyData) {
        throw new Error('The match making report is empty for these details.');
      }

      const result: MatchMakingBundle = {
        ...bundle,
        parties: buildMatchPartiesSummary({
          male: {party: values.male, birthPlace: maleBirthPlace},
          female: {party: values.female, birthPlace: femaleBirthPlace},
        }),
      };

      // Store the bundle so the report screen renders it without refetching.
      cacheMatchMakingBundle(payload, result);
      onSuccess({payload, bundle: result});
    } catch (error: any) {
      const message =
        error?.message || 'Unable to generate the match making report.';
      setSubmitError(message);
      showError(message);
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess, showError, submitting, values]);

  const renderParty = (party: PartyKey) => {
    const meta = PARTY_META[party];
    const partyValues = values[party];
    const partyErrors: MatchPartyErrors = errors[party] ?? {};

    return (
      <View
        style={[styles.sectionCard, {backgroundColor: colors.primary.light}]}>
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.sectionIcon,
              {backgroundColor: colors.primary.main + '20'},
            ]}>
            <Icon
              name={meta.icon}
              size={18}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          </View>
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary}}>
            {meta.title}
          </Text>
        </View>

        <NameInput
          value={partyValues.name}
          onChangeText={text => handlePartyChange(party, 'name', text)}
          error={partyErrors.name}
        />

        <DatePickerInput
          value={partyValues.date}
          onChangeText={text => handlePartyChange(party, 'date', text)}
          error={partyErrors.date}
        />

        <TimePickerInput
          value={partyValues.time}
          onChangeText={text => handlePartyChange(party, 'time', text)}
        />
        {partyErrors.time ? (
          <Text style={[styles.fieldError, {color: colors.error.main}]}>
            {partyErrors.time}
          </Text>
        ) : null}

        <PlaceOfBirthInput
          value={partyValues.address}
          onChangeText={(text: string) =>
            handlePartyChange(party, 'address', text)
          }
          placeholder={`${meta.title.replace("'s Details", '')} birth place`}
          error={partyErrors.address}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {renderHeader(onBack, MATCH_MAKING_FORM_TITLE, colors, false)}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text
          variant="bodySmall"
          style={{color: colors.text.secondary, marginBottom: 16}}>
          Enter the birth details of both people to check their Kundli Milan
          (Ashtakoot Guna Milan) score.
        </Text>

        {renderParty('male')}
        {renderParty('female')}

        {submitError ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.error.background,
                borderColor: colors.error.main,
              },
            ]}>
            <View style={styles.stateRow}>
              <Icon
                name="error-outline"
                size={18}
                color={colors.error.main}
                library="MaterialIcons"
              />
              <Text
                variant="bodySmall"
                style={{color: colors.error.main, flex: 1, marginLeft: 8}}>
                {submitError}
              </Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: colors.primary.main,
              opacity: submitting ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Show Match Details">
          {submitting ? (
            <View style={styles.submitContent}>
              <ActivityIndicator color={colors.primary.contrastText} />
              <Text
                variant="bodySmall"
                weight="bold"
                style={{color: colors.primary.contrastText, marginLeft: 10}}>
                Generating report...
              </Text>
            </View>
          ) : (
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Show Match Details
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(MatchMakingFormView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldError: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    fontWeight: '500',
  },
  stateCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
