import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import MyDayTodayView from '../components/MyDayTodayView';

type MyDayTodayRouteParams = {
  result: any;
  serviceTitle?: string;
};

const MyDayTodayScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {result, serviceTitle} = (route.params as MyDayTodayRouteParams) || {};

  return (
    <MyDayTodayView
      result={result}
      serviceTitle={serviceTitle}
      onBack={() => navigation.goBack()}
    />
  );
};

export default MyDayTodayScreen;
