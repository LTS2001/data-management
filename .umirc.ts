import { defineConfig } from '@umijs/max';
import routes from './src/routes';

export default defineConfig({
  antd: {
    // configProvider: {}, // 全局antd配置
  },
  esbuildMinifyIIFE: true, // 解决 esbuild helpers 冲突问题
  // locale: {
  //   // 默认使用 src/locales/zh-CN.ts 作为多语言文件
  //   default: 'zh-CN',
  //   baseSeparator: '-',
  // },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Data Management',
    menu: false,
  },
  qiankun: {
    slave: {},
    master: {},
  },
  links: [
    {
      rel: 'icon',
      type: 'image/png',
      href: 'https://img.icons8.com/?id=dS6PrGTXw1xj&format=png',
    },
  ],
  routes,
  npmClient: 'pnpm',
  tailwindcss: {},
});
