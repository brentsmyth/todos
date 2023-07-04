import React, { useRef } from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../contexts/AuthContext';

/*
The implemented approach here isn't best practice and carries security 
flaws. However, it's a straightforward way to apply OAuth in native apps. 
This is for learning, so we'll start here to familiarize with web views.

Web views allow the host app to do almost anything, including observing 
keystrokes in Google's sign-in form. Google blocks web views' default 
user agents, but these can be altered for bypass.

This RFC delineates the flaws and suggested best practices: 
https://tools.ietf.org/html/rfc8252

The advised method is passing data from secure sandboxed web views to 
the app's context via deep links. There'll be learning and configuration 
needed to secure deep links initially.
*/

const BASE_URL = 'https://todos-service.herokuapp.com';

const SignIn = () => {
  const { handleAuthToken } = useAuth();

  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: { url: string, loading: boolean }) => {
    if (!navState.loading && navState.url.includes(`${BASE_URL}/auth/google_oauth2/callback`)) {
      const getAuthTokenScript = `
        (function() {
          window.ReactNativeWebView.postMessage(window.authToken);
        })();
        true;
      `;
      webViewRef.current?.injectJavaScript(getAuthTokenScript);
    }
  };

  const handleMessage = (event: { nativeEvent: { data: string; }; }) => {
    handleAuthToken(event.nativeEvent.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: `${BASE_URL}/auth/google_oauth2_redirect` }}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        userAgent={Platform.OS === 'android' ? 'Chrome/18.0.1025.133 Mobile Safari/535.19' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SignIn;
