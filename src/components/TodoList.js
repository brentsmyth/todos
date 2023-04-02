import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';

const TodoList = () => {
  const { list, completeItem } = useTodoContext();

  const sortedList = useMemo(() => {
    const incompleteItems = list.filter((item) => !item.complete);
    const completeItems = list.filter((item) => item.complete);
    return [...incompleteItems, ...completeItems];
  }, [list]);

  return (
    <ScrollView>
      {sortedList.map((item) => (
        <Checkbox.Item
          key={item.uuid}
          label={item.description}
          status={item.complete ? 'checked' : 'unchecked'}
          onPress={() => completeItem(item.uuid)}
        />
      ))}
    </ScrollView>
  );
};

export default TodoList;

