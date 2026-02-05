import { getUserAssets } from '@/services/data-market.service';
import { useRequest } from '@umijs/max';

export const useGetUserAssetsAnalysis = () => {
  return useRequest(getUserAssets, {
    refreshDeps: [],
    manual: true,
  });
};
