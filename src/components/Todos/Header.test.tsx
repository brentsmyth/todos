import React from 'react';
import { Alert } from "react-native";
import { render, fireEvent } from '@testing-library/react-native';
import Header from './Header';
import { List } from '../../shared/types';

jest.spyOn(Alert, 'alert');

const mockUseTodoContext = jest.fn();
jest.mock('../../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  lists: List[];
  currentList: List;
  changeList?: (list: List) => void;
  addList?: (name: string) => void;
  deleteList?: (list: List) => void;
}

const setup = (contextData: ContextData) => {
  mockUseTodoContext.mockReturnValue(contextData);
  return render(<Header />);
};

describe('Header', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
    };
    const { getByTestId } = setup(contextData);

    const header = getByTestId('header');
    expect(header).toBeTruthy();
  });

  it('renders the header with the current list name', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
    };
    const { getByText } = setup(contextData);

    const listNameElement = getByText('Test List');
    expect(listNameElement).toBeTruthy();
  });

  it('opens the menu when the menu button is pressed', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
    };
    const { getByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem = getByTestId('addListButton');
    expect(menuItem).toBeTruthy();
  });

  it('renders the list of available lists when the menu is opened', () => {
    const contextData: ContextData = {
      lists: [
        { name: 'Test List 1', id: 1 },
        { name: 'Test List 2', id: 2 },
      ],
      currentList: { name: 'Test List 1', id: 1 },
    };
    const { getByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem1 = getByTestId('menuItem-1');
    const menuItem2 = getByTestId('menuItem-2');
    expect(menuItem1).toBeTruthy();
    expect(menuItem2).toBeTruthy();
  });

  it('calls changeList with correct list entity when a different list is selected', () => {
    const contextData: ContextData = {
      lists: [
        { name: 'Test List 1', id: 1 },
        { name: 'Test List 2', id: 2 },
      ],
      currentList: { name: 'Test List 1', id: 1 },
      changeList: jest.fn(),
    };
    const { getByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem = getByTestId('menuItem-2');
    fireEvent.press(menuItem);

    expect(contextData.changeList).toHaveBeenCalledWith({ name: 'Test List 2', id: 2 });
  });

  it('shows the "Add list" view when the "Add list" menu item is pressed', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
    };
    const { getByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem = getByTestId('addListButton');
    fireEvent.press(menuItem);

    const addListInput = getByTestId('addListInput');
    expect(addListInput).toBeTruthy();
  });

  it('calls addList with a name when "Add list" is actioned and submitted', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
      addList: jest.fn(),
    };
    const { getByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem = getByTestId('addListButton');
    fireEvent.press(menuItem);

    const addListInput = getByTestId('addListInput');
    fireEvent.changeText(addListInput, 'New List');
    fireEvent(addListInput, 'onSubmitEditing');

    expect(contextData.addList).toHaveBeenCalledWith('New List');
  });

  it('hides the "Add list" view when a new list is submitted', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
      addList: jest.fn(),
    };
    const { getByTestId, queryByTestId } = setup(contextData);

    const menuButton = getByTestId('menuButton');
    fireEvent.press(menuButton);

    const menuItem = getByTestId('addListButton');
    fireEvent.press(menuItem);

    const addListInput = getByTestId('addListInput');
    fireEvent.changeText(addListInput, 'New List');
    fireEvent(addListInput, 'onSubmitEditing');

    expect(queryByTestId('addListInput')).toBeFalsy();
  });

  it('shows delete confirmation dialog when the "Delete" button is pressed', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
    };
    const { getByTestId } = setup(contextData);

    const deleteListButton = getByTestId('deleteListButton');
    fireEvent.press(deleteListButton);

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('calls deleteList with the correct list entity when "OK" is pressed on the delete confirmation dialog', () => {
    const contextData: ContextData = {
      lists: [],
      currentList: { name: 'Test List', id: 1 },
      deleteList: jest.fn(),
    };
    const { getByTestId } = setup(contextData);

    const deleteListButton = getByTestId('deleteListButton');
    fireEvent.press(deleteListButton);

    // @ts-ignore
    const okButton = Alert.alert.mock.calls[0][2][1];
    okButton.onPress();

    expect(contextData.deleteList).toHaveBeenCalledWith({ name: 'Test List', id: 1 });
  });
});

