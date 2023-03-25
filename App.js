import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAsyncStorage } from './hooks/useAsyncStorage';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddItem from './components/AddItem';

export default function App() {
  const {
    lists,
    listUuid,
    list,
    addItem,
    completeItem,
    changeList,
    addList,
  } = useAsyncStorage();

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Header
            listUuid={listUuid}
            lists={lists}
            changeList={changeList}
            addList={addList}
          />
          <TodoList list={list} handleCompleteItem={completeItem} />
          <AddItem addItem={addItem} />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

