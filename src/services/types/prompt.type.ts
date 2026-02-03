/**
 * Prompt的类型
 */
// 保存
export interface IPromptParams {
  id?: number;
  name: string;
  current?: number;
  prompt: string;
  status?: number;
  model_id?: number;
  tool_ids?: number[];
}
//修改
export interface IPromptUpdateParams extends IPromptParams {
  id: number;
}
//获取的params
export interface IPromptListParams {
  page?: number;
  size?: number;
  id?: number;
}
//Prompt列表返回数据
export interface IPromptResItem extends Record<string, unknown> {
  current: number;
  id: number;
  name: string;
  prompt: string;
  status: number;
  model_id: number;
  model_name: string;
  tool_names: string[];
}
/**
 * //数据集相关类型
 */
export interface IDataSetListParams {
  page: number;
  size: number;
  id?: number;
  name?: string;
}
// 数据集列表返回数据
export interface IDataSetResItem {
  count: number;
  create_time: string;
  description: string;
  id: number;
  name: string;
  status: number;
  update_time: string;
}
//保存数据集参数
export interface IDatasetParams {
  name: string;
  description: string;
  count: number;
  status?: number;
}
//修改
export interface IDatasetUpdateParams extends IDatasetParams {
  id: number;
}

/**
 * 数据集详情相关类型
 */
export interface IDataSetQaListParams {
  dataset_id: number;
  page: number;
  size: number;
  id: number;
  question?: string;
  answer?: string;
}
//返回数据集详情
export interface IDataSetQaResItem {
  answer: string;
  create_time: string;
  dataset_id: number;
  id: number;
  question: string;
  status: number;
  update_time: string;
}
//保存数据集详情参数
export interface IDatasetQaParams {
  dataset_id: number;
  question: string;
  answer: string;
  status: number;
}
//修改数据集详情参数
export interface IDatasetQaUpdateParams extends IDatasetQaParams {
  id: number;
}
/**
 * 批量推理的类型
 */
export interface IBatchInferenceListParams {
  page: number;
  size: number;
  id: number;
  name?: string;
  dataset_id: number;
  prompt_id: number;
  status?: number;
}
//返回批量推理详情
export interface IBatchInferenceResItem {
  completed_count: number;
  create_time: string;
  dataset_id: number;
  id: number;
  name: string;
  prompt_id: number;
  status: number;
  total_count: number;
  update_time: string;
  dataset_name: string;
  prompt_name: string;
  total_token: number;
}
//保存批量推理参数
export interface IBatchInferenceParams {
  name: string;
  dataset_id: number;
  prompt_id: number;
}
//批量推理详情列表请求
export interface IBatchInferenceDetailListParams {
  batch_inference_id: number;
  page: number;
  size: number;
}
export interface IBatchInferenceDetailResItem {
  ai_answer: string;
  answer: string;
  batch_inference_id: number;
  create_time: string;
  id: number;
  question: string;
  status: number;
  update_time: string;
}
