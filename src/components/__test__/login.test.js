import { render, screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import Login from '../../pages/auth/Login';
import reducer from '../../features/UserSlice';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);
const initvalue = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};

test("should return the initial state", () => {
  expect(reducer(undefined, { type: undefined })).toEqual(initvalue);
});

test("should handle login success", () => {
  const action = {
    type: 'users/loginUser/fulfilled',
    payload: { email: 'test@example.com' }
  };
  expect(reducer(initvalue, action)).toEqual({
    ...initvalue,
    isSuccess: true,
    user: { email: 'test@example.com' }
  });
});

test("should handle login error", () => {
  const action = {
    type: 'users/loginUser/rejected',
    payload: 'Invalid credentials'
  };
  expect(reducer(initvalue, action)).toEqual({
    ...initvalue,
    isError: true,
    message: 'Invalid credentials'
  });
});

test('Login component matches snapshot', () => {
  const store = mockStore({ users: initvalue });
  const tree = renderer.create(
    <Provider store={store}>
      <Login />
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders login form fields', () => {
  const store = mockStore({ users: initvalue });
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test('can type and submit login form', () => {
  const store = mockStore({ users: initvalue });
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  const emailInput = screen.getByLabelText(/Email Address/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitBtn = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });
  fireEvent.click(submitBtn);

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('123456');
});