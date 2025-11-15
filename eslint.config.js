import architecturalDiscipline from '@architectural-discipline/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
	architecturalDiscipline.configs.recommended,
	{
		rules: {
			'@architectural-discipline/max-lines': 'warn',
			'@architectural-discipline/max-complexity': 'warn',
		},
	},
];

