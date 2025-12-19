/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiTestResult = {
  test: number;
  input: {
    arr: number[];
  };
  debug: string;
  actual: number;
  passed: boolean;
  expected: number;
  error: string | null;
};

export type ApiTestRunSummary = {
  total: number;
  passed: number;
  failed: number;
  results: ApiTestResult[];
};

export type RunCodeApiResponse = {
  data: any;
  message: string;
  statusCode: number;
  description: string;
  stderr: string | null;
  executedAt: string | null;
  compileOutput: string | null;
  testRunSummary: ApiTestRunSummary | null;
};
