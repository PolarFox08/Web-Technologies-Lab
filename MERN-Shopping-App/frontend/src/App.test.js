import { render, screen } from '@testing-library/react';
import App from './App';

test('renders shopping list header and add button', () => {
  render(<App />);
  const headerElement = screen.getByText(/🛒 My Shopping List/i);
  expect(headerElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/Add Item/i);
  expect(buttonElement).toBeInTheDocument();
});
