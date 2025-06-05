import { qVK } from './q-params';

export const getSearchParams = () => {
  const paramsString = qVK?.replace('?', '') ?? '';
  const searchParams = new URLSearchParams(paramsString);

  return searchParams;
};
