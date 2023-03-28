import { ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';

const TodoList = () => {
  const { list, handleCompleteItem } = useTodoContext();
  return (
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
  );
};

export default TodoList;

