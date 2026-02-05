import { getAiAnalysis } from '@/services/data-market.service';
import { ApiResult } from '@/services/types/comon';
import { Chart } from '@ant-design/plots';
import { useRequest } from '@umijs/max';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// #region 图表 resize 方法
// (PS：antd自家的图表不能自动根据layout的展开收起resize, 很奇怪, 不知道有没有更好的方式)
/** 图表实例：容器会随布局变化，需在 resize 时调用 triggerResize 让画布同步 */
type ChartInstanceWithResize = {
  container?: HTMLElement;
  triggerResize?: () => void;
};

/** 返回 onReady：对图表自带的 container 做 ResizeObserver，resize 时调用 triggerResize()，多个图表共用一个 onReady 即可 */
export function useChartResizeOnReady() {
  const cleanupsRef = useRef<Array<() => void>>([]);

  useEffect(
    () => () => {
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    },
    [],
  );

  return useCallback((chart: ChartInstanceWithResize | Chart) => {
    const el = chart?.container;
    if (!el || typeof chart?.triggerResize !== 'function') return;
    const ro = new ResizeObserver(() => {
      chart.triggerResize?.();
    });
    ro.observe(el);
    const cleanup = () => {
      ro.disconnect();
      cleanupsRef.current = cleanupsRef.current.filter((f) => f !== cleanup);
    };
    cleanupsRef.current.push(cleanup);
  }, []);
}
// #endregion

// #region ai 分析展示相关数据状态

export type AiCardStatus = 'loading' | 'success' | 'error';

/** 可复用的 AI 分析请求：传入 type（如 'interaction'）与请求参数，只请求一次并缓存 */
export function useGetAiAnalysis<TData = unknown>(type: string) {
  const hasFetchedRef = useRef(false);
  const [data, setData] = useState<TData | null>(null);

  const { loading, run } = useRequest(
    (params: object) => getAiAnalysis(type, params),
    {
      manual: true,
      onSuccess: (result: TData) => {
        setData(result);
        hasFetchedRef.current = true;
      },
    },
  );

  const runOnce = useCallback(
    async (params?: object) => {
      if (hasFetchedRef.current && data) return data;
      if (!params) return null;
      return run(params) as Promise<TData | null>;
    },
    [run, data],
  );

  return { data, loading, run: runOnce };
}

/** 可复用的多卡片 AI 分析：同一实例内同一请求只发一次，多卡片同时点击共享该请求，返回后所有已点击卡片同时展示 */
export function useAiCards<
  TData = unknown, // 第一个泛型：手动指定返回数据类型（必传/可选）
  TParams extends object = object, // 第二个泛型：自动推导参数类型，无需手动传
>(
  type: string,
  params: TParams | undefined, // TParams 从这个参数自动推导
) {
  const [data, setData] = useState<TData | null>(null);
  const [cardStatus, setCardStatus] = useState<Record<number, AiCardStatus>>(
    {},
  );
  /** 当前进行中的请求 Promise，同一实例内复用，不重复请求 */
  const inFlightPromiseRef = useRef<Promise<unknown> | null>(null);
  /** 正在等待该次请求结果的卡片 level 集合，请求返回后一并更新为 success/error */
  const pendingLevelsRef = useRef<Set<number>>(new Set());

  const triggerRequest = useCallback(
    (level: number) => {
      const setStatus = (status: AiCardStatus) =>
        setCardStatus((prev) => ({ ...prev, [level]: status }));

      if (!params) {
        setStatus('error');
        return;
      }

      if (data !== null && data !== undefined) {
        setStatus('success');
        return;
      }

      flushSync(() => {
        setCardStatus((prev) => ({ ...prev, [level]: 'loading' }));
      });
      pendingLevelsRef.current.add(level);

      if (inFlightPromiseRef.current) {
        return;
      }

      const promise = (getAiAnalysis(type, params) as Promise<ApiResult<TData>>)
        .then((result) => {
          const value = result?.data ?? null;
          setData(value as TData | null);
          const levels = new Set(pendingLevelsRef.current);
          pendingLevelsRef.current = new Set();
          inFlightPromiseRef.current = null;
          setCardStatus((prev) => {
            const next = { ...prev };
            levels.forEach((l) => {
              next[l] = 'success';
            });
            return next;
          });
        })
        .catch(() => {
          const levels = new Set(pendingLevelsRef.current);
          pendingLevelsRef.current = new Set();
          inFlightPromiseRef.current = null;
          setCardStatus((prev) => {
            const next = { ...prev };
            levels.forEach((l) => {
              next[l] = 'error';
            });
            return next;
          });
        });

      inFlightPromiseRef.current = promise;
    },
    [type, params, data],
  );

  const loading = Object.values(cardStatus).some((s) => s === 'loading');

  return {
    aiData: data,
    loading,
    cardStatus,
    triggerRequest,
  };
}

// #endregion
