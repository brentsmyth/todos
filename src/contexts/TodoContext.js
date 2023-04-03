import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const TodoContext = createContext();

const DEFAULT_LIST_NAME = 'Todos';

export const TodoProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    loadListsAndSelectFirstOrDefault();
  }, []);

  const loadListsAndSelectFirstOrDefault = async () => {
    try {
      const listsData = await AsyncStorage.getItem('lists');
      let parsedLists = listsData ? JSON.parse(listsData) : [];

      if (parsedLists.length === 0) {
        const defaultList = { name: DEFAULT_LIST_NAME, uuid: uuid.v4() };
        parsedLists = [defaultList];
        await AsyncStorage.setItem('lists', JSON.stringify(parsedLists));
      }

      setLists(parsedLists);
      setCurrentListAndLoadItems(parsedLists[0]);

    } catch (e) {
      console.error(e);
    }
  };

  const setCurrentListAndLoadItems = async (list) => {
    try {
      setCurrentList(list);

      const itemsData = await AsyncStorage.getItem(list.uuid);
      if (itemsData) {
        setCurrentItems(JSON.parse(itemsData));
      } else {
        setCurrentItems([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = async (name) => {
    try {
      const newItem = { uuid: uuid.v4(), name, complete: false };
      const updatedItems = [...currentItems, newItem];
      setCurrentItems(updatedItems);
      await AsyncStorage.setItem(currentList.uuid, JSON.stringify(updatedItems));
    } catch (e) {
      console.error(e);
    }
  };

  const completeItem = async (item) => {
    try {
      const updatedItems = currentItems.map((currentItem) =>
        currentItem.uuid === item.uuid ? { ...currentItem, complete: true } : currentItem
      );
      setCurrentItems(updatedItems);
      await AsyncStorage.setItem(currentList.uuid, JSON.stringify(updatedItems));
    } catch (e) {
      console.error(e);
    }
  };

  const changeList = (list) => {
    setCurrentListAndLoadItems(list);
  };

  const addList = async (name) => {
    try {
      const newList = { name, uuid: uuid.v4() };
      const updatedLists = [...lists, newList];
      setLists(updatedLists);
      setCurrentListAndLoadItems(newList);
      await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        lists,
        currentList,
        currentItems,
        addItem,
        completeItem,
        changeList,
        addList,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

