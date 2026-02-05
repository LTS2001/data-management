import { EChannelInterest } from '@/config/enum';

export interface IExportCUsersInfoParams {
  userIds?: string[];
} // Response interface

export interface IListCUserOptionRes {
  channels: string[];
  countries: string[];
  interests: EChannelInterest[];
}
export interface IListCUsersParams {
  channels: string[];
  countries: string[];
  interests: string[];
  page: number;
  size: number;
} // Response interface

export interface IRevealCUserInfoRes {
  /* */
  code: number;

  /* */
  enMsg: string;

  /* */
  msg: string;
} // Response interface

export interface IListAdminsRes {
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
} // Response interface

export interface IListCUsersRes {
  /*登录后回填 */
  carteaUserId: number;
  /* google给的id 1576401700.1762327584*/
  cuserId: number;
  /*NEWS 1, NEW_CAR 2, USED_CAR 3, SERVICE 4, TOPIC 5, OTHER 6, CAR_PRICE_INQUIRY 7, CAR_MODEL_COMPARISON 8, CAR_DETAILS 9 */
  channelInterest: EChannelInterest;

  /* */
  country: string;

  /*创建时间 */
  createTime: Record<string, unknown>;

  /*iPhone 17... */
  deviceModel: string;

  /*iOS, Android */
  deviceOs: string;

  /* */
  email: string;

  /*H5, PC, APP */
  firstVisitPort: string;

  /* */
  firstVisitTime: string;

  /* */
  id: number;

  /*NEWS, NEW_CAR, USED_CAR, SERVICE, TOPIC, OTHER */
  moduleTagCount: string;

  /*明文存储，展示时脱敏 */
  phoneNumber: string;

  /* */
  region: string;

  /* */
  registerTime: string;
  username?: string;
  /*Google Ads, WhatsApp... */
  sourceChannel: string;

  /*更新时间 */
  updateTime: Record<string, unknown>;

  /*用户访问唯一标识 */
  userPseudoId: string;
}
export enum ERevealCUserInfo {
  PHONE = 1,
  EMAIL = 2,
}
