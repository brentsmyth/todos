import React, { useState } from 'react';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAsyncStorage } from './hooks/useAsyncStorage';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const {
    lists,
    listUuid,
    list,
    addItem,
    completeItem,
    changeList,
    addList,
  } = useAsyncStorage();

  const currentList = lists.find(list => list.uuid === listUuid);

  const handleAddItem = () => {
    addItem(inputValue);
    setInputValue('');
  };

  const handleCompleteItem = (uuid) => {
    completeItem(uuid);
  };

  const handleListChange = (uuid) => {
    changeList(uuid);
    setMenuVisible(false);
  };

  const handleAddList = () => {
    setMenuVisible(false);
    setDialogVisible(true);
  };

  const handleCreateList = () => {
    addList(newListName);
    setDialogVisible(false);
    setNewListName('');
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
