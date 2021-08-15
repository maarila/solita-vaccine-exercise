import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import HeaderBar from './HeaderBar';

test('includes expected content', () => {
  const component = render(<HeaderBar lastDate="2021-01-11T10:09:10.695Z" />);

  expect(component.container).toHaveTextContent('Statistics last updated on 11.1.2021 10:10.')
});

test('rounds timestamp up', () => {
  const component = render(<HeaderBar lastDate="2021-01-11T10:09:00.695Z" />);

  expect(component.container).toHaveTextContent('Statistics last updated on 11.1.2021 10:10.')
});
