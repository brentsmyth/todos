import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import AddItem from '../components/AddItem';

const mockUseTodoContext = jest.fn();
jest.mock('../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

describe('AddItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AddItem component', () => {
    const contextData = {
      addItem: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <AddItem />
        </PaperProvider>
      </SafeAreaProvider>
    );

    expect(getByText('Add')).toBeTruthy();
  });

  it('calls addItem when the Add button is pressed', () => {
    const contextData = {
      addItem: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText, getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <AddItem />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const input = getByTestId('addItemInput');
    fireEvent.changeText(input, 'New item');
    fireEvent.press(getByText('Add'));

    expect(contextData.addItem).toHaveBeenCalledWith('New item');
  });

  it('clears the input after addItem is called', () => {
    const contextData = {
      addItem: jest.fn(),
    };
    mockUseTodoContext.mockReturnValue(contextData);

    const { getByText, getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <AddItem />
        </PaperProvider>
      </SafeAreaProvider>
    );

    const input = getByTestId('addItemInput');
    fireEvent.changeText(input, 'New item');
    fireEvent.press(getByText('Add'));

    expect(input.props.value).toBe('');
  });
});

