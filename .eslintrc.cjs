/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['@fastone/eslint-config'],
	ignorePatterns: [
		'**/*.config.js',
		'**/*.config.cjs',
		'**/*.config.ts',
		'**/*.config.tsx',
		'.eslintrc.cjs',
		'main',
		'dist',
		'src/out',
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {
		'tailwindcss/no-custom-classname': 'off',
		'import/no-extraneous-dependencies': 'off',
	},
};
