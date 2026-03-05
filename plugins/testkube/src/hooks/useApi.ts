import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@backstage/core-plugin-api';
import { testkubeApiRef } from '../api/TestkubeApi';
import { useMemo } from 'react';
import {
  TestWorkflowExecutionSummary,
  TestWorkflowWithExecutionSummary,
} from '../types/common';

export const useExecutions = () => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    refetchInterval: 30000,
    queryKey: ['executions'],
    queryFn: async () => TestkubeAPI.getTestWorkflowExecutionsResult(),
  });
};

type UseExecutionLogProps = {
  workflowName: string;
  executionId: string;
  stepRef?: string;
};

const sliceLines = (fullLog: string, stepRef: string) => {
  const lines = fullLog.split('\n');
  if (lines.length === 0) return fullLog;
  let streamStarted = false;
  let isDone = false;

  return lines
    .filter((line, i) => {
      if (
        (stepRef === 'init' && i === 0) ||
        (stepRef && line.startsWith(`${stepRef}start`))
      ) {
        streamStarted = true;
        return stepRef === '' ? streamStarted : !streamStarted;
      }
      if (streamStarted && /^\\\[a-z0-9]{7}\start\$/.test(line)) {
        isDone = true;
        return !isDone;
      }
      return !isDone && streamStarted;
    })
    .join('\n');
};

export const useExecutionLog = ({
  workflowName,
  executionId,
  stepRef = 'init',
}: UseExecutionLogProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testWorkflowExecutionLog', workflowName, executionId, stepRef],
    queryFn: async () =>
      TestkubeAPI.getTestWorkflowExecutionLog(workflowName, executionId),
  });
};

type UseSlicedExecutionLogProps = {
  stepName: string;
  log: string;
};

export const useSlicedExecutionLog = ({
  stepName,
  log,
}: UseSlicedExecutionLogProps) =>
  useMemo(() => sliceLines(log, stepName), [log, stepName]);

type UseExecutionProps = {
  workflowName: string;
  executionId: string;
};

export const useExecution = ({
  workflowName,
  executionId,
}: UseExecutionProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testWorkflowExecution', workflowName, executionId],
    queryFn: async () =>
      TestkubeAPI.getTestWorkflowExecutionById(workflowName, executionId),
  });
};

type UseTestWorkflowsWithExecutionsProps = {
  filters?: {
    labels?: string;
    page?: number;
    pageSize?: number;
  };
};

const mapToExecutionResult = (
  items: TestWorkflowWithExecutionSummary[],
): TestWorkflowExecutionSummary[] => {
  return items
    .filter(item => !!item.workflow)
    .map(item => {
      if (item.latestExecution) {
        return {
          ...item.latestExecution,
          workflow: item.workflow!,
        };
      }

      const wf = item.workflow!;
      return {
        id: `no-execution-${wf.name}`,
        name: wf.name!,
        number: 0,
        scheduledAt: '',
        statusAt: '',
        groupId: '',
        runnerId: '',
        workflow: wf,
      };
    });
};

const computeMetrics = (executions: TestWorkflowExecutionSummary[]) => {
  const initial = {
    results: executions.length,
    passed: 0,
    failed: 0,
    aborted: 0,
    running: 0,
    queued: 0,
    noData: 0,
  };

  return executions.reduce((acc, e) => {
    const status = e.result?.status;
    if (status) {
      switch (status) {
        case 'passed':
        case 'failed':
        case 'aborted':
        case 'running':
        case 'queued':
          acc[status]++;
          break;
        default:
          acc.noData++;
          break;
      }
    } else {
      acc.noData++;
    }
    return acc;
  }, initial);
};

export const useTestWorkflowsWithExecutions = ({
  filters,
}: UseTestWorkflowsWithExecutionsProps = {}) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testWorkflowsWithExecutions', filters],
    refetchInterval: 3000,
    queryFn: async () => {
      const workflowsWithExecutions =
        await TestkubeAPI.getTestWorkflowsWithExecutions(filters);

      const results = mapToExecutionResult(workflowsWithExecutions);

      const metrics = computeMetrics(results);

      return {
        totals: metrics,
        filtered: metrics,
        results,
      };
    },
  });
};

export const useTestWorkflow = (name: string) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testWorkflow', name],
    queryFn: async () => TestkubeAPI.getTestWorkflow(name),
  });
};

type UseTestWorkflowExecutionsByNameProps = {
  name: string;
};

export const useTestWorkflowExecutionsByName = ({
  name,
}: UseTestWorkflowExecutionsByNameProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testWorkflowExecutionsByName', name],
    queryFn: async () => TestkubeAPI.getTestWorkflowExecutionsByName(name),
  });
};

type UseRunTestWorkflowByNameMutationProps = {
  name: string;
};

export const useRunTestWorkflowByNameMutation = ({
  name,
}: UseRunTestWorkflowByNameMutationProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => TestkubeAPI.runTestWorkflowByName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['testWorkflowsWithExecutions'],
      });
    },
  });
};
