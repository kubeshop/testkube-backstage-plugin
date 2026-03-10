import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

import { ShowManifestDialog } from './ShowManifestDialog';

const navigateMock = jest.fn();

jest.mock('../../../hooks/useEnterpriseNavigation', () => ({
  useEnterpriseNavigation: () => ({
    shouldNavigateToUi: true,
    navigate: navigateMock,
  }),
}));

describe('ShowManifestDialog', () => {
  it('redirects to external UI in enterprise mode', async () => {
    const onOpen = jest.fn();

    const { getByText } = await renderInTestApp(
      <ShowManifestDialog name="my-workflow" onOpen={onOpen} />,
    );

    fireEvent.click(getByText('my-workflow'));

    expect(onOpen).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalled();
  });
});
