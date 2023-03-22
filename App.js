import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Todos</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {list.map((item) => (
          <TouchableWithoutFeedback key={item.uuid} onLongPress={() => handleCompleteItem(item.uuid)}>
            <View style={[styles.item, item.complete && styles.completedItem]}>
              <Text>{item.description}</Text>
              <Text>{item.complete ? 'Complete' : 'Incomplete'}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder="Add item"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedItem: {
    backgroundColor: '#eee',
    opacity: 0.5,
  },
  footer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
});
