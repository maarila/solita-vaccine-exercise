import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import ChartTitle from './ChartTitle';

test('includes given text', () => {
  const component = render(<ChartTitle text="Testing content" />);

  expect(component.container).toHaveTextContent('Testing content')
});
