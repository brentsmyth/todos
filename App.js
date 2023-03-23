import React, { useState, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, List, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const sortByCompleted = (list) => {
  const incompleteItems = list.filter((item) => !item.complete);
  const completeItems = list.filter((item) => item.complete);
  return [...incompleteItems, ...completeItems];
};

export default function App() {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('myList');
        if (data !== null) {
          setList(sortByCompleted(JSON.parse(data)));
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
      await AsyncStorage.setItem('myList', JSON.stringify(newList));
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
      await AsyncStorage.setItem('myList', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Todos" />
        </Appbar.Header>
        <ScrollView style={styles.listContainer}>
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
          <Button mode="contained" onPress={handleAddItem} style={styles.button}>
            Add
          </Button>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
  },
  listContainer: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedItem: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    marginLeft: 10,
  },
});
