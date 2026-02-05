/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param {string} icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

import { IConfigFromPlugins } from '@/.umi/core/pluginConfig';

const routes: IConfigFromPlugins['routes'] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    component: './login',
    name: '登录',
    layout: false,
  },
  {
    name: 'dashboard',
    path: '/home',
    component: './dashboard',
    icon: 'BarChartOutlined',
  },
  {
    name: 'user-manage',
    path: '/user-manage',
    component: './user-manage',
    icon: 'UserOutlined',
  },
  {
    name: 'backend-manage',
    path: '/backend-manage',
    component: './backend-manage',
    icon: 'SettingOutlined',
    access: 'canSeeAdminRoute',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },

  // {
  //   name: 'overview',
  //   path: '/home',
  //   component: './overview',
  //   icon: 'DashboardOutlined',
  // },
  // {
  //   name: 'conversation-list',
  //   path: '/conversation-list',
  //   component: './conversation-list',
  //   icon: 'MessageOutlined',
  // },
  // {
  //   name: 'message',
  //   path: '/message',
  //   component: './message',
  //   icon: 'MessageOutlined',
  //   routes: [
  //     {
  //       name: 'ai-evaluation',
  //       path: '/message/ai-evaluation',
  //       component: './message',
  //       icon: 'MessageOutlined',
  //     },
  //   ],
  // },

  // {
  //   name: 'users',
  //   path: '/user-manage',
  //   component: './user-manage/layout',
  //   icon: 'UserOutlined',
  //   routes: [
  //     {
  //       name: 'user-overview',
  //       path: '/user-manage/user-overview',
  //       component: './user-manage',
  //     },
  //     {
  //       name: 'user-list',
  //       path: '/user-manage/user-list',
  //       component: './user-manage/user-list',
  //     },
  //   ],
  // },
  // {
  //   name: 'modal',
  //   path: '/modal-inference',
  //   component: './modal-inference/layout',
  //   icon: 'MergeOutlined',
  //   routes: [
  //     {
  //       name: 'experiment',
  //       path: '/modal-inference/online-inference',
  //       component: './modal-inference/online-inference',
  //     },
  //     {
  //       name: 'batch-infer-detail',
  //       path: '/modal-inference/batch-infer/:id',
  //       component: './modal-inference/batch-infer/detail',
  //       hideInMenu: true,
  //     },
  //     {
  //       name: 'batch-infer',
  //       path: '/modal-inference/batch-infer',
  //       component: './modal-inference/batch-infer',
  //     },
  //   ],
  // },
  // {
  //   name: 'prompt',
  //   path: '/prompt-laboratory',
  //   component: './prompt-laboratory/layout',
  //   icon: 'ExperimentOutlined',
  //   routes: [
  // {
  //   name: 'Prompt-Polit',
  //   path: '/prompt-laboratory/prompt-polit',
  //   component: './prompt-laboratory/prompt-polit',
  //   icon: 'ExperimentOutlined',
  // },
  //   ],
  // },

  // {
  //   name: 'data-management',
  //   path: '/data-management',
  //   component: './data-management/layout',
  //   icon: 'FundOutlined',
  //   routes: [
  // {
  //   name: 'dateset',
  //   path: '/data-management/dataset',
  //   component: './data-management/dataset',
  //   icon: 'FundOutlined',
  // },
  // {
  //   name: 'dataset-detail',
  //   path: '/data-management/dataset/:id',
  //   component: './data-management/dataset/detail',
  //   hideInMenu: true,
  // },
  // {
  //   name: 'Tools',
  //   path: '/tools',
  //   component: './tools',
  //   icon: 'Tool',
  // },
  //   ],
  // },

  // {
  //   name: 'conversation-list',
  //   path: '/conversation-list',
  //   component: './conversation-list',
  //   icon: 'MessageOutlined',
  // },
];

export default routes;
