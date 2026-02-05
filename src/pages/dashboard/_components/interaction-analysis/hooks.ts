import { getInteractionAnalysis } from '@/services/data-market.service';
import { useRequest } from '@umijs/max';

export const useGetInteractionAnalysis = () => {
  return useRequest(getInteractionAnalysis, {
    refreshDeps: [],
    manual: true,
  });
};
