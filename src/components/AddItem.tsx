import React, { useState, useCallback } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';

const AddItem = () => {
  const { addItem } = useTodoContext();
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = useCallback(() => {
    addItem(inputValue);
    setInputValue('');
  }, [addItem, inputValue]);

  return (
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
        testID="addItemInput"
      />
      <Button mode="contained" onPress={handleAddItem}>
        Add
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 64,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
});

export default AddItem;

