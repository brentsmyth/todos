import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [listUuid, setListUuid] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let lists;
        const listsData = await AsyncStorage.getItem('lists');
        if (listsData !== null) {
          lists = JSON.parse(listsData);
        } else {
          const DEFAULT_LIST_NAME = 'Todos';
          lists = [{
            name: DEFAULT_LIST_NAME,
            uuid: uuid.v4(),
          }];
        }

        setLists(lists);
        setListUuid(lists[0].uuid);

        const listData = await AsyncStorage.getItem(lists[0].uuid);
        if (listData !== null) {
          setList(JSON.parse(listData));
        } else {
          setList([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const addItem = async (inputValue) => {
    if (inputValue.trim() === '') return;

    const newItem = {
      uuid: uuid.v4(),
      description: inputValue,
      complete: false,
    };

    const newList = [...list, newItem];
    setList(newList);

    try {
      await AsyncStorage.setItem(listUuid, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const completeItem = async (uuid) => {
    const index = list.findIndex((item) => item.uuid === uuid);

    if (index === -1) return;

    const newList = [...list];
    newList[index].complete = true;
    setList(newList);

    try {
      await AsyncStorage.setItem(listUuid, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const changeList = async (uuid) => {
    setListUuid(uuid);

    try {
      const data = await AsyncStorage.getItem(uuid);
      if (data !== null) {
        setList(JSON.parse(data));
      } else {
        setList([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addList = async (newListName) => {
    if (newListName.trim() === '') return;

    const newList = {
      name: newListName.trim(),
      uuid: uuid.v4(),
    };
    const newLists = [...lists, newList];
    setLists(newLists);

    try {
      await AsyncStorage.setItem('lists', JSON.stringify(newLists));
      await AsyncStorage.setItem(newList.uuid, '[]');
      setListUuid(newList.uuid);
      setList([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        lists,
        listUuid,
        list,
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

