export type TestStatus = "pass" | "fail";

export type TestCase = {
  id: string;
  title: string;
  input: {
    arr: number[];
  };
  test: string;
  actual: string;
  passed: boolean;
  expected: string;
  status: TestStatus;
  debug: string | number;
};
