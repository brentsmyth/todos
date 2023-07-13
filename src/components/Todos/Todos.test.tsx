import React from 'react';
import { render } from '@testing-library/react-native';
import Todos from './Todos';
import { Item } from '../../shared/types';

const mockUseTodoContext = jest.fn();
jest.mock('../../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  lists: any[];
  currentItems: Item[];
  loading: boolean;
}

const setup = (contextData: ContextData) => {
  mockUseTodoContext.mockReturnValue(contextData);
  return render(<Todos />);
};

describe('Todos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading indicator when loading', () => {
    const contextData: ContextData = {
      lists: [],
      currentItems: [],
      loading: true,
    };

    const { getByTestId } = setup(contextData);

    expect(getByTestId('loadingIndicator')).toBeTruthy();
  });

  it('renders the GetStarted component when not loading and no lists', () => {
    const contextData: ContextData = {
      lists: [],
      currentItems: [],
      loading: false,
    };

    const { getByTestId } = setup(contextData);

    expect(getByTestId('getStarted')).toBeTruthy();
  });

  it('renders the Header, List and AddItem components when not loading and there are lists', () => {
    const contextData: ContextData = {
      lists: ['list1', 'list2'],
      currentItems: [{ name: 'test', id: 1, complete: false }, { name: 'test 2', id: 2, complete: true }],
      loading: false,
    };

    const { getByTestId } = setup(contextData);

    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('list')).toBeTruthy();
    expect(getByTestId('addItem')).toBeTruthy();
  });
});
