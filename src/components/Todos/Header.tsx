import React, { useState, useCallback } from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useTodoContext } from '../../contexts/TodoContext';
import { List } from '../../shared/types';

const Header = () => {
  const { lists, currentList, changeList, addList, deleteList } = useTodoContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const [addListViewVisible, setAddListViewVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleMenuOpen = useCallback(() => {
    setMenuVisible(true);
    Keyboard.dismiss();
  }, [menuVisible]);

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

  const handleDeleteList = useCallback(() => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            if (currentList) {
              deleteList(currentList);
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, [currentList, deleteList]);

  return (
    <>
      <View style={styles.header} testID="header">
        <TouchableOpacity
          onPress={handleDeleteList}
          testID="deleteListButton"
        >
          <Text>Delete</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{currentList?.name}</Text>
        <TouchableOpacity
          onPress={handleMenuOpen}
          style={styles.menuButton}
          testID="menuButton"
        >
          <Image style={{width: 35, height: 35}} source={require('../../assets/list-solid.png')} />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          {lists.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleListChange(item)}
              testID={`menuItem-${item.id}`}
            >
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={handleAddList}
            style={styles.addListButton}
            testID="addListButton"
          >
            <Text style={styles.addListButtonText}>Add List</Text>
          </TouchableOpacity>
        </View>
      )}

      {addListViewVisible && (
        <View style={styles.addListWrapper}>
          <View style={styles.addListContainer}>
            <TextInput
              placeholder="Enter a new list name"
              style={styles.addListInput}
              autoFocus={true}
              onChangeText={(newListName) => setNewListName(newListName)}
              value={newListName}
              returnKeyType="done"
              onSubmitEditing={handleCreateList}
              testID="addListInput"
            />
            <TouchableOpacity
              onPress={() => setAddListViewVisible(false)}
              testID="cancelAddListButton"
              style={styles.cancelAddListButton}
            >
              <Text style={styles.cancelAddListButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 18,
  },
  menu: {
    position: 'absolute',
    zIndex: 1,
    top: 100,
    right: 0,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    padding: 8,
  },
  menuItemText: {
    fontSize: 18,
  },
  addListButton: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingTop: 14,
  },
  addListButtonText: {
    fontSize: 18,
  },
  addListWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  addListContainer: {
    marginTop: 220,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addListInput: {
    flex: 1,
    margin: 8,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  cancelAddListButton: {
    padding: 10,
  },
  cancelAddListButtonText: {
    fontSize: 18,
  }
});

export default Header;

