export interface ApiResult<TData = unknown> {
  code: number;
  data: TData;
  message?: string;
}

export interface PagedResult<TRecord> {
  code: number;
  data?: {
    current: number;
    pages: number;
    items: TRecord[];
    size: number;
    total: number;
  };
  message: string;
}
