import { IS_MICRO_APP } from '@/config';
import { useEffect, useState } from 'react';

export const useGlobalState = (actions: MicroAppStateActions | undefined) => {
  const [gloableState, setGloableState] = useState<IGlobalState | null>(null);

  useEffect(() => {
    if (!actions || !IS_MICRO_APP) return;
    try {
      actions?.onGlobalStateChange((state, prevState) => {
        // state: 变更后的状态; prevState: 变更前的状态
        console.log('children改变前的值为 ', prevState);
        console.log('children观察者的值为 ', state);
        setGloableState(state as IGlobalState);
      });
    } catch (error) {
      console.error('监听全局状态异常:', error);
    }
  }, []);

  const updateGloableState = (state: IGlobalState) => {
    try {
      actions?.setGlobalState(state);
      console.log('更新全局状态成功');
    } catch (error) {
      console.error('更新全局状态异常:', error);
    }
  };
  return { gloableState, updateGloableState };
};
