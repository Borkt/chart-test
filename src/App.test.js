import React from 'react';
import { cleanup, render } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('App.js', () => {
  it('matches previous Snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders initial loading text', () => {
    const { getByText } = render(<App />);
    expect(getByText('Data Loading or Unavailable...')).toBeInTheDocument();
  });
});
