import { ConfigProvider, App as AntdApp } from "antd";
import axios from "axios";
import * as AxiosLogger from "axios-logger";
import BaseLayout from "./layouts/base-layout";

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
AxiosLogger.setGlobalConfig({
  prefixText: "ADMIN",
  dateFormat: "HH:MM:ss",
  status: true,
  headers: false,
  logger: console.log.bind(this),
});
instance.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);
instance.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {},
        components: {
          Layout: {
            bodyBg:'linear-gradient(to top, #7028e4 0%, #e5b2ca 100%);',
            siderBg: "rgba(255,255,255,0.5)",
            headerBg:'transparent',
          },
          Menu:{
            itemBg:'transparent',
          }
        },
      }}
    >
      <AntdApp>
        <BaseLayout />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
