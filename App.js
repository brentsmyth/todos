import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddItem from './components/AddItem';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <TodoProvider>
          <View style={styles.container}>
            <Header />
            <TodoList />
            <AddItem />
          </View>
        </TodoProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

