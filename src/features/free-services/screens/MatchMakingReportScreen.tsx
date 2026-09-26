/**
 * Report screen for Free Match Making. Reads the bundle produced by the form
 * (passed through the route) and falls back to the cached response, or a
 * refetch, if the bundle is not available.
 */

import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';

import type {MatchMakingPayload} from '../../../services/api/astrologyApi/astrology.types';
import MatchMakingReportView from '../components/MatchMakingReportView';
import {useMatchMaking} from '../hooks/useMatchMaking';
import type {MatchMakingBundle} from '../utils/matchMaking';

export type MatchMakingReportRouteParams = {
  payload?: MatchMakingPayload;
  bundle?: MatchMakingBundle;
};

type MatchMakingReportRouteProp = RouteProp<
  {MatchMakingReport: MatchMakingReportRouteParams | undefined},
  'MatchMakingReport'
>;

const MatchMakingReportScreen = () => {
  const route = useRoute<MatchMakingReportRouteProp>();
  const navigation = useNavigation();
  const {payload, bundle} = route.params ?? {};

  const {data, loading, error, reload} = useMatchMaking(
    payload ?? null,
    bundle ?? null,
  );

  return (
    <MatchMakingReportView
      payload={payload ?? null}
      bundle={data}
      loading={loading}
      error={error}
      onRetry={reload}
      onBack={() => navigation.goBack()}
    />
  );
};

export default MatchMakingReportScreen;
