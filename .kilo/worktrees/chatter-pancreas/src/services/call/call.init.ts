import {useEffect} from 'react';
import {setupWebRTCListeners} from './webrtc.service';
import {signalingService} from './signaling.service';
import {useCallStore} from './call.store';
import {TURN_CONFIG} from './call.types';
import {webRTCService} from './webrtc.service';

export const useCallInitialization = () => {
  useEffect(() => {
    webRTCService.setConfig(TURN_CONFIG);
    setupWebRTCListeners();

    signalingService.registerCallbacks({
      onCallAccepted: () => {
        console.log(
          '[STATUS TRANSITION]',
          'FROM:',
          useCallStore.getState().status,
          'TO:',
          'connected',
          'SOURCE:',
          'onCallAccepted',
        );
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
  }, []);
};
