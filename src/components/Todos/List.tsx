import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useTodoContext } from '../../contexts/TodoContext';
import { Item } from '../../shared/types';

const List = () => {
  const { currentItems, completeItem } = useTodoContext();

  const sortedList = useMemo(() => {
    const incompleteItems = currentItems.filter((item) => !item.complete);
    const completeItems = currentItems.filter((item) => item.complete);
    return [...incompleteItems, ...completeItems];
  }, [currentItems]);

  const renderItem = (item: Item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => completeItem(item)}
      style={styles.todoItem}
      testID={`todoItem-${item.id}`}
    >
      <Text
        style={[
          styles.todoText,
          item.complete ? styles.todoTextCompleted : {},
        ]}
        accessibilityLabel={`${item.name} - ${
          item.complete ? 'Complete' : 'Incomplete'
        }`}
      >
        {item.complete ? `✓ ${item.name}` : item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView testID="list" style={styles.todoList}>
      {sortedList.map((item) => renderItem(item))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  todoList: {
    paddingVertical: 20,
  },
  todoItem: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  todoText: {
    fontSize: 18,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default List;
