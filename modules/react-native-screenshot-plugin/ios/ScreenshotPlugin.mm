#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenshotPlugin, NSObject)

RCT_EXTERN_METHOD(toggle:(BOOL)isEnabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

