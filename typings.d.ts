import { ProColumns } from '@ant-design/pro-components';
import '@umijs/max/typings';

declare global {
  interface Window {
    test: string;
  }
  interface IGlobalState {
    platform?: string;
  }
  type OnGlobalStateChangeCallback = (
    state: Record<string, any>,
    prevState: Record<string, any>,
  ) => void;

  type MicroAppStateActions = {
    onGlobalStateChange: (
      callback: OnGlobalStateChangeCallback,
      fireImmediately?: boolean,
    ) => void;
    setGlobalState: (state: Record<string, any>) => boolean;
    offGlobalStateChange: () => boolean;
  };
  type ProColumnsTipKey<T = unknown, ValueType = 'text'> = Omit<
    ProColumns<T, ValueType>,
    'dataIndex' | 'key'
  > & {
    // eslint-disable-next-line @typescript-eslint/ban-types
    dataIndex?: keyof T | (string & {});
    // eslint-disable-next-line @typescript-eslint/ban-types
    key?: keyof T | (string & {});
    /** 使 dataIndex 和 key 能提示 row 的 key */
  };
}

export {};
