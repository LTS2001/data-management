import { EUserRole } from '@/config/enum';
import request from './request';
import {
  IListDepartmentRes,
  IListOperationsRes,
  ISaveAdminParams,
  ISaveAdminRes,
  ISaveOperationParams,
  ISaveOperationRes,
} from './types/backend-manage.type';
import { ApiResult, PagedResult } from './types/comon';
import { IListAdminsRes } from './types/user-manage.type';

/**
 * 管理后台列表 - 超级管理员可见
 * @param {string} name name
 * @param {string} page page
 * @param {string} size size
 * @returns
 */
export function listAdmins(params: {
  userName: string;
  page: number;
  size: number;
  roleId: EUserRole;
}): Promise<PagedResult<IListAdminsRes>> {
  return request.get(`/cartea-api/admin/pro/admin/list`, {
    params,
  });
}

/**
 * 添加-修改-删除管理员 - 超级管理员
 * @param {object} params dto
 * @param {string} params.account
 * @param {string} params.department
 * @param {number} params.id
 * @param {string} params.password
 * @param {number} params.proStatus
 * @param {string} params.roleCode
 * @param {string} params.roleName
 * @param {string} params.username
 * @returns
 */
export function saveAdmin(
  params: ISaveAdminParams,
): Promise<ApiResult<ISaveAdminRes>> {
  return request.post(`/cartea-api/admin/pro/admin/save`, params);
}

/**
 * 运营后台列表 - 超级管理员、管理员、运营可见
 * @param {string} page page
 * @param {string} size size
 * @param {string} username username
 * @returns
 */
export function listOperations(params: {
  page: number;
  size: number;
  username: string;
}): Promise<PagedResult<IListOperationsRes>> {
  return request.get(`/cartea-api/admin/pro/operation/list`, {
    params,
  });
}

/**
 * 添加-修改-删除用户 - 管理员
 * @param {object} params dto
 * @param {string} params.account
 * @param {string} params.department
 * @param {number} params.id
 * @param {string} params.password
 * @param {number} params.proStatus
 * @param {string} params.roleCode
 * @param {string} params.roleName
 * @param {string} params.username
 * @returns
 */
export function saveOperation(
  params: ISaveOperationParams,
): Promise<ISaveOperationRes> {
  return request.post(`/cartea-api/admin/pro/operation/save`, params);
}

/**
 * 部门列表
 * @returns
 */
export function listDepartment(): Promise<ApiResult<IListDepartmentRes[]>> {
  return request.get(`/cartea-api/admin/pro/admin/department`);
}
