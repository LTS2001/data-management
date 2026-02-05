import { t } from '@/i18n/utils';

export const SYSTEM_NAME = 'Data Management';

export const SYSTEM_LOGO = 'https://img.icons8.com/?id=dS6PrGTXw1xj&format=png';

// 建议使用DefaultAvatar组件
// export const DEFAULT_AVATAR =
//   'https://www.icartea.com/images/default-avatar.png';

export const DATA_MANAGE_TOKEN_KEY = 'cartea-admin-token';

export const USER_INFO_KEY = 'user_info';

export const COUNTRY_OPTIONS = [
  { label: 'UAE', value: 'uae' },
  { label: 'KSA', value: 'ksa' },
  { label: 'Qatar', value: 'qatar' },
  { label: 'Bahrain', value: 'bahrain' },
  { label: 'Oman', value: 'oman' },
  { label: 'Kuwait', value: 'kuwait' },
  { label: 'Egypt', value: 'egypt' },
];
//新增一个颜色集合,用于批量推理状态展示
export const colorsList2 = ['#202b38', '#fdba74', '#d9f99d', '#dc362e'];

export const colorsList = [
  '#fb7185',
  '#fdba74',
  '#d9f99d',
  '#a7f3d0',
  '#a5f3fc',
  '#a5b4fc',
];

export const DEPARTMENTS = [
  t('department-content-growth'),
  t('department-car-trade'),
  t('department-car-service'),
  t('department-ml-platform'),
  t('department-cartea'),
];
