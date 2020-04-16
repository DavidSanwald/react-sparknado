import React from 'react';
import { render } from '@testing-library/react';
import { Spark } from '../src';

const data = [0, 10, 5, 22, 3.6, 11];

describe('Sparkline', () => {
  it('renders without crashing', () => {
    render(<Spark data={data} />);
  });
});
