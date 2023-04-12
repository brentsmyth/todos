import React, { useState, useCallback } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Appbar, Menu, Divider, TextInput, Portal, Button } from 'react-native-paper';
import { useTodoContext } from '../contexts/TodoContext';
import { List } from '../shared/types';

const Header = () => {
  const { lists, currentList, changeList, addList } = useTodoContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const [addListViewVisible, setAddListViewVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleMenuOpen = useCallback(() => {
    setMenuVisible(true);
    Keyboard.dismiss();
  }, []);

  const handleListChange = useCallback(
    (list: List) => {
      changeList(list);
      setMenuVisible(false);
    },
    [changeList]
  );

  const handleAddList = useCallback(() => {
    setMenuVisible(false);
    setAddListViewVisible(true);
  }, []);

  const handleCreateList = useCallback(() => {
    addList(newListName);
    setNewListName('');
    setAddListViewVisible(false);
  }, [addList, newListName]);

  return (
    <>
      <Appbar.Header testID="header">
        <Appbar.Content title={currentList?.name} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={handleMenuOpen}
              testID="menuButton"
            />
          }
        >
          {lists.map((list: List) => (
            <Menu.Item
              key={list.uuid}
              title={list.name}
              onPress={() => handleListChange(list)}
              testID={`menuItem-${list.uuid}`}
            />
          ))}
          <Divider />
          <Menu.Item title="Add list" onPress={handleAddList} />
        </Menu>
      </Appbar.Header>

      {addListViewVisible && (
        <View style={styles.addListWrapper}>
          <TextInput
            label="Enter a new list name"
            mode="outlined"
            style={styles.addListInput}
            autoFocus={true}
            onChangeText={(newListName) => setNewListName(newListName)}
            value={newListName}
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
            testID="addListInput"
          />
          <Button onPress={() => setAddListViewVisible(false)}>
            Cancel
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  addListWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    paddingTop: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  addListInput: {
    margin: 8,
  },
});

export default Header;

