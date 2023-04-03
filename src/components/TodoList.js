import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';

const TodoList = () => {
  const { currentItems, completeItem } = useTodoContext();

  const sortedList = useMemo(() => {
    const incompleteItems = currentItems.filter((item) => !item.complete);
    const completeItems = currentItems.filter((item) => item.complete);
    return [...incompleteItems, ...completeItems];
  }, [currentItems]);

  return (
    <ScrollView>
      {sortedList.map((item) => (
        <Checkbox.Item
          key={item.uuid}
          label={item.name}
          status={item.complete ? 'checked' : 'unchecked'}
          onPress={() => completeItem(item)}
        />
      ))}
    </ScrollView>
  );
};

export default TodoList;

