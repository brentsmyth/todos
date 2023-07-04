import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { List, Item } from '../shared/types';

interface TodoContextData {
  lists: List[];
  currentList: List | null;
  currentItems: Item[];
  addItem: (name: string) => Promise<void>;
  completeItem: (item: Item) => Promise<void>;
  changeList: (list: List) => void;
  addList: (name: string) => Promise<void>;
  deleteList: (list: List) => Promise<void>;
  loading: boolean;
}

const TodoContext = createContext<TodoContextData | null>(null);

interface TodoProviderProps {
  children: React.ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const { authToken } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://todos-service.herokuapp.com/api/v1";

  useEffect(() => {
    loadListsAndSelectFirst();
  }, []);

  const loadListsAndSelectFirst = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/lists`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    if (data[0]) {
      setLists(data);
      setCurrentListAndLoadItems(data[0]);
    }
    setLoading(false);
  };

  const setCurrentListAndLoadItems = async (list: List) => {
    setCurrentList(list);
    const response = await fetch(`${API_URL}/lists/${list.id}/items`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    setCurrentItems(data);
  };

  const addItem = async (name: string) => {
    const response = await fetch(`${API_URL}/lists/${currentList.id}/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, complete: false })
    });
    const data = await response.json();
    setCurrentItems([...currentItems, data]);
  };

  const completeItem = async (item: Item) => {
    const response = await fetch(`${API_URL}/items/${item.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...item, complete: true })
    });
    const data = await response.json();
    setCurrentItems(currentItems.map((currentItem) => 
      currentItem.id === data.id ? data : currentItem
    ));
  };

  const changeList = async (list: List) => {
    setCurrentListAndLoadItems(list);
  };

  const addList = async (name: string) => {
    const response = await fetch(`${API_URL}/lists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    setLists([...lists, data]);
    setCurrentListAndLoadItems(data);
  };

  const deleteList = async (listToDelete: List) => {
    await fetch(`${API_URL}/lists/${listToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    });
    const updatedLists = lists.filter((list) => list.id !== listToDelete.id);
    setLists(updatedLists);
    if (updatedLists[0]) {
      setCurrentListAndLoadItems(updatedLists[0]);
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
        deleteList,
        loading,
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

