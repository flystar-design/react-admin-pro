import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

class Request {
  /**
   * axios实例
   * @private
   */
  private instance: AxiosInstance;
  /**
   * 拦截器
   * @private
   */
  private interceptors?: RequestInterceptors;

  /**
   * 存放取消方法的集合
   * 在创建请求后将取消请求方法 push 到该集合中
   * 封装一个方法，可以取消请求，传入 url: string|string[]
   * 在请求之前判断同一URL是否存在，如果存在就取消请求
   * @type {CancelRequestSource[]}
   * @private
   */
  private cancelRequestSourceList?: CancelRequestSource[];

  /**
   * 存放所有请求URL的集合
   * 请求之前需要将url push到该集合中
   * 请求完毕后将url从集合中删除
   * 添加在发送请求之前完成，删除在响应之后删除
   * @private
   */
  private requestUrlList?: string[];

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    this.requestUrlList = [];
    this.cancelRequestSourceList = [];

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    );

    // 全局请求拦截
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (err: AxiosError) => err
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    );
    // 全局响应拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data;
      },
      (err: AxiosError) => err
    );
  }

  /**
   * 获取指定url在cancelRequestSourceList中的索引
   * @param url 请求的url
   * @returns {number} 索引
   * @private
   */
  private getSourceIndex(url: string): number {
    return (
      this.cancelRequestSourceList?.findIndex((item) => {
        return Object.keys(item)[0] === url;
      }) || -1
    );
  }

  /**
   * 删除requestUrlList和cancelRequestSourceList中的url
   * @param url
   * @private
   */
  private deleteUrl(url: string) {
    const urlIndex =
      this.requestUrlList?.findIndex((item) => item === url) || -1;
    const sourceIndex = this.getSourceIndex(url);
    if (urlIndex !== -1) {
      this.requestUrlList?.splice(urlIndex, 1);
    }
    if (sourceIndex !== -1) {
      this.cancelRequestSourceList?.splice(sourceIndex, 1);
    }
  }

  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    this.cancelRequestSourceList?.forEach((source) => {
      const key = Object.keys(source)[0];
      source[key]();
    });
    this.requestUrlList = [];
    this.cancelRequestSourceList = [];
  }

  /**
   * 取消指定请求
   * @param url
   */
  cancelRequest(url: string | string[]) {
    if (Array.isArray(url)) {
      url.forEach((u) => {
        const sourceIndex = this.getSourceIndex(u);
        if (sourceIndex > -1) {
          this.cancelRequestSourceList?.[sourceIndex][u]();
          this.deleteUrl(u);
        }
      });
    } else {
      const sourceIndex = this.getSourceIndex(url);
      if (sourceIndex !== -1) {
        this.cancelRequestSourceList?.[sourceIndex][url]();
        this.deleteUrl(url);
      }
    }
  }

  /**
   * 发送请求
   * @param config
   * @private
   */
  request<T>(config: RequestConfig) {
    return new Promise<RequestResult<T>>((resolve, reject) => {
      const url = config.url || '';
      if (url) {
        this.requestUrlList?.push(url);
        config.cancelToken = new axios.CancelToken((cancel) => {
          this.cancelRequestSourceList?.push({ [url]: cancel });
        });
      }
      this.instance
        .request<any, RequestResult<T>>(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          this.deleteUrl(url);
        });
    });
  }

  get<T>(url: string, params?: Record<any, any>, config?: RequestConfig) {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config
    });
  }
  post<T>(
    url: string,
    data?: Record<any, any>,
    config?: RequestConfig
  ): Promise<RequestResult<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    });
  }

  delete<T>(url: string, params?: Record<any, any>, config?: RequestConfig) {
    return this.request<T>({
      url,
      method: 'DELETE',
      params,
      ...config
    });
  }
  put<T>(url: string, data?: Record<any, any>, config?: RequestConfig) {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    });
  }

  patch<T>(url: string, data?: Record<any, any>, config?: RequestConfig) {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config
    });
  }
}

export default Request;
