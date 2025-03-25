#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenshotToggleModule, NSObject)

RCT_EXTERN_METHOD(toggleScreenshot:(BOOL)isEnabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
