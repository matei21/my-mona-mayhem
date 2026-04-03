import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
	// Global ignores
	{
		ignores: ['dist/', 'node_modules/', '.astro/'],
	},
	// TypeScript files
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			// Unused variables - error on unused vars
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			// Code style improvements
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'error',
			'no-var': 'error',
		},
	},
	// Astro files
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.astro'],
		rules: {
			// Astro-specific overrides if needed
		},
	},
];
