import { ReactComponent as SpinnerLine } from './spinner-line.svg';

import React from 'react';
import { Box } from 'grommet';

export function AppSpinner() {
  return (
    <Box align="center" justify="center">
      <SpinnerLine/>
    </Box>
  );
}
