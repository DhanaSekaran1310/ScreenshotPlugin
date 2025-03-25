import React from 'react';
import { SafeAreaView } from 'react-native';
import ScreenshotToggle from './src/components/ScreenshotToggle';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenshotToggle />
    </SafeAreaView>
  );
};

export default App;
