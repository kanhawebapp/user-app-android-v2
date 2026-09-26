import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import MatchMakingFormView, {
  type MatchMakingFormResult,
} from '../components/MatchMakingFormView';
import type {MatchMakingReportRouteParams} from './MatchMakingReportScreen';

type MatchMakingNavigationProp = NativeStackNavigationProp<{
  MatchMakingReport: MatchMakingReportRouteParams;
}>;

const MatchMakingScreen = () => {
  const navigation = useNavigation<MatchMakingNavigationProp>();

  const handleSuccess = useCallback(
    (result: MatchMakingFormResult) => {
      navigation.navigate('MatchMakingReport', {
        payload: result.payload,
        bundle: result.bundle,
      });
    },
    [navigation],
  );

  return (
    <MatchMakingFormView
      onBack={() => navigation.goBack()}
      onSuccess={handleSuccess}
    />
  );
};

export default MatchMakingScreen;
