import { getTransitionAnalysis } from '@/services/data-market.service';
import { useRequest } from '@umijs/max';

export const useGetTransitionAnalysis = () => {
  return useRequest(getTransitionAnalysis, {
    refreshDeps: [],
    manual: true,
  });
};
