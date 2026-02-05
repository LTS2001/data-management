import { getLossAnalysis } from '@/services/data-market.service';
import { useRequest } from '@umijs/max';

export const useGetLossAnalysis = () => {
  return useRequest(getLossAnalysis, {
    refreshDeps: [],
    manual: true,
  });
};
