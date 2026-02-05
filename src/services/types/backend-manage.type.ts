// Response interface

import { EAccountStatus, EUserRole } from '@/config/enum';

export interface ISaveAdminRes {
  data: boolean;
} // Parameter interface

export interface ISaveAdminParams {
  /* */
  account?: string;

  /* */
  department?: string;

  /* */
  id?: number;

  /* */
  password?: string;

  /* */
  proStatus?: EAccountStatus;

  /* */
  roleCode?: string;

  /* */
  roleId?: EUserRole;

  /* */
  username?: string;
} // Response interface

export interface IListOperationsRes {
  /* */
  account: string;

  /* */
  department: string;

  /* */
  id: number;

  /* */
  password: string;

  /* */
  proStatus: EAccountStatus;

  /* */
  roleCode: string;

  /* */
  roleName: string;

  roleId: EUserRole;
  /* */
  username: string;
  departmentId: number;
} // Parameter interface

export interface ISaveOperationParams {
  /* */
  account?: string;

  /* */
  department?: string;

  /* */
  id?: number;

  /* */
  password?: string;

  /* */
  proStatus?: number;

  /* */
  roleCode?: string;

  /* */
  roleName?: string;

  /* */
  username?: string;
} // Response interface

export interface ISaveOperationRes {
  /* */
  code: number;

  /* */
  data: boolean;

  /* */
  enMsg: string;

  /* */
  msg: string;
}
// Response interface

export interface IListDepartmentRes {
  /* */
  departmentId: number;

  /* */
  name: string;
}
