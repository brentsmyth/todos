import React from 'react';
import Header from './Header';
import List from './List';
import AddItem from './AddItem';
import GetStarted from './GetStarted';
import { useTodoContext } from '../../contexts/TodoContext';

const Todos = () => {
  const { lists } = useTodoContext();

  return lists.length === 0 ? (
    <GetStarted />
  ) : (
    <>
      <Header />
      <List />
      <AddItem />
    </>
  );
};

export default Todos;
