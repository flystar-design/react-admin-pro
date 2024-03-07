import { ConfigProvider, App as AntdApp } from 'antd';
import BasicLayout from './layouts/BasicLayout.tsx';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        prefixCls='fly'
        theme={{
          cssVar: true,
          token: {}
        }}
      >
        <AntdApp>
          <BasicLayout />
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
