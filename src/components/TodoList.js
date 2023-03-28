import { ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';

const TodoList = () => {
  const { list, completeItem } = useTodoContext();
  return (
    <ScrollView>
      {list.map((item) => (
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

