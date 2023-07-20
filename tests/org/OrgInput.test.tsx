import { test, expect } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {OrgInput} from '@knockout-js/org';

test('render orgInput', () => {
  render(<OrgInput searchApi="test" />);
  expect(screen.getByTestId('org-input')).toHaveBeenCalled();
});
