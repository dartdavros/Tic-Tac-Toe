import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Игнорируемые директории
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    // Базовые правила для всех JS/TS файлов
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: '18',
      },
    },
    rules: {
      // Правила React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Правила React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Правила TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // argsIgnorePattern — для аргументов функций
          argsIgnorePattern: '^_',
          // varsIgnorePattern — для переменных (включая деструктуризацию)
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      // Общие правила качества кода
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Правила для конфигурационных файлов
    files: ['vite.config.ts', 'eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);