import React from 'react-native';
import Header from './Header';
import List from './List';
import AddItem from './AddItem';

const Todos = () => {
  return (
    <>
      <Header />
      <List />
      <AddItem />
    </>
  );
};

export default Todos;