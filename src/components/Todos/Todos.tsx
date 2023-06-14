import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Header from './Header';
import List from './List';
import AddItem from './AddItem';
import GetStarted from './GetStarted';
import { useTodoContext } from '../../contexts/TodoContext';

const Todos = () => {
  const { lists, loading } = useTodoContext();

  if (loading) {
    return (
      <View testID="loadingIndicator" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
