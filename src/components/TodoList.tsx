import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';
import { Item } from '../shared/types';

const TodoList = () => {
  const { currentItems, completeItem } = useTodoContext();

  const sortedList = useMemo(() => {
    const incompleteItems = currentItems.filter((item) => !item.complete);
    const completeItems = currentItems.filter((item) => item.complete);
    return [...incompleteItems, ...completeItems];
  }, [currentItems]);

  return (
    <ScrollView>
      {sortedList.map((item: Item) => (
        <Checkbox.Item
          key={item.uuid}
          label={item.name}
          accessibilityLabel={`${item.name} - ${item.complete ? 'Complete' : 'Incomplete'}`}
          status={item.complete ? 'checked' : 'unchecked'}
          onPress={() => completeItem(item)}
          testID="todoItem"
        />
      ))}
    </ScrollView>
  );
};

export default TodoList;

