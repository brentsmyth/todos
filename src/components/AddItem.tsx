import React, { useState, useCallback } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
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
        placeholder="Add item"
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        style={styles.addItemInput}
        testID="addItemInput"
      />
      <TouchableOpacity
        onPress={handleAddItem}
        style={styles.addItemButton}
        testID="addItemButton"
      >
        <Text style={styles.addItemButtonText}>Add</Text>
      </TouchableOpacity>
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
  addItemInput: {
    flex: 1,
    marginHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  addItemButton: {
    color: '#000',
    padding: 10,
    marginRight: 3,
  },
  addItemButtonText: {
    fontSize: 18,
  }
});

export default AddItem;

