import React, { useState, useEffect } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Checkbox,
  Menu,
  Divider,
  Provider as PaperProvider,
  Dialog,
  Portal,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const sortByCompleted = (list) => {
  const incompleteItems = list.filter((item) => !item.complete);
  const completeItems = list.filter((item) => item.complete);
  return [...incompleteItems, ...completeItems];
};

const DEFAULT_LIST_NAME = 'Todos';

export default function App() {
  const [lists, setLists] = useState([]);
  const [listUuid, setListUuid] = useState('');
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const currentList = lists.find(list => list.uuid === listUuid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let lists;
        const listsData = await AsyncStorage.getItem('lists');
        if (listsData !== null) {
          lists = JSON.parse(listsData);
        } else {
          lists = [{
            name: DEFAULT_LIST_NAME,
            uuid: uuid.v4(),
          }];
        }

        setLists(lists);
        setListUuid(lists[0].uuid);

        const listData = await AsyncStorage.getItem(lists[0].uuid);
        if (listData !== null) {
          setList(sortByCompleted(JSON.parse(listData)));
        } else {
          setList([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (inputValue.trim() === '') return;

    const newItem = {
      uuid: uuid.v4(),
      description: inputValue,
      complete: false,
    };

    const newList = sortByCompleted([...list, newItem]);
    setList(newList);

    try {
      await AsyncStorage.setItem(listUuid, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }

    setInputValue('');
  };

  const handleCompleteItem = async (uuid) => {
    const index = list.findIndex((item) => item.uuid === uuid);

    if (index === -1) return;

    const newList = [...list];
    newList[index].complete = true;
    setList(sortByCompleted(newList));

    try {
      await AsyncStorage.setItem(listUuid, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const handleListChange = async (uuid) => {
    setListUuid(uuid);

    try {
      const data = await AsyncStorage.getItem(uuid);
      if (data !== null) {
        setList(sortByCompleted(JSON.parse(data)));
      } else {
        setList([]);
      }
    } catch (e) {
      console.error(e);
    }

    setMenuVisible(false);
  };

  const handleAddList = () => {
    setMenuVisible(false);
    setDialogVisible(true);
  };

  const handleCreateList = async () => {
    if (newListName.trim() === '') return;

    const newList = {
      name: newListName.trim(),
      uuid: uuid.v4(),
    };
    const newLists = [...lists, newList];
    setLists(newLists);
    setDialogVisible(false);

    try {
      await AsyncStorage.setItem('lists', JSON.stringify(newLists));
      await AsyncStorage.setItem(newList.uuid, '[]');
      setListUuid(newList.uuid);
      setList([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.Content title={currentList?.name} />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Appbar.Action
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              {lists.map((list) => (
                <Menu.Item
                  key={list.name}
                  title={list.name}
                  onPress={() => handleListChange(list.uuid)}
                />
              ))}
              <Divider />
              <Menu.Item title="Add list" onPress={handleAddList} />
            </Menu>
          </Appbar.Header>
          <ScrollView>
            {list.map((item) => (
              <Checkbox.Item
                key={item.uuid}
                label={item.description}
                status={item.complete ? 'checked' : 'unchecked'}
                onPress={() => handleCompleteItem(item.uuid)}
              />
            ))}
          </ScrollView>
          <KeyboardAvoidingView
            style={styles.footer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <TextInput
              label="Add item"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddItem}>
              Add
            </Button>
          </KeyboardAvoidingView>
          <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Create new list</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="List name"
                  value={newListName}
                  onChangeText={(text) => setNewListName(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleCreateList}>Create</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
});
