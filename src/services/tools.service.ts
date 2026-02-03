import { request } from './request';
import { PagedResult } from './types/comon';
import { IToolListParams, IToolsResItem } from './types/tools.type';
//获取工具列表的接口
export const getToolsList = async (params: {
  params: IToolListParams;
}): Promise<PagedResult<IToolsResItem>> => {
  return request.get(`/labs-api/v1/tool`, { params });
};
