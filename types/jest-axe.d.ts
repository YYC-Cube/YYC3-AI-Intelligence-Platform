declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';

  interface ConfigureAxeOptions {
    rules?: Record<string, { enabled?: boolean; reviewOnFail?: boolean }>;
    [key: string]: unknown;
  }

  function configureAxe(options?: ConfigureAxeOptions): (html: string) => Promise<AxeResults>;

  export { AxeResults, configureAxe };
  export default configureAxe;
}
