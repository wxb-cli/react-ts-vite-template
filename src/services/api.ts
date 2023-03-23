import axios from './request';

/**
 * 登录
 */
export const fetchLogin = async (params: Expand<API.LoginParams>) =>
  axios.post<any, ExpandRecursively<API.LoginData>>('/login', params);

/**
 * 校验权限
 */
export const checkAuth = async () =>
  axios.post<any, ExpandRecursively<null>>('/auth', {});
