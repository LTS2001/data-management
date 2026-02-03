# Cartea Data Management 项目

基于 `@umijs/max` 构建的数据管理平台，提供首页概览、用户管理、后台管理与登录能力。

## 页面概览

- 首页（Dashboard）：数据与资产概览页面 [index.tsx](file:///Users/welt/Documents/code/cartea-data-management/src/pages/dashboard/index.tsx)
- 用户管理：用户相关管理入口 [index.tsx](file:///Users/welt/Documents/code/cartea-data-management/src/pages/user-manage/index.tsx)
- 后台管理：系统与后台配置入口 [index.tsx](file:///Users/welt/Documents/code/cartea-data-management/src/pages/backend-manage/index.tsx)
- 登录：邮箱+密码登录与注册 [index.tsx](file:///Users/welt/Documents/code/cartea-data-management/src/pages/login/index.tsx)
- 404：未匹配路由的兜底页 [index.tsx](file:///Users/welt/Documents/code/cartea-data-management/src/pages/404/index.tsx)

## 路由

- 路由配置集中在 [routes/index.ts](file:///Users/welt/Documents/code/cartea-data-management/src/routes/index.ts)
- 入口配置在 [.umirc.ts](file:///Users/welt/Documents/code/cartea-data-management/.umirc.ts) 中引入 routes，并关闭内置菜单
- 路由映射
  - / → 重定向到 /home
  - /home → 首页 Dashboard
  - /user-manage → 用户管理
  - /backend-manage → 后台管理
  - /login → 登录页（不使用布局）
  - - → 404（不使用布局）

## 技术栈

- **UI 组件**：Ant Design、Ant Design X
- **状态管理**：React Hooks
- **国际化**：i18next
- **构建工具**：UmiJS Max
- **类型检查**：TypeScript

## 项目结构

```
src/
├── assets/               # 静态资源
├── components/           # 公共组件
├── config/               # 配置与常量
├── hooks/                # 自定义 Hooks
├── i18n/                 # 国际化资源与初始化
├── pages/                # 页面
│   ├── 404/              # 404 页面
│   ├── backend-manage/   # 后台管理
│   ├── dashboard/        # 首页概览
│   ├── login/            # 登录与注册
│   └── user-manage/      # 用户管理
├── routes/               # Umi 路由配置
├── services/             # API 服务与类型
├── styles/               # 全局样式
└── utils/                # 工具函数
```

## 使用说明

- 登录
  - 支持登录与注册 Tab 切换，邮箱与密码校验
  - 登录成功后跳转 /home，Token 写入 Cookie 与 localStorage（键：ai_labs_token）
- 首页
  - 显示“用户资产概览”标题，预留数据模块栅格
- 用户管理 / 后台管理
  - 采用统一布局与标题，预留功能区块

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 运行生产版本

```bash
pnpm start
```

## 更多信息

- 系统常量：名称、Logo、Token Key 等 [constant.ts](/src/config/constant.ts)
- 环境变量与 API 基址 [env.ts](/src/config/env.ts)
- 国际化初始化与语言存储键 [i18n/index.tsx](/src/i18n/index.tsx)
- 请求封装与错误处理 [services/request.ts](/src/services/request.ts)
- 路由配置与入口 [routes/index.ts](/src/routes/index.ts)
- more .cursor/rules/projects/common-rules.mdc
