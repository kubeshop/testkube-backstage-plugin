import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

import { ShowLogsDialog } from './ShowLogsDialog';

const navigateMock = jest.fn();

jest.mock('../../../hooks/useEnterpriseNavigation', () => ({
  useEnterpriseNavigation: () => ({
    shouldNavigateToUi: true,
    navigate: navigateMock,
  }),
}));

describe('ShowLogsDialog', () => {
  it('redirects to external UI in enterprise mode', async () => {
    const onOpen = jest.fn();

    const { getByLabelText } = await renderInTestApp(
      <ShowLogsDialog
        executionName="exec-1"
        executionId="exec-1"
        onOpen={onOpen}
      />,
    );

    fireEvent.click(getByLabelText('more'));

    expect(onOpen).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalled();
  });
});
