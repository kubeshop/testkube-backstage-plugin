import {
  CodeSnippet,
  WarningPanel,
  EmptyState,
} from '@backstage/core-components';

export const Error = ({ error }: { error: Error }) => {
  return (
    <>
      <EmptyState
        missing="info"
        title="No data available"
        description="Unable to load data from Testkube API, please review your set up."
      />
      <br />
      <br />
      <br />
      <WarningPanel
        severity="error"
        title="Could not fetch Test Workflow Executions from TestKube."
      >
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    </>
  );
};
