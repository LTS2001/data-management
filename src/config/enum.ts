export enum EUserRole {
  /** 超级管理员 */
  SuperAdmin = 1,
  /** 管理员 */
  Admin = 2,
  /** 运营 */
  Ops = 3,
}

export enum EChannelInterest {
  /*NEWS 1, NEW_CAR 2, USED_CAR 3, SERVICE 4, TOPIC 5, OTHER 6, CAR_PRICE_INQUIRY 7, CAR_MODEL_COMPARISON 8, CAR_DETAILS 9 */
  News = 1,
  NewCar = 2,
  UsedCar = 3,
  Service = 4,
  Topic = 5,
  Other = 6,
  CarPriceInquiry = 7,
  CarModelComparison = 8,
  CarDetails = 9,
}

export enum EAccountStatus {
  /** 启用 */
  Enable = 1,
  /** 停用 */
  Disable = 0,
  /** 删除 */
  Delete = -1,
}
