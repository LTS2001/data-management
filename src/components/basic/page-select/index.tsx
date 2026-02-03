import { PagedResult } from '@/services/types/comon';
import { Select, SelectProps, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { debounce, isNil, uniqBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface IPagedResultProps<Data>
  extends Omit<SelectProps, 'options' | 'onChange'> {
  /** 指定 获取数据接口 的主键字段名， 默认为"id"， 用于解决初始值对应的数据不在第一页的情况， 需要接口支持通过id查询 */
  idFieldName?: string;
  options: (dataList: Data[]) => DefaultOptionType[];
  /** 查询的字段名 */
  searchFieldName?: string;
  fetchApi: (params: {
    page?: number;
    size?: number;
  }) => Promise<PagedResult<Data>>;
  readonly pageSize?: number;
  /** 普通查询时的额外参数, 处于一些原因， 即便没有其他的参数， 也传一个空对象 */
  otherParams: object;
  /** 用id查询当前值时的额外参数 */
  otherParamsForSearchById?: object;
  refresh?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (
    value: any,
    option?: DefaultOptionType | DefaultOptionType[],
    record?: Data,
  ) => void;
  /** 当请求到的数据发生变化时触发 */
  onDataListChange?: (dataList: Data[]) => void;
}

type OnChangeNoRecord = (
  value: any,
  option?: DefaultOptionType | DefaultOptionType[],
) => void;

/** 适用于分页获取下拉框数据 */
const PagedSelect = <Data extends Record<string, unknown>>({
  idFieldName = 'id',
  searchFieldName = 'searchValue',
  fetchApi,
  pageSize = 20,
  options,
  otherParams,
  otherParamsForSearchById,
  onDataListChange,
  refresh,
  ...props
}: IPagedResultProps<Data>) => {
  const [isLoading, setIsLoading] = useState(false);
  // 以页数为key保存每一页的数据
  const [dataListMap, setDataListMap] = useState<Record<string, Data[]>>({});
  const [selectedDataList, setSelectedDataList] = useState<Data[]>([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>();
  const [prevOtherParams, setPrevOtherParams] = useState<object>();
  // 是否为最后一页
  const [isTheLastPage, setIsTheLastPage] = useState(false);

  // 平铺每一页数据
  const dataList = useMemo(() => {
    let allDataList: Data[] = [];
    Object.values(dataListMap).forEach((dataList) => {
      allDataList.push(...dataList);
    });
    allDataList = uniqBy(allDataList, idFieldName);
    // 找找分页请求到的数据中有无根据id查询到的数据， 如果没有就合并到最上面
    selectedDataList.forEach((item1) => {
      const item = allDataList.find(
        (item2) => item1[idFieldName] === item2[idFieldName],
      );
      if (!item) {
        allDataList.unshift(item1);
      }
    });
    onDataListChange?.(allDataList);
    return allDataList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataListMap, idFieldName]);

  const pagedFetch = useCallback(
    async ({
      page,
      otherParams,
      searchValue,
      afterFetch,
    }: {
      searchValue?: string;
      page: number;
      otherParams?: object;
      afterFetch?: () => void;
    }) => {
      if (isLoading) return;
      setIsLoading(true);
      const res = await fetchApi({
        page,
        size: pageSize,
        [searchFieldName]: searchValue,
        ...otherParams,
      });
      afterFetch?.();
      setTimeout(() => {
        if (res?.code === 0 && res.data?.items) {
          setDataListMap((dataListMap) => ({
            ...dataListMap,
            [page]: res.data?.items || [],
          }));
          setIsTheLastPage(res.data.total <= res.data.current * res.data.size);
        } else {
          setIsTheLastPage(true);
        }
      }, 10);
      setIsLoading(false);
    },
    [fetchApi, isLoading, pageSize, searchFieldName, refresh],
  );

  const onSearch = useMemo(() => {
    const debounceFetch = debounce((searchValue: string) => {
      pagedFetch({
        searchValue,
        page: 1,
        afterFetch: () => {
          setDataListMap({});
          setPage(1);
        },
        otherParams,
      });
    }, 500);
    return (searchValue: string) => {
      setSearchValue(searchValue);
      debounceFetch(searchValue);
    };
  }, [otherParams, pagedFetch]);

  const onPopupScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (isTheLastPage) return;
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      if (scrollHeight - scrollTop === clientHeight) {
        pagedFetch({
          page: page + 1,
          afterFetch: () => setPage(page + 1),
          otherParams,
          searchValue,
        });
      }
    },
    [isTheLastPage, pagedFetch, page, otherParams, searchValue],
  );

  const dropdownRender = useCallback<Required<SelectProps>['dropdownRender']>(
    (menu) => {
      return <Spin spinning={isLoading}>{menu}</Spin>;
    },
    [isLoading],
  );

  const onChange = useCallback<OnChangeNoRecord>(
    (value, options) => {
      const record = dataList.find((data) => data[idFieldName] === value);
      props.onChange?.(value, options, record);
    },
    [dataList, idFieldName, props],
  );

  // 请求当前值对应的数据， 用于解决初始值对应的数据不在第一页的情况
  useEffect(() => {
    if (isNil(props.value)) return;
    const values: (string | number)[] = [];
    const selectedData: Data[] = [];

    if (Array.isArray(props.value)) {
      values.push(...props.value);
    } else {
      values.push(props.value);
    }

    const fetchList = values.map((value) => {
      const exitsData = dataList.find((data) => data[idFieldName] === value);
      if (exitsData)
        return Promise.resolve({
          code: 0,
          data: { items: [exitsData] },
        } as PagedResult<Data>);
      return fetchApi({
        [idFieldName]: value,
        ...otherParamsForSearchById,
      });
    });

    Promise.allSettled(fetchList).then((resList) => {
      resList.forEach((res, index) => {
        if (res.status === 'rejected') return;
        const data = res.value;
        if (
          data?.code === 0 &&
          data.data?.items?.[0] &&
          data.data?.items?.[0][idFieldName] === values[index]
        ) {
          selectedData.push(data.data.items[0]);
        }
      });
      setSelectedDataList(selectedData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFieldName, props.value]);

  useEffect(() => {
    if (JSON.stringify(prevOtherParams) === JSON.stringify(otherParams)) return;

    pagedFetch({
      page: 1,
      otherParams,
      afterFetch: () => {
        setDataListMap({});
        setPage(1);
      },
    });
    setPrevOtherParams(otherParams);
  }, [pagedFetch, otherParams, prevOtherParams]);

  useEffect(() => {
    pagedFetch({
      page: 1,
      otherParams,
      afterFetch: () => {
        setDataListMap({});
        setPage(1);
      },
    });
  }, [refresh]);

  return (
    <Select
      optionLabelProp="label"
      {...props}
      onChange={onChange}
      options={options(dataList)}
      showSearch={{
        searchValue,
        onSearch: props.showSearch ? onSearch : undefined,
      }}
      popupRender={dropdownRender}
      loading={isLoading}
      onPopupScroll={onPopupScroll}
    />
  );
};

export default PagedSelect;
