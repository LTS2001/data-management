export interface IExperimentItem {
  id: string;
  name: string;
  create_time: string;
  update_time: string;
  description?: string;
  type?: string;
  status?: string;
}

export interface IExperimentParams {
  page?: number;
  page_size?: number;
  name?: string;
  time_range?: [string, string];
  sort_field?: string;
  sort_order?: 'ascend' | 'descend';
}

export interface IExperimentRes {
  items: IExperimentItem[];
  total: number;
}
