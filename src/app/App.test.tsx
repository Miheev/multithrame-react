import React from 'react';
import { render } from '@testing-library/react';

import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App/>);
  let textElement = getByText(/popular/i);
  expect(textElement).toBeInTheDocument();
});
