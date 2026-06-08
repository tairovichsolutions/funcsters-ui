/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiTestResult = {
  test: number;
  input: Record<string, any>;
  debug: string;
  actual: any;
  passed: boolean;
  expected: any;
  error: string | null;
};

export type ApiTestRunSummary = {
  total: number;
  passed: number;
  failed: number;
  results: ApiTestResult[];
};

export type RunCodeApiResponse = {
  id: string | null;
  status: string;
  message: string | null;
  languageName: string | null;
  languageVersion: string | null;
  exitCode: number | null;
  signal: string | null;
  cpuTime: number | null;
  wallTime: number | null;
  memory: number | null;
  errorOutput: string | null;
  executedAt: string | null;
  testRunSummary: ApiTestRunSummary | null;
};
