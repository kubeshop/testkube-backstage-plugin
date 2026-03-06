const baseConfig = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...baseConfig,
  plugins: [...(baseConfig.plugins ?? []), 'prettier'],
  extends: [...(baseConfig.extends ?? []), 'plugin:prettier/recommended'],
  rules: {
    ...baseConfig.rules,
    'prettier/prettier': 'error',
    '@typescript-eslint/no-redeclare': 'off',
  },
};
