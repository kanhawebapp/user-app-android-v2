#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNSoundPool, NSObject)

RCT_EXTERN_METHOD(playSound:(NSString *)soundName
                  loop:(BOOL)loop
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopSound:(NSString *)soundName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopAllSounds:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(preloadSound:(NSString *)soundName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

