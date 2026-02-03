import { t } from '@/i18n/utils';
import { message } from 'antd';

export function syncToUrl(obj: Record<string, any>): Record<string, any> {
  // 创建一个新的对象以避免修改原始对象
  const result = { ...obj };

  // 遍历对象的每个属性
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];

      // 检查值是否为数字型字符串
      if (typeof value === 'string' && !isNaN(Number(value))) {
        result[key] = Number(value); // 转换为数字
      }
      // 如果属性是数组，遍历数组并转换每一项
      else if (Array.isArray(value)) {
        result[key] = value.map((item) => {
          // 检查数组项是否为数字型字符串
          if (typeof item === 'string' && !isNaN(Number(item))) {
            return Number(item); // 转换为数字
          }
          return item; // 保持原值
        });
      }
    }
  }
  return result;
}

// 定义复制文本到剪贴板的函数
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      message.success(t('copy-success'));
    },
    (err) => {
      message.error(t('copy-error') + err);
    },
  );
};
