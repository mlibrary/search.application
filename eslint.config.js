import globals from 'globals';
import mochaPlugin from 'eslint-plugin-mocha';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  pluginJs.configs.all,
  mochaPlugin.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.chai,
        ...globals.mocha,
        ...globals.node
      }
    }
  },
  stylistic.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/spaced-comment': ['error', 'always', { block: { balanced: true } }],
      'arrow-body-style': ['error', 'always'],
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'one-var': ['error', { initialized: 'never' }],
      'sort-imports': ['error', { ignoreCase: true }]
    }
  },
  {
    files: ['test/**/*.spec.js'],
    rules: {
      'func-names': 'off',
      'max-lines': 'off',
      'no-unused-expressions': 'off',
      'prefer-arrow-callback': 'off'
    }
  }
];
