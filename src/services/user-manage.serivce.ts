// C端用户管理服务
import request from './request';
import { ApiResult, PagedResult } from './types/comon';
import {
  ERevealCUserInfo,
  IExportCUsersInfoParams,
  IExportCUsersInfoRes,
  IListCUserOptionRes,
  IListCUsersParams,
  IListCUsersRes,
  IRevealCUserInfoRes,
} from './types/user-manage.type';

/**
 * 导出C端用户
 * @param {object} params cUserExportReq
 * @param {array} params.userIds
 * @returns
 */
export function exportCUsersInfo(
  params: IExportCUsersInfoParams,
): Promise<ApiResult<IExportCUsersInfoRes>> {
  return request.get(`/cartea-api/admin/pro/cuser/export`, { params });
}

/**
 * C端用户列表
 * @param {string} channels channels
 * @param {string} countries countries
 * @param {string} interests interests
 * @param {string} page page
 * @param {string} size size
 * @returns
 */
export function listCUsers(
  params: IListCUsersParams,
): Promise<PagedResult<IListCUsersRes>> {
  return request.get(`/cartea-api/admin/pro/cuser/list`, {
    params,
  });
}

/**
 * C端用户列表选项
 * @returns
 */
export function listCUserOption(): Promise<ApiResult<IListCUserOptionRes>> {
  return request.get(`/cartea-api/admin/pro/cuser/option`);
}

/**
 * 查看C端用户信息LOG
 * @param {string} type 操作类型 (PHONE 1 | EMAIL 2)
 * @returns
 */
export function revealCUserInfo(
  type: ERevealCUserInfo,
): Promise<IRevealCUserInfoRes> {
  return request.get(`/cartea-api/admin/pro/cuser/reveal`, {
    params: { type },
  });
}
