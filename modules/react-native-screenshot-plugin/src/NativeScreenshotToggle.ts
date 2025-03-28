import { NativeModules } from 'react-native';

interface ScreenshotToggleModuleType {
  toggleScreenshot: (isActivated: boolean) => Promise<{ success: boolean; message?: string; details?: any }>;
}

const { ScreenshotToggleModule } = NativeModules as { ScreenshotToggleModule: ScreenshotToggleModuleType };

class ScreenshotToggle {
  private isActivated: boolean;

  constructor() {
    this.isActivated = false;
  }

  async toggle(isActivated: boolean): Promise<{ success: boolean; message?: string; details?: any }> {
    try {
      console.log("🔍 Calling native toggleScreenshot with:", isActivated);
      const response = await ScreenshotToggleModule.toggleScreenshot(isActivated);
      console.log("✅ Native response:", response);
      if (response) {
        this.isActivated = isActivated;
        return response;
      } else {
        throw new Error(response || "Operation failed");
      }
    } catch (error) {
      return {success: false, message: 'error', details: error };
    }
  }
}

export default new ScreenshotToggle();
