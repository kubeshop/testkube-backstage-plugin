// example: replaceStringVariables('{orgId}', { orgId: '123' }) => '123'
export const replaceStringVariables = (
  str: string,
  variables: Record<string, string>,
) => {
  return str.replace(/{(\w+)}/g, (match, key) => variables[key] || match);
};
