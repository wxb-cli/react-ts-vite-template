import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { downloadStreamFile } from '@/utils/utils';
import { message } from 'antd';

const localConfig = {
  status: {
    // 与后台约定可能返回的状态码（不是http的响应状态码）
    200: '请求成功',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误，未找到该资源',
    408: '请求超时',
    500: '服务器发生错误',
    501: '服务未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'HTTP版本不受支持',
  },
};

type HttpStatusCode = keyof typeof localConfig.status;

export interface DTO<ResDataType = any> {
  code: number;
  data: ResDataType;
  message: string | undefined;
  success: boolean;
}

class Request {
  private instance: AxiosInstance;

  private baseConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:9527/admin',
  };

  public constructor(config: AxiosRequestConfig = {}) {
    // 创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Token = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<DTO>) => {
        const { headers, data, status } = response;
        if (headers['content-type']?.includes('application/json')) {
          // 服务端自定义的一套状态码，并不是真实的http状态码，如果处理http状态码错误，请至下面error错误函数中修改
          if (status !== 200) {
            const errorText =
              data.message ||
              localConfig.status[status as HttpStatusCode] ||
              'HTTP响应错误';
            if (status === 401) {
              localStorage.removeItem('token');
              location.href = '/login';
            }
            message.error(errorText);
            return Promise.reject(errorText);
          }
          if (location.pathname !== '/login' && data.code === 110) {
            localStorage.removeItem('token');
            location.href = '/login';
            message.error('用户认证失败');
            return Promise.reject('用户认证失败');
          }
        }
        return response;
      },
      (error) => {
        // 这里处理http状态码错误
        message.error(`${error.message}, 请检查网络或联系管理员`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get 请求
   * @param url
   * @param config
   * @returns {DTO.data} return response.data.data
   */
  public get<ResData = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .get<DTO<ResData>>(url, config)
      .then(({ data }) => data.data);
  }

  /**
   * Post 请求
   * @param url
   * @param data
   * @param config
   * @returns {DTO.data} 直接返回数据部分 return response.data.data
   */
  public post<Params = any, ResData = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ): Promise<ResData> {
    return this.instance
      .post<DTO<ResData>>(url, data, config)
      .then(({ data }) => data.data);
  }

  /**
   * 获取Blob数据
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public getBlob<Params = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ): Promise<{
    blob: Blob;
    filename?: string;
    fileType?: string;
  }> {
    return this.post(url, data, { responseType: 'blob', ...config }).then(
      (res) => {
        const { data, headers } = res;
        // if (headers['content-type'] === 'application/octet-stream') {}
        const fileType = headers['content-type'];
        const filename = headers['content-disposition'].split('=')[1];
        return { blob: data, filename: decodeURIComponent(filename), fileType };
      }
    );
  }

  /**
   * 请求流数据文件并直接下载
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public async getStreamFileToDownload<Params = any>(
    url: string,
    data: Params,
    config?: AxiosRequestConfig
  ) {
    const { blob, filename, fileType } = await this.getBlob(url, data, config);
    downloadStreamFile(blob, filename, fileType);
    return { blob, filename, fileType };
  }

  /**
   * 应对其他情况的请求方法，如: 需要返回整个response.data 等。
   * @param {AxiosRequestConfig} config
   * @returns {AxiosResponse.data} return response.data
   */
  public request<ResData = any>(config: AxiosRequestConfig) {
    return this.instance
      .request<DTO<ResData>>(config)
      .then((response) => response.data);
  }
}

export default new Request();
