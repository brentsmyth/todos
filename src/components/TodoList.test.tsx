import React from 'react';
import { render, waitFor, fireEvent } from 'react-native-testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
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

describe('TodoList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders items with the correct status', async () => {
    const contextData: ContextData = {
      currentItems: [
        { uuid: 'item-1', name: 'Item 1', complete: false },
        { uuid: 'item-2', name: 'Item 2', complete: true },
      ],
      completeItem: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText, getByA11yLabel } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <TodoList />
        </PaperProvider>
      </SafeAreaProvider>
    );

    await waitFor(() => {
      const uncheckedItem1 = getByA11yLabel('Item 1 - Incomplete');
      const checkedItem2 = getByA11yLabel('Item 2 - Complete');
      expect(uncheckedItem1).toBeTruthy();
      expect(checkedItem2).toBeTruthy();
    });
  });

  it('calls completeItem when an item is pressed', async () => {
    const contextData: ContextData = {
      currentItems: [
        { uuid: 'item-1', name: 'Item 1', complete: false },
      ],
      completeItem: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <TodoList />
        </PaperProvider>
      </SafeAreaProvider>
    );

    await waitFor(() => {
      const item1 = getByText('Item 1');
      expect(item1).toBeTruthy();
    });

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
    mockUseTodoContext.mockReturnValue(contextData);

    const { getAllByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <TodoList />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const expectedOrder = ['Item 1 - Incomplete', 'Item 3 - Incomplete', 'Item 2 - Complete'];
    const renderedItems = getAllByTestId('todoItem');

    expect(renderedItems[0].props.accessibilityLabel).toBe(expectedOrder[0]);
    expect(renderedItems[1].props.accessibilityLabel).toBe(expectedOrder[1]);
    expect(renderedItems[2].props.accessibilityLabel).toBe(expectedOrder[2]);
  });
});

