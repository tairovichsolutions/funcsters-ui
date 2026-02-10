/* eslint-disable @typescript-eslint/no-explicit-any */
export type TestStatus = "pass" | "fail";

export type TestCase = {
  id: string;
  title: string;
  input: any;
  test: string;
  actual: string;
  error: string;
  passed: boolean;
  expected: string;
  status: TestStatus;
  debug: string | number;
};
