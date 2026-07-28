import {useEffect} from 'react';
import {setupWebRTCListeners} from './webrtc.service';
import {signalingService} from './signaling.service';
import {useCallStore} from './call.store';
import {useNavigation} from '@react-navigation/native';
import {TURN_CONFIG} from './call.types';
import {webRTCService} from './webrtc.service';

export const useCallInitialization = () => {
  const navigation = useNavigation();

  useEffect(() => {
    webRTCService.setConfig(TURN_CONFIG);
    setupWebRTCListeners();

    signalingService.registerCallbacks({
      onIncomingCall: data => {
        useCallStore.setState({
          callId: data.callId,
          participant: {
            id: data.callerId,
            name: data.callerName,
            image: data.callerImage,
          },
        });
        navigation.navigate('Call' as never, {
          callId: data.callId,
          participant: {
            id: data.callerId,
            name: data.callerName,
            image: data.callerImage,
          },
          isIncoming: true,
        } as never);
      },
      onCallAccepted: () => {
        useCallStore.setState({status: 'connected'});
      },
      onCallRejected: () => {
        useCallStore.getState().reset();
      },
      onCallEnded: () => {
        useCallStore.getState().reset();
      },
    });

    return () => {
      signalingService.unregisterListeners();
    };
  }, [navigation]);
};