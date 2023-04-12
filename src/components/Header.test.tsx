import React from 'react';
import { render, waitFor, fireEvent } from 'react-native-testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './Header';
import { List } from '../shared/types';

const mockUseTodoContext = jest.fn();
jest.mock('../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  lists: List[];
  currentList: List;
  changeList?: (list: List) => void;
  addList?: (name: string) => void;
}

describe('Header', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const header = getByTestId('header');
    expect(header).toBeTruthy();
  });

  it('renders the header with the current list name', async () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    await waitFor(() => {
      const listNameElement = getByText('Test List');
      expect(listNameElement).toBeTruthy();
    });
  });

  it('opens the menu when the menu button is pressed', async () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText, getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem = getByText('Add list');
      expect(menuItem).toBeTruthy();
    });
  });

  it('renders the list of available lists when the menu is opened', async () => {
    const contextData: ContextData = {
      lists: [
        { name: 'Test List 1', uuid: 'test-uuid-1' },
        { name: 'Test List 2', uuid: 'test-uuid-2' },
      ],
      currentList: { name: 'Test List 1', uuid: 'test-uuid-1' },
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem1 = getByTestId('menuItem-test-uuid-1');
      const menuItem2 = getByTestId('menuItem-test-uuid-2');
      expect(menuItem1).toBeTruthy();
      expect(menuItem2).toBeTruthy();
    });
  });

  it('calls changeList with correct list entity when a different list is selected', async () => {
    const contextData: ContextData = {
      lists: [
        { name: 'Test List 1', uuid: 'test-uuid-1' },
        { name: 'Test List 2', uuid: 'test-uuid-2' },
      ],
      currentList: { name: 'Test List 1', uuid: 'test-uuid-1' },
      changeList: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem = getByText('Test List 2');
      fireEvent.press(menuItem);
    });

    expect(contextData.changeList).toHaveBeenCalledWith({ name: 'Test List 2', uuid: 'test-uuid-2' });
  });

  it('shows the "Add list" view when the "Add list" menu item is pressed', async () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem = getByText('Add list');
      fireEvent.press(menuItem);
    });

    const addListInput = getByTestId('addListInput');
    expect(addListInput).toBeTruthy();
  });

  it('calls addList with a name when "Add list" is actioned and submitted', async () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
      addList: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem = getByText('Add list');
      fireEvent.press(menuItem);
    });

    const addListInput = getByTestId('addListInput');
    fireEvent.changeText(addListInput, 'New List');
    fireEvent(addListInput, 'onSubmitEditing');

    await waitFor(() => {
      expect(contextData.addList).toHaveBeenCalledWith('New List');
    });
  });

  it('hides the "Add list" view when a new list is submitted', async () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', uuid: 'test-uuid' },
      addList: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByTestId, getByText, queryByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <Header />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    await waitFor(() => {
      const menuItem = getByText('Add list');
      fireEvent.press(menuItem);
    });

    const addListInput = getByTestId('addListInput');
    fireEvent.changeText(addListInput, 'New List');
    fireEvent(addListInput, 'onSubmitEditing');

    expect(queryByTestId('addListInput')).toBeFalsy();
  });
});

