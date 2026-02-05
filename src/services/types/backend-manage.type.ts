// Response interface

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
  proStatus?: number;

  /* */
  roleCode?: string;

  /* */
  roleName?: string;

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
  proStatus: number;

  /* */
  roleCode: string;

  /* */
  roleName: string;

  /* */
  username: string;
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
