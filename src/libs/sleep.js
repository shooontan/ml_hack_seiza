// @flow
export default (timeout: number): Promise<number> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(timeout), timeout);
  });
