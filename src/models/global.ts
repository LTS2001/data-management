// 全局共享数据示例
import { SYSTEM_NAME } from '@/config';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(SYSTEM_NAME);
  return {
    name,
    setName,
  };
};

export default useUser;
