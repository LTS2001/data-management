import { getGrowthAnalysis } from '@/services/data-market.service';
import { useRequest } from '@umijs/max';

export const useGetGrowthAnalysis = () => {
  return useRequest(getGrowthAnalysis, {
    refreshDeps: [],
    manual: true,
  });
};
