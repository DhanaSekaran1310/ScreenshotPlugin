import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {NativeModules} from 'react-native';

const {ScreenshotToggleModule} = NativeModules;

const ScreenshotToggle = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleScreenshot = async () => {
    setLoading(true);
    try {
      const response = await ScreenshotToggleModule.toggleScreenshot(
        isActivated,
      );
      await postDeviceDetails(response);
      setIsActivated(!isActivated);
    } catch (error: any) {
      if (typeof error === 'string') {
        Alert.alert('Error', error);
      } else if (error && error.message) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
      console.error('Error Object:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // POST device details and screenshot status Data to Mock API
  const postDeviceDetails = async (deviceDetails: any) => {
    try {
      const apiEndpoint =
        'https://webhook.site/00939aa1-3800-4a26-9f37-416fb79aa260/api/users';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceDetails),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to post data');
      }
      const jsonResponse = deviceDetails;

      // Show success alert with JSON data
      Alert.alert(
        'Success',
        `Device details posted successfully!\n\nResponse:\n${JSON.stringify(
          jsonResponse,
          null,
          2,
        )}`,
      );
      console.log('Response:', jsonResponse);
    } catch (error: any) {
      Alert.alert('Error', `Failed to post data: ${error?.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/app-logo.png')} style={{height: 100, width: 100}} />
      <Text style={styles.headerText}>
        {isActivated
          ? 'Screenshot Protection: On'
          : 'Screenshot Protection: Off'}
      </Text>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            isActivated ? styles.activated : styles.deactivated,
          ]}>
          Status : {isActivated ? 'Activated' : 'Activate'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          isActivated ? styles.deactivateBtn : styles.activateBtn,
        ]}
        onPress={toggleScreenshot}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isActivated ? 'Deactivate' : 'Activate'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  statusContainer: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activated: {
    color: 'green',
  },
  deactivated: {
    color: 'red',
  },
  toggleButton: {
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  activateBtn: {
    backgroundColor: '#4CAF50',
  },
  deactivateBtn: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ScreenshotToggle;
