import {
  ProColumns,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import {
  proTableColumnsConfig,
  proTableFormConfig,
  proTableOptionsConfig,
  proTablePaginationConfig,
  proTableRequestAdapterParamsAndData,
  proTableSearchConfig,
} from './table-config';

export type CustomTableProps<T = any> = {
  /**
   * 列定义配置
   */
  columns: ProColumns<T>[];
  /**
   * 请求数据的函数
   */
  requestFn?: (params: any) => Promise<any>;
  /**
   * 搜索配置
   */
  search?: ProTableProps<T, any>['search'];
  /**
   * 分页配置
   */
  pagination?: ProTableProps<T, any>['pagination'];
  /**
   * 操作配置
   */
  options?: ProTableProps<T, any>['options'];
} & Omit<ProTableProps<T, any>, 'columns'>;

export default function CustomProTable<T extends Record<string, any> = any>({
  columns,
  requestFn,
  form,
  search,
  options,
  pagination,
  ...restProps
}: CustomTableProps<T>) {
  return (
    <ProTable<T>
      form={{ ...proTableFormConfig, ...form }}
      columns={proTableColumnsConfig<T>(columns)}
      tableClassName="custom-table"
      pagination={{ ...proTablePaginationConfig, ...pagination }}
      search={{ ...proTableSearchConfig, ...search }}
      options={{ ...proTableOptionsConfig, ...options }}
      request={
        requestFn
          ? (params, sorter) => {
              return proTableRequestAdapterParamsAndData(
                params,
                sorter,
                requestFn,
              );
            }
          : undefined
      }
      tableAlertRender={false}
      toolBarRender={() => []}
      {...restProps}
    />
  );
}
