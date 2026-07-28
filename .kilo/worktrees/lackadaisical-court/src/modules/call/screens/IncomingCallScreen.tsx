// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
// import signalingService from '../services/signaling.service';
// import {useCallStore} from '../../../stores/call.store';
// import {requestMediaPermissions} from '../utils/mediaPermissions';

// type IncomingCallParams = {
//   IncomingCallScreen: {
//     callerId: string;
//     callerName: string;
//     callerAvatar?: string;
//     callType: 'voice' | 'video';
//     roomId: string;
//     userId: string;
//     signalingUrl?: string;
//   };
// };

// export const IncomingCallScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<RouteProp<IncomingCallParams, 'IncomingCallScreen'>>();

//   const {
//     callerId,
//     callerName,
//     callerAvatar,
//     callType,
//     roomId,
//     userId,
//     signalingUrl = 'wss://your-signaling-server.com',
//   } = route.params;

//   const [isConnecting, setIsConnecting] = useState(false);
//   const {setCallStatus, setConnected} = useCallStore();

//   useEffect(() => {
//     const setupIncomingCall = async () => {
//       try {
//         await signalingService.connect(signalingUrl, userId, roomId);

//         signalingService.on('call-accept', () => {
//           console.log('Call accepted');
//           setIsConnecting(false);
//           setConnected(true);
//           setCallStatus('active');
//           navigation.navigate(
//             'Call' as never,
//             {
//               roomId,
//               userId,
//               targetId: callerId,
//               targetName: callerName,
//               callType,
//               signalingUrl,
//             } as never,
//           );
//         });

//         signalingService.on('call-reject', () => {
//           console.log('Call rejected');
//           setIsConnecting(false);
//           navigation.goBack();
//         });

//         signalingService.on('call-end', () => {
//           console.log('Call ended by caller');
//           setIsConnecting(false);
//           navigation.goBack();
//         });
//       } catch (error) {
//         console.log('Failed to setup incoming call:', error);
//         Alert.alert('Error', 'Failed to connect to call');
//         navigation.goBack();
//       }
//     };

//     setupIncomingCall();

//     return () => {
//       signalingService.disconnect();
//     };
//   }, [
//     callerId,
//     callerName,
//     callType,
//     roomId,
//     userId,
//     signalingUrl,
//     navigation,
//     setCallStatus,
//     setConnected,
//   ]);

//   const handleAccept = async () => {
//     const permissions = await requestMediaPermissions();
//     if (!permissions.camera || !permissions.microphone) {
//       Alert.alert(
//         'Permissions Required',
//         'Please grant camera and microphone permissions to answer calls.',
//       );
//       return;
//     }

//     setIsConnecting(true);
//     setCallStatus('connecting');
//     signalingService.sendCallAccept(roomId, callerId);

//     navigation.navigate(
//       'Call' as never,
//       {
//         roomId,
//         userId,
//         targetId: callerId,
//         targetName: callerName,
//         callType,
//         signalingUrl,
//       } as never,
//     );
//   };

//   const handleReject = () => {
//     signalingService.sendCallReject(roomId, callerId);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

//       <View style={styles.content}>
//         <View style={styles.avatarContainer}>
//           {callerAvatar ? (
//             <Image source={{uri: callerAvatar}} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarText}>
//                 {callerName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//           <View style={styles.callingTypeIndicator}>
//             <Text style={styles.callingTypeIcon}>
//               {callType === 'video' ? '📹' : '📞'}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.callerName}>{callerName}</Text>
//         <Text style={styles.incomingText}>
//           {callType === 'video' ? 'Incoming Video Call' : 'Incoming Voice Call'}
//         </Text>

//         {isConnecting && (
//           <Text style={styles.connectingText}>Connecting...</Text>
//         )}
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.rejectButton}
//           onPress={handleReject}
//           disabled={isConnecting}>
//           <Text style={styles.rejectIcon}>📵</Text>
//           <Text style={styles.rejectLabel}>Decline</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.acceptButton}
//           onPress={handleAccept}
//           disabled={isConnecting}>
//           <Text style={styles.acceptIcon}>📞</Text>
//           <Text style={styles.acceptLabel}>Accept</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1a1a1a',
//     justifyContent: 'space-between',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 24,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#4caf50',
//   },
//   avatarPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#4a4a4a',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: '#4caf50',
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 48,
//     fontWeight: 'bold',
//   },
//   callingTypeIndicator: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#4caf50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   callingTypeIcon: {
//     fontSize: 18,
//   },
//   callerName: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   incomingText: {
//     color: '#888',
//     fontSize: 16,
//   },
//   connectingText: {
//     color: '#4caf50',
//     fontSize: 14,
//     marginTop: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   rejectButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#ff4444',
//   },
//   rejectIcon: {
//     fontSize: 28,
//     marginBottom: 4,
//   },
//   rejectLabel: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   acceptButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#4caf50',
//   },
//   acceptIcon: {
//     fontSize: 28,
//     transform: [{rotate: '-130deg'}],
//     marginBottom: 4,
//   },
//   acceptLabel: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default IncomingCallScreen;
