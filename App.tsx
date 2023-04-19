import { StyleSheet, View, StatusBar } from 'react-native';
import { TodoProvider } from './src/contexts/TodoContext';
import Header from './src/components/Header';
import TodoList from './src/components/TodoList';
import AddItem from './src/components/AddItem';

export default function App() {
  return (
    <TodoProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header />
        <TodoList />
        <AddItem />
      </View>
    </TodoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

