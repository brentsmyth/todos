import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { List, Item } from '../shared/types';

interface TodoContextData {
  lists: List[];
  currentList: List | null;
  currentItems: Item[];
  addItem: (name: string) => Promise<void>;
  completeItem: (item: Item) => Promise<void>;
  changeList: (list: List) => void;
  addList: (name: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextData | null>(null);

const DEFAULT_LIST_NAME = 'Todos';

interface TodoProviderProps {
  children: React.ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [lists, setLists] = useState<List[]>([]);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);

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

  const setCurrentListAndLoadItems = async (list: List) => {
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

  const addItem = async (name: string) => {
    try {
      const newItem = { uuid: uuid.v4(), name, complete: false };
      const updatedItems = [...currentItems, newItem];
      setCurrentItems(updatedItems);
      await AsyncStorage.setItem(currentList.uuid, JSON.stringify(updatedItems));
    } catch (e) {
      console.error(e);
    }
  };

  const completeItem = async (item: Item) => {
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

  const changeList = (list: List) => {
    setCurrentListAndLoadItems(list);
  };

  const addList = async (name: string) => {
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

