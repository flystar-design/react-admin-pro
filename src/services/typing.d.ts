import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError
} from 'axios';

export {};

declare global {
  export interface RequestInterceptors {
    // 请求拦截
    requestInterceptors?: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig;
    requestInterceptorsCatch?: (err: any) => any;
    // 响应拦截
    responseInterceptors?: (config: AxiosResponse) => T;
    responseInterceptorsCatch?: (err: AxiosError) => any;
  }

  // 自定义传入的参数
  export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors;
  }

  export interface CancelRequestSource {
    [index: string]: () => void;
  }

  export interface RequestResult<T = any> {
    data: T;
    error: any;
    message: string;
    path: string;
    status: number;
    timestamp: string;
  }

  export interface ResponsePage<T extends Record<string, any>> {
    current: number;
    results: T[];
    size: number;
    total: number;
  }

  export interface RequestPages<T extends Record<string, any>> {
    list: T[];
    total: number;
    size: number;
    page: number;
    [key: string]: any;
  }
}
