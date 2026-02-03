import { getConcatTags, getContactAnalysis } from '@/services/concat.service';
import {
  IConcatTagRes,
  IContactAnalysisRes,
} from '@/services/types/concat.type';
import { useRequest } from '@umijs/max';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

export const useGetConcatTags = () => {
  const tagListRef = useRef<{ value: number; label: string }[]>([]);
  useRequest(
    () => {
      return getConcatTags();
    },
    {
      onSuccess: (result) => {
        tagListRef.current =
          result?.map((item: IConcatTagRes) => ({
            value: item.id,
            label: item.name,
          })) || [];
      },
      refreshDeps: [],
    },
  );
  return tagListRef.current;
};

export interface IContactAnalysisData {
  data7d: IContactAnalysisRes | null;
  data15d: IContactAnalysisRes | null;
}

export const defaultData: IContactAnalysisData = {
  data7d: null,
  data15d: null,
};

/**
 * 获取联系人分析数据的 Hook
 * 支持7天和15天的数据切换，并缓存数据避免重复请求
 */
export const useGetContactAnalysisData = () => {
  const [data, setData] = useState<IContactAnalysisData>(defaultData);
  const [loading, setLoading] = useState(false);
  // 使用 ref 跟踪请求状态，避免重复请求
  const fetching7dRef = useRef(false);
  const fetching15dRef = useRef(false);
  const fetched7dRef = useRef(false);
  const fetched15dRef = useRef(false);

  // 计算日期范围
  const getDateRange = (days: number) => {
    const end = dayjs().format('YYYY-MM-DD');
    const start = dayjs()
      .subtract(days - 1, 'day')
      .format('YYYY-MM-DD');
    return { start, end };
  };

  // 获取7天数据
  const fetch7dData = async () => {
    // 如果已有数据或正在请求，则不重复请求
    if (fetched7dRef.current || fetching7dRef.current) return;

    try {
      fetching7dRef.current = true;
      setLoading(true);
      const { start, end } = getDateRange(7);
      const result = await getContactAnalysis({ start, end });
      if (result?.data) {
        setData((prev) => ({
          ...prev,
          data7d: result.data,
        }));
        fetched7dRef.current = true;
      }
    } catch (error) {
      console.error('获取7天数据失败:', error);
    } finally {
      fetching7dRef.current = false;
      setLoading(false);
    }
  };

  // 获取15天数据
  const fetch15dData = async () => {
    // 如果已有数据或正在请求，则不重复请求
    if (fetched15dRef.current || fetching15dRef.current) return;

    try {
      fetching15dRef.current = true;
      setLoading(true);
      const { start, end } = getDateRange(15);
      const result = await getContactAnalysis({ start, end });
      if (result?.data) {
        setData((prev) => ({
          ...prev,
          data15d: result.data,
        }));
        fetched15dRef.current = true;
      }
    } catch (error) {
      console.error('获取15天数据失败:', error);
    } finally {
      fetching15dRef.current = false;
      setLoading(false);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetch7dData();
    fetch15dData();
  }, []);

  return {
    data,
    loading,
    // 提供手动刷新方法（可选）
    refresh: () => {
      // 重置请求状态
      fetched7dRef.current = false;
      fetched15dRef.current = false;
      setData(defaultData); // 清空缓存
      fetch7dData();
      fetch15dData();
    },
  };
};
