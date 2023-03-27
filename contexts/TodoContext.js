import React, { createContext, useContext } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const {
    lists,
    listUuid,
    list,
    addItem,
    completeItem,
    changeList,
    addList,
  } = useAsyncStorage();

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

