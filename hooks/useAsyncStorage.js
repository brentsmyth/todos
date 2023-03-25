import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const sortByCompleted = (list) => {
  const incompleteItems = list.filter((item) => !item.complete);
  const completeItems = list.filter((item) => item.complete);
  return [...incompleteItems, ...completeItems];
};

const DEFAULT_LIST_NAME = 'Todos';

export const useAsyncStorage = () => {
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
          lists = [{
            name: DEFAULT_LIST_NAME,
            uuid: uuid.v4(),
          }];
        }

        setLists(lists);
        setListUuid(lists[0].uuid);

        const listData = await AsyncStorage.getItem(lists[0].uuid);
        if (listData !== null) {
          setList(sortByCompleted(JSON.parse(listData)));
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

    const newList = sortByCompleted([...list, newItem]);
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
    setList(sortByCompleted(newList));

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
        setList(sortByCompleted(JSON.parse(data)));
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

  return {
    lists,
    listUuid,
    list,
    addItem,
    completeItem,
    changeList,
    addList,
  };
};

