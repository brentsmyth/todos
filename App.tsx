import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TodoProvider } from './src/contexts/TodoContext';
import Todos from './src/components/Todos/Todos'
import SignIn from './src/components/SignIn';

export default function App() {
  const [authToken, setAuthToken] = useState('');

  const handleAuthToken = (token: string) => {
    setAuthToken(token);
  };

  return authToken ? (
    <TodoProvider authToken={authToken}>
      <Todos />
    </TodoProvider>
  ) : (
    <SignIn onAuthToken={handleAuthToken} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});