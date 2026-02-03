// 这个文件里面放置了Prompt 实验室的接口
import { request } from './request';
import { PagedResult } from './types/comon';
import { IModelListParams, IModelListRes } from './types/prompt-lab.type';

export const getModelList = async (params: {
  params: IModelListParams;
}): Promise<PagedResult<IModelListRes>> => {
  return request.get(`labs-api/v1/model`, { params });
};
