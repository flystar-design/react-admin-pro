import { ConfigProvider, App as AntdApp } from 'antd';
import BasicLayout from './layouts/BasicLayout.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Dashboard,
  loader as DashboardLoader,
  action as DashboardAction
} from './pages/dashboard/Dashboard.tsx';

export const DashboardLoading = () => <div>loading</div>;

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <BasicLayout />,
      children: [
        {
          path: 'dashboard',
          loader: DashboardLoader,
          action: DashboardAction,
          Component: Dashboard,
          HydrateFallback: DashboardLoading
        }
      ]
    }
  ],
  {
    future: {
      v7_partialHydration: true
    }
  }
);

function App() {
  return (
    <ConfigProvider
      prefixCls='fly'
      theme={{
        cssVar: true,
        token: {}
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
