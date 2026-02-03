import { IInitialState } from './app';

export default (initialState: IInitialState) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  // const canSeeLogined = !!(initialState && initialState.token);
  return {
    canSeeLogined: initialState.token ? true : false,
    // canSeeAdmin,
  };
};
