import { AI_LAB_TOKEN_KEY, USER_INFO_KEY } from '@/config';
import { IUserInfo } from '@/services/types/user.type';
import { getUserInfo } from '@/services/user.service';
import Cookies from 'js-cookie';
import { buildLink } from './link';
import { local } from './storage';

export function toLogin() {
  // const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  const redirect = urlParams.get('redirect');

  if (!window.location.pathname.includes('/login') && !redirect) {
    window.location.replace(buildLink('/login'));
    //   window.location.replace(buildLink(`/login?redirect=${pathname}${search}`));
  }
}

export async function toLogOut() {
  // await loginOut();
  Cookies.remove(AI_LAB_TOKEN_KEY, { domain: location.origin, path: '/' });
  local.remove(AI_LAB_TOKEN_KEY);
  local.remove(USER_INFO_KEY);

  window.location.href = buildLink('/login');
}

export const getToken = () => {
  return local.get<string>(AI_LAB_TOKEN_KEY);
};

export const getLocalUserInfo = () => {
  return local.get<IUserInfo>(USER_INFO_KEY) || null;
};

export const checkLogin = async (): Promise<{
  token?: string;
  userInfo?: IUserInfo;
}> => {
  const token = getToken();
  if (!token) {
    toLogin();
    return {};
  }
  try {
    let userInfo = localStorage.getItem(USER_INFO_KEY);
    if (!userInfo) {
      const res = await getUserInfo();
      userInfo = JSON.stringify({ ...res.data });
      local.set(USER_INFO_KEY, userInfo);
    }
    return {
      token,
      userInfo: JSON.parse(userInfo),
    };
  } catch (error) {
    local.remove(AI_LAB_TOKEN_KEY);
    local.remove(USER_INFO_KEY);
    toLogin();
    return {};
  }
};
