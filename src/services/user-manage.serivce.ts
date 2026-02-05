// C端用户管理服务
import request from './request';
import { ApiResult, PagedResult } from './types/comon';
import {
  ERevealCUserInfo,
  IExportCUsersInfoParams,
  IListCUserOptionRes,
  IListCUsersParams,
  IListCUsersRes,
  IRevealCUserInfoRes,
} from './types/user-manage.type';

/**
 * 导出C端用户
 * @description 触发浏览器下载 Excel 文件，返回 Blob 数据
 * @param {object} params cUserExportReq
 * @param {array} params.userIds
 * @returns
 */
export function exportCUsersInfo(
  params: IExportCUsersInfoParams,
): Promise<Blob> {
  return request.post(`/cartea-api/admin/pro/cuser/export`, params, {
    responseType: 'blob',
  });
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
    headers: {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
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
  cUserId: string,
): Promise<IRevealCUserInfoRes> {
  return request.get(`/cartea-api/admin/pro/cuser/reveal`, {
    params: {
      type,
      cUserId: cUserId,
    },
  });
}
