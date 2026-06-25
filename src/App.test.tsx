import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the production tournament board', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /track the ai world cup/i })).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /generate insight/i })).toBeInTheDocument();
});
