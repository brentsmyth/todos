import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { TodoProvider } from './src/contexts/TodoContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Todos from './src/components/Todos/Todos'
import SignIn from './src/components/SignIn';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const { authToken } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {authToken ? (
        <TodoProvider>
          <Todos />
        </TodoProvider>
      ) : (
        <SignIn />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
