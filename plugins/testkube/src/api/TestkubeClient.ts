

export const TestkubeClient = {
  listTestWorkflowExecutions: async () => {
    const response = await fetch(`/v1/test-workflow-executions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching test workflow executions: ${response.statusText}`);
    }

    return response.json();
  }
}
