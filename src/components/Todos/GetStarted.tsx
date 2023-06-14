import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { useTodoContext } from '../../contexts/TodoContext';

const GetStarted = () => {
  const { addList } = useTodoContext();
  const [newListName, setNewListName] = useState("");

  const handleAddList = async () => {
    if (newListName !== "") {
      await addList(newListName);
      setNewListName("");
    }
  };

  return (
    <View testID="getStarted" style={styles.container}>
      <Text>Add a new list to get started:</Text>
      <TextInput
        value={newListName}
        onChangeText={setNewListName}
        placeholder="List Name"
        style={styles.input}
        testID='getStartedInput'
      />
      <Button onPress={handleAddList} testID='getStartedButton' title="Add List" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    padding: 10,
  },
});

export default GetStarted;
