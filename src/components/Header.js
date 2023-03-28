import { useState, useCallback } from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import CreateListDialog from './CreateListDialog';
import { useTodoContext } from '../contexts/TodoContext';

const Header = () => {
  const { listUuid, lists, changeList, addList } = useTodoContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const currentList = lists.find((list) => list.uuid === listUuid);

  const handleListChange = useCallback(
    (uuid) => {
      changeList(uuid);
      setMenuVisible(false);
    },
    [changeList]
  );

  const handleAddList = useCallback(() => {
    setMenuVisible(false);
    setDialogVisible(true);
  }, []);

  const handleCreateList = useCallback((newListName) => {
    addList(newListName);
    setDialogVisible(false);
  }, [addList]);

  return (
    <Appbar.Header>
      <Appbar.Content title={currentList?.name} />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        {lists.map((list) => (
          <Menu.Item
            key={list.uuid}
            title={list.name}
            onPress={() => handleListChange(list.uuid)}
          />
        ))}
        <Divider />
        <Menu.Item title="Add list" onPress={handleAddList} />
      </Menu>
      <CreateListDialog
        visible={dialogVisible}
        onCreate={handleCreateList}
        onCancel={() => setDialogVisible(false)}
      />
    </Appbar.Header>
  );
};

export default Header;

