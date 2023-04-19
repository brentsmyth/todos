import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddItem from '../components/AddItem';

const mockUseTodoContext = jest.fn();
jest.mock('../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  addItem: (item: string) => void;
}

const setup = (contextData: ContextData) => {
  mockUseTodoContext.mockReturnValue(contextData);
  return render(<AddItem />);
};

describe('AddItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AddItem component', () => {
    const contextData: ContextData = {
      addItem: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    expect(getByTestId('addItemButton')).toBeTruthy();
  });

  it('calls addItem when the Add button is pressed', () => {
    const contextData: ContextData = {
      addItem: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    const input = getByTestId('addItemInput');
    fireEvent.changeText(input, 'New item');
    fireEvent.press(getByTestId('addItemButton'));

    expect(contextData.addItem).toHaveBeenCalledWith('New item');
  });

  it('clears the input after addItem is called', () => {
    const contextData: ContextData = {
      addItem: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    const input = getByTestId('addItemInput');
    fireEvent.changeText(input, 'New item');
    fireEvent.press(getByTestId('addItemButton'));

    expect(input.props.value).toBe('');
  });
});

