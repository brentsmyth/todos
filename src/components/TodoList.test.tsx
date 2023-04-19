import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoList from './TodoList';
import { Item } from '../shared/types';

const mockUseTodoContext = jest.fn();
jest.mock('../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  currentItems: Item[];
  completeItem: (item: Item) => void;
}

const setup = (contextData: ContextData) => {
  mockUseTodoContext.mockReturnValue(contextData);
  return render(<TodoList />);
};

describe('TodoList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders items with the correct status', () => {
    const contextData: ContextData = {
      currentItems: [
        { uuid: 'item-1', name: 'Item 1', complete: false },
        { uuid: 'item-2', name: 'Item 2', complete: true },
      ],
      completeItem: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    const uncheckedItem1 = getByTestId('todoItem-item-1');
    const checkedItem2 = getByTestId('todoItem-item-2');
    expect(uncheckedItem1.children[0].props.accessibilityLabel).toBe('Item 1 - Incomplete');
    expect(checkedItem2.children[0].props.accessibilityLabel).toBe('Item 2 - Complete');
  });

  it('calls completeItem when an item is pressed', () => {
    const contextData: ContextData = {
      currentItems: [
        { uuid: 'item-1', name: 'Item 1', complete: false },
      ],
      completeItem: jest.fn(),
    };

    const { getByText } = setup(contextData);

    const item1 = getByText('Item 1');
    expect(item1).toBeTruthy();

    fireEvent.press(getByText('Item 1'));
    expect(contextData.completeItem).toHaveBeenCalledWith({ uuid: 'item-1', name: 'Item 1', complete: false });
  });

  it('renders the items in the correct order', () => {
    const contextData: ContextData = {
      currentItems: [
        { uuid: 'item-1', name: 'Item 1', complete: false },
        { uuid: 'item-2', name: 'Item 2', complete: true },
        { uuid: 'item-3', name: 'Item 3', complete: false },
      ],
      completeItem: jest.fn(),
    };

    const { getAllByTestId } = setup(contextData);

    const expectedOrder = ['Item 1 - Incomplete', 'Item 3 - Incomplete', 'Item 2 - Complete'];
    const renderedItems = getAllByTestId(/todoItem-item-/);

    expect(renderedItems[0].children[0].props.accessibilityLabel).toBe(expectedOrder[0]);
    expect(renderedItems[1].children[0].props.accessibilityLabel).toBe(expectedOrder[1]);
    expect(renderedItems[2].children[0].props.accessibilityLabel).toBe(expectedOrder[2]);
  });
});

