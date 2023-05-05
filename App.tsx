import React, { StyleSheet, View, StatusBar } from 'react-native';
import { TodoProvider } from './src/contexts/TodoContext';
import Todos from './src/components/Todos/Todos'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TodoProvider>
        <Todos />
      </TodoProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

