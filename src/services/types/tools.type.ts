export interface IToolsResItem {
  id: number;
  name: string;
  code: string;
  status: number;
  description: string;
  create_time: string;
}
export interface IToolListParams {
  page?: number;
  size?: number;
  name?: string;
}
