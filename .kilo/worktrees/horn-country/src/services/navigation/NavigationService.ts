import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';

let navigator: NavigationContainerRef<any> | null = null;

export const setNavigator = (nav: NavigationContainerRef<any> | null): void => {
  navigator = nav;
};

export const getNavigator = (): NavigationContainerRef<any> | null => {
  return navigator;
};

export const isReady = (): boolean => {
  return navigator !== null && navigator.isReady();
};

export const navigate = (
  routeName: string,
  params?: Record<string, any>,
): void => {
  if (navigator) {
    navigator.dispatch(
      CommonActions.navigate({
        name: routeName,
        params,
      }),
    );
  } else {
    console.warn('[NavigationService] Navigator not set');
  }
};

export const goBack = (): void => {
  if (navigator) {
    navigator.dispatch(CommonActions.goBack());
  }
};

export const replace = (
  routeName: string,
  params?: Record<string, any>,
): void => {
  if (navigator) {
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName, params}],
      }),
    );
  }
};

export const resetAndNavigate = (
  routes: Array<{name: string; params?: Record<string, any>}>,
): void => {
  if (navigator) {
    navigator.dispatch(
      CommonActions.reset({
        index: routes.length - 1,
        routes,
      }),
    );
  }
};

export type RootStackParamList = {
  MainTabs: undefined;
  ChatScreen: {roomId: string; astrologerId?: string; astrologerName?: string};
  ChatCall: undefined;
};

export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

export const navigationRef = {
  current: navigator,
};
