// 这个文件里面放置了Prompt Polit、数据集(dateset)、批量推理的接口
import { request } from './request';
import { ApiResult, PagedResult } from './types/comon';
import {
  IBatchInferenceDetailListParams,
  IBatchInferenceDetailResItem,
  IBatchInferenceListParams,
  IBatchInferenceParams,
  IBatchInferenceResItem,
  IDataSetListParams,
  IDataSetQaListParams,
  IDataSetResItem,
  IDatasetParams,
  IDatasetQaParams,
  IDatasetQaUpdateParams,
  IDatasetUpdateParams,
  IPromptListParams,
  IPromptParams,
  IPromptResItem,
  IPromptUpdateParams,
} from './types/prompt.type';
/**
 * prompt接口
 */
export const getPromptList = async (params: {
  params: IPromptListParams;
}): Promise<PagedResult<IPromptResItem>> => {
  return request.get(`/labs-api/v1/prompt`, { params });
};
export const getPromptOptions = async (
  params: IPromptListParams,
): Promise<PagedResult<IPromptResItem>> => {
  return request.get(`/labs-api/v1/prompt`, { params });
};
// 保存prompt
export function savePrompt(
  params?: IPromptParams,
): Promise<ApiResult<IPromptResItem>> {
  return request.post(`/labs-api/v1/prompt/create`, params);
}

// 修改prompt
export function updatePrompt(
  params?: Partial<IPromptUpdateParams>,
): Promise<any> {
  return request.post(`/labs-api/v1/prompt/update`, params);
}
//删除prompt
export function deletePrompt(id: number): Promise<any> {
  return request.post(`/labs-api/v1/prompt/delete`, { id });
}

/**
 * 数据集列表接口
 */
export const getDatasetList = async (params: {
  params: IDataSetListParams;
}): Promise<PagedResult<IDataSetResItem>> => {
  return request.get(`/labs-api/v1/dataset`, { params });
};

// 新建保存Dataset
export function saveDataset(params?: IDatasetParams): Promise<any> {
  return request.post(`/labs-api/v1/dataset/create`, params);
}

// 修改Dataset
export function updateDataset(params?: IDatasetUpdateParams): Promise<any> {
  return request.post(`/labs-api/v1/dataset/update`, params);
}
//删除Dataset
export function deleteDataset(id: number): Promise<any> {
  return request.post(`/labs-api/v1/dataset/delete`, { id });
}

/**
 * 数据集详情列表接口
 */
export const getDatasetQaList = async (params: IDataSetQaListParams) => {
  return request.get(`/labs-api/v1/dataset/qa`, { params });
};
// 保存详情
export function saveDatasetQa(params?: IDatasetQaParams): Promise<any> {
  return request.post(`/labs-api/v1/dataset/qa/create`, params);
}

// 修改Dataset
export function updateDatasetQa(params?: IDatasetQaUpdateParams): Promise<any> {
  return request.post(`/labs-api/v1/dataset/qa/update`, params);
}
//删除Dataset
export function deleteDatasetQa(id: number): Promise<any> {
  return request.post(`/labs-api/v1/dataset/qa/delete`, { id });
}

//
/**
 * 批量推理
 */

// 获取列表

export const getBatchInferenceList = async (params: {
  params: IBatchInferenceListParams;
}): Promise<PagedResult<IBatchInferenceResItem>> => {
  return request.get(`/labs-api/v1/inference/batch`, { params });
};
// 添加批量推理
export function saveBatchInference(
  params?: IBatchInferenceParams,
): Promise<any> {
  return request.post(`/labs-api/v1/inference/batch/create`, params);
}
//删除批量推理
export function deleteBatchInference(id: number): Promise<any> {
  return request.post(`/labs-api/v1/inference/batch/delete`, { id });
}
//执行批量推理
export function runBatchInference(batch_inference_id: number): Promise<any> {
  return request.post(`/labs-api/v1/inference/batch/run`, {
    batch_inference_id,
  });
}
//批量推理详情
export const getBatchInferenceDetailList = async (params: {
  params: IBatchInferenceDetailListParams;
}): Promise<PagedResult<IBatchInferenceDetailResItem>> => {
  return request.get(`/labs-api/v1/inference/batch/result`, { params });
};
