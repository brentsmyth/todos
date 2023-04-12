jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const SafeAreaProvider = ({ children }) => <>{children}</>;
  const SafeAreaInsetsContext = React.createContext({});
  const useSafeAreaInsets = () => ({ top: 0, left: 0, bottom: 0, right: 0 });

  return {
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
  };
});

