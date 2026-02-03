export interface IModelListRes {
  type: string;
  id: number;
  status: number;
  verdor: string;
  name: string;
  description: string;
}

export interface IModelListParams {
  page: number;
  size: number;
  id?: number;
}
