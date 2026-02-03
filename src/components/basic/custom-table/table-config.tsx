import { t } from '@/i18n/utils';
import { defaultCatchApiError } from '@/services/request';
import { syncToUrl } from '@/utils/global';
import { SettingOutlined } from '@ant-design/icons';
import {
  ActionType,
  BaseQueryFilterProps,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, TablePaginationConfig } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

export type SettingOptionType = {
  draggable?: boolean;
  checkable?: boolean;
  showListItemOption?: boolean;
  checkedReset?: boolean;
  listsHeight?: number;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  settingIcon?: React.ReactNode;
};

export type OptionsType =
  | ((e: React.MouseEvent<HTMLSpanElement>, action?: ActionType) => void)
  | boolean;

export type OptionConfig = {
  density?: boolean;
  fullScreen?: OptionsType;
  reload?: OptionsType;
  setting?: boolean | SettingOptionType;
  search?: boolean; //  (OptionSearchProps & { name?: string }) | boolean;
  reloadIcon?: React.ReactNode;
  densityIcon?: React.ReactNode;
};

export const proTableSearchConfig: BaseQueryFilterProps = {
  className: 'custom-table-search',
  labelWidth: 'auto',
  // span: {
  //   xs: 24,
  //   sm: 12,
  //   md: 8,
  //   lg: 8,
  //   xl: 6,
  //   xxl: 6,
  // },
  searchGutter: 24,
  defaultCollapsed: true,
};

export const proTableOptionsConfig: OptionConfig = {
  density: false,
  fullScreen: false,
  reload: false,
  setting: {
    settingIcon: (
      <Button>
        <SettingOutlined />
      </Button>
    ),
  },
};

export const proTablePaginationConfig: TablePaginationConfig = {
  defaultPageSize: 20,
  // showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
  // itemRender: customPaginationRender,
  showSizeChanger: true,
};

export const proTableColumnsConfig = <T extends Record<string, any>>(
  columns: ProColumns<T>[],
): ProColumns<T>[] => {
  const newColumns = columns.map((column: ProColumns<T>) => {
    if (
      (column.dataIndex === 'update_time' ||
        column.dataIndex === 'create_time') &&
      !column.render
    ) {
      return {
        align: 'center',
        search: !column.valueEnum && !column.valueType ? false : true,
        ...column,
        render: (_: ReactNode, record: T) =>
          dayjs(record[column.dataIndex as keyof T]).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
      };
    }
    return {
      align: 'center',
      search: !column.valueEnum && !column.valueType ? false : true,
      ...column,
    };
  });
  return newColumns as ProColumns<T>[];
};

export const proTableRequestAdapterParamsAndData = async (
  params: any & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },

  sorter: Record<string, SortOrder>,
  requestFn: (params: any) => any,
  //需要放在params的参数 一般默认是把分页和排序放在params里面 可传参自定义
  // paramsDefault = ['size', 'page', 'orderBy', 'orderType'],
): Promise<any> => {
  const formattedParams = {
    ...params,
    page: params.current,
    size: params.pageSize,
  };

  delete formattedParams.current;
  delete formattedParams.pageSize;

  if (sorter && Object.keys(sorter)) {
    Object.keys(sorter).forEach((key) => {
      formattedParams.orderBy = key;
      formattedParams.orderType = sorter[key] === 'ascend' ? 'asc' : 'desc';
    });
  }

  // const filterParams = pick(formattedParams, paramsDefault);
  // const filterBody = omit(formattedParams, paramsDefault);

  try {
    const resp = await requestFn(formattedParams);
    return {
      success: resp.code === 0,
      data: resp.data?.items || resp.data?.list,
      total: resp.data?.total,
    };
  } catch (error: unknown) {
    defaultCatchApiError(error);
  }
};

export const proTableFormConfig = {
  syncToUrl: (values: Record<string, any>) => syncToUrl(values),
  syncToInitialValues: false,
};

export const datePickerPresets = [
  {
    label: t('last-7-days'),
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: t('last-14-days'),
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: t('last-30-days'),
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
] as any;
