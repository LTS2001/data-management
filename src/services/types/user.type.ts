export interface ILoginParams {
  email: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
}

export interface ILoginRes {
  access_token: string;
  token_type: string;
}

export interface IRegisterParams {
  email: string;
  name: string;
  avatar_url: string;
  password: string;
}

export type IRegisterRes = ILoginRes;

export interface IUserInfo {
  email: string;
  name: string;
  avatar_url: string;
  id: number;
  create_time: string;
  update_time: string;
}
