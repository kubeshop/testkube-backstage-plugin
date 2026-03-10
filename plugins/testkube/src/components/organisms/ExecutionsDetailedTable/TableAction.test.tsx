import { fireEvent, render } from '@testing-library/react';

import { TableAction } from './TableAction';

jest.mock('../../../hooks/useEnterpriseNavigation', () => ({
  useEnterpriseNavigation: () => ({
    shouldNavigateToUi: true,
    navigate: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useApi', () => ({
  useRunTestWorkflowByNameMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

describe('TableAction', () => {
  it('redirects to external UI in enterprise mode when running workflow', () => {
    const onOpenExecutionHistoryDialog = jest.fn();
    const onOpenSnackbar = jest.fn();

    const { getByLabelText, getByText } = render(
      <TableAction
        name="my-workflow"
        onOpenExecutionHistoryDialog={onOpenExecutionHistoryDialog}
        onOpenSnackbar={onOpenSnackbar}
      />,
    );

    fireEvent.click(getByLabelText('more'));
    fireEvent.click(getByText('Run'));

    expect(onOpenSnackbar).not.toHaveBeenCalled();
    expect(onOpenExecutionHistoryDialog).not.toHaveBeenCalled();
  });
});
