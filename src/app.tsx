// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';
import AvatarDropdown from './components/business/avatar-dropdown';
import LanguageSelect from './components/tracker/language-select';
import MyConfigProvider from './components/tracker/my-config-provider';
import { IS_MICRO_APP, SYSTEM_LOGO, SYSTEM_NAME } from './config';
import { t, TxKeyPath } from './i18n/utils';
import { IUserInfo } from './services/types/user.type';
import './styles/globals.css';
import { checkLogin } from './utils/auth';

export interface IInitialState {
  name: string;
  userInfo?: IUserInfo;
  token?: string;
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<IInitialState> {
  const loginRes = await checkLogin();
  return { name: SYSTEM_NAME, ...loginRes };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: SYSTEM_LOGO,

    menu: {
      locale: false,
      autoClose: false,
      defaultOpenAll: true,
    },

    menuDataRender: (menuData) => {
      // 递归处理菜单数据，包括子路由
      const translateMenu = (items: any[]): any[] => {
        return items.map((item) => {
          const translatedItem = {
            ...item,
            name: t((item.name || '') as TxKeyPath),
          };
          // 如果有子路由，递归处理
          if (item.routes && item.routes.length > 0) {
            translatedItem.routes = translateMenu(item.routes);
          }
          if (item.children && item.children.length > 0) {
            translatedItem.children = translateMenu(item.children);
          }
          return translatedItem;
        });
      };
      return translateMenu(menuData);
    },

    menuRender: (_, defaultDom) => (IS_MICRO_APP ? null : defaultDom),
    menuFooterRender: () => (
      <div className="flex justify-between items-center">
        <AvatarDropdown />

        <div className="w-12 h-9 flex justify-center cursor-pointer">
          <LanguageSelect />
        </div>
      </div>
    ),
    // actionsRender: (props) => {
    //   return <DashboardOutlined style={{ color: 'black' }} />;
    // },
    // menuHeaderRender: (logo, title, props) => {
    // },
    // avatarProps: {
    //   title: 'AI Labs',
    //   render: () => <DashboardOutlined style={{ color: 'black' }} />,
    // },
  };
};

// 新增：根组件包裹（Umi 4+ 支持 export rootContainer）
export function rootContainer(container: React.ReactNode) {
  return <MyConfigProvider>{container}</MyConfigProvider>;
}

// 乾坤微前端
export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props: any) {
    console.log('app1 mount', props);
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('app1 unmount', props);
  },
};
