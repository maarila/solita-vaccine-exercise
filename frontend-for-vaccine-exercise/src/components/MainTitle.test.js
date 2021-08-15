import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import MainTitle from './MainTitle';

test('includes main title text', () => {
  const component = render(<MainTitle />);

  expect(component.container).toHaveTextContent('Vaccine statistics')
});

test('confirm the icon container exists', () => {
  const component = render(<MainTitle />);
  const titleLine = component.container.querySelector('.title-line')
  const titleLineIcon = component.container.querySelector('.header-icon')

  expect(titleLine).toContainElement(titleLineIcon)
});
