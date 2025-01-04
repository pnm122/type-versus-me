/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}]
	},
	moduleNameMapper: {
		'^@/(.*)': '<rootDir>/src/$1',
		'^\\$shared/(.*)': '<rootDir>/../shared/$1'
	},
	setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
	testPathIgnorePatterns: ['dist']
}
