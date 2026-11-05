module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        jsx: 'react-jsx',
      },
    ],
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  // 业务代码位于仓库根目录 components / hooks / utils，而非 src/。
  // 之前只采集 src/** 导致覆盖率恒为 0%，门禁形同虚设。
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'types/**/*.{ts,tsx}',
    '!components/ui/**',
    '!components/**/index.ts',
    '!**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  // 防回退阈值：以 2026-11-05 实测基线（16.39/9.8/8.33/16.31）为参照锁定，
  // 只允许上升不允许下降；长期目标 lines ≥50%（见 docs/audits 报告）。
  coverageThreshold: {
    global: {
      statements: 15,
      branches: 9,
      functions: 8,
      lines: 15,
    },
  },
  verbose: true,
  testTimeout: 10000,
};
