import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import GetStarted from './GetStarted';

const mockUseTodoContext = jest.fn();
jest.mock('../../contexts/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

interface ContextData {
  addList: (list: string) => void;
}

const setup = (contextData: ContextData) => {
  mockUseTodoContext.mockReturnValue(contextData);
  return render(<GetStarted />);
};

describe('GetStarted', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the GetStarted component', () => {
    const contextData: ContextData = {
      addList: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    expect(getByTestId('getStartedButton')).toBeTruthy();
  });

  it('calls addList when the Add List button is pressed', async () => {
    const contextData: ContextData = {
      addList: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    const input = getByTestId('getStartedInput');
    fireEvent.changeText(input, 'New list');

    await act(async () => {
      fireEvent.press(getByTestId('getStartedButton'));
    });

    expect(contextData.addList).toHaveBeenCalledWith('New list');
  });

  it('clears the input after addList is called', async () => {
    const contextData: ContextData = {
      addList: jest.fn(),
    };

    const { getByTestId } = setup(contextData);

    const input = getByTestId('getStartedInput');
    fireEvent.changeText(input, 'New list');

    await act(async () => {
      fireEvent.press(getByTestId('getStartedButton'));
    });

    expect(input.props.value).toBe('');
  });
});
