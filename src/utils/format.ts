import { t } from '@/i18n/utils';
import dayjs from 'dayjs';

// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * 格式化时间：一天内显示时分，超过一天显示日期
 * @param timeString 时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';

  const messageTime = dayjs(timeString);
  const now = dayjs();

  // 判断是否是今天
  if (messageTime.isSame(now, 'day')) {
    return messageTime.format('HH:mm');
  }

  // 判断是否是昨天
  if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
    return t('yesterday');
  }

  // 判断是否是本周
  if (messageTime.isSame(now, 'week')) {
    const weekdays = [
      t('sunday'),
      t('monday'),
      t('tuesday'),
      t('wednesday'),
      t('thursday'),
      t('friday'),
      t('saturday'),
    ];
    return weekdays[messageTime.day()];
  }

  // 判断是否是本年
  if (messageTime.isSame(now, 'year')) {
    return messageTime.format('MM-DD');
  }

  // 其他情况显示完整日期
  return messageTime.format('YYYY-MM-DD');
};

export function removeEmptyValues<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== '' &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

/**
 * 手机号脱敏 保留前3位和后4位，中间用*代替
 * @param phone
 * @returns
 */
export const maskPhone = (phone?: string) => {
  if (!phone) return '/';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length <= 7) return cleaned;
  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-4);
  const middle = '*'.repeat(cleaned.length - 7);
  return `${prefix}${middle}${suffix}`;
};

/**
 * 邮箱脱敏 保留前3位和@后的域名，中间用***代替
 * @param email
 * @returns
 */
export const maskEmail = (email?: string) => {
  if (!email) return '/';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visibleLocal = local.slice(0, 3);
  return `${visibleLocal}***@${domain}`;
};

export const formatDateYYMMDD = (value?: unknown) => {
  if (!value) return '-';
  return dayjs(value as string).isValid()
    ? dayjs(value as string).format('YYYY-MM-DD')
    : '-';
};
