import { EmptyState } from '@backstage/core-components';

import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading/Loading';
import { Table } from '../../organisms/ExecutionsDetailedTable';
import { useStyles } from '../../organisms/ExecutionsDetailedTable/Heading';
// import { useLabels } from '../../../hooks/useLabels';
import { QueryProvider as withQueryProvider } from '../../hoc/QueryProvider';
import { useTestWorkflowsWithExecutions } from '../../../hooks/useApi';

export const EntityPage: React.FC = withQueryProvider(() => {
  // const labels = useLabels();

  const {
    data: { results } = {},
    isLoading,
    error,
  } = useTestWorkflowsWithExecutions({
    filters: {
      // labels,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!results) {
    return (
      <div className={classes.empty}>
        <EmptyState
          missing="data"
          title="No data available"
          description="No executions were returned from Testkube."
        />
      </div>
    );
  }

  return <Table data={results} />;
});
