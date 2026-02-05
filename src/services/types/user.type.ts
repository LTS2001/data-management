import { EUserRole } from '@/config/enum';

export interface ILoginParams {
  account: string;
  password: string;
}

export interface ILoginRes {
  data: string;
  // token_type: string;
}

export interface IRegisterParams {
  email: string;
  name: string;
  avatar_url: string;
  password: string;
}

export type IRegisterRes = ILoginRes;

export interface IUserInfo {
  accessControl: {
    /** 是否显示【管理后台】Tab */
    allowAdminPortal: boolean;

    /** 是否显示【运营后台】Tab */
    allowOpsPortal: boolean;

    /** 是否显示【后台权限管理】Tab */
    allowPermPortal: boolean;
  };

  /* */
  admin: {
    /* */
    account: string;

    /*部门 */
    department: string;

    /* */
    id: number;

    /* */
    password: string;

    /* */
    proStatus: number;

    /* */
    roleId: EUserRole;

    /* */
    status: number;

    /* */
    username: string;
  };
}
