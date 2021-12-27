/* eslint-disable no-console */
console.error = (originalFunction: Function): ((string) => void) => (e: string): void => {
  originalFunction.call(console, e);

  throw new Error(e);
};
