import * as AxiosLogger from 'axios-logger';
import { BASE_URL } from '@/services/constants';
import Request from './request';

const TIMEOUT = 1000 * 20;

// services
const service: Request = new Request({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: TIMEOUT,
  interceptors: {
    requestInterceptors: (config) => {
      return config;
    },
    responseInterceptors: (response) => {
      return response;
    },
    responseInterceptorsCatch: (err) => {
      // Do something with response error
      return Promise.reject(err);
    }
  }
});

service.instance.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

service.instance.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

export default service;
