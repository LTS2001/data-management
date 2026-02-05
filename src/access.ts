import { IInitialState } from './app';
import { EUserRole } from './config/enum';

export default (initialState: IInitialState) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  // const canSeeLogined = !!(initialState && initialState.token);
  console.log(initialState.userInfo?.accessControl);
  return {
    role: initialState.userInfo?.admin.roleId || EUserRole.Ops,
    canSeeLogined: initialState.token ? true : false,
    canSeeAdminRoute: initialState.userInfo?.accessControl.allowPermPortal,
    canSeeAdminTab: initialState.userInfo?.accessControl.allowAdminPortal,
  };
};
