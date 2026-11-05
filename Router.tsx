/**
 * @fileoverview YYC³ AI Intelligence Platform - Route Configuration
 * @description Centralized routing with lazy-loaded modules and enterprise/client splits
 * @audit-fix [C1-FIX] — Route system restructuring for full URL reachability
 * @audit-phase P0
 * @audit-date 2026-04-21
 * @version 1.2.0
 * @author YYC³ Team
 */
import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
  useLocation,
  useRouteError,
} from 'react-router-dom';
import App from './App';
import TestPage from './TestPage';
import { getSession, setSession } from './utils/session';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="text-slate-600 text-sm">加载中...</span>
    </div>
  </div>
);

const EnterpriseApp = React.lazy(() => import('./EnterpriseApp'));
const ClientApp = React.lazy(() => import('./ClientApp'));
const LoginFlow = React.lazy(() =>
  import('./components/LoginFlow').then((mod) => ({ default: mod.LoginFlow }))
);

/**
 * 前端会话守卫（临时方案）：无后端，仅阻止未完成引导的用户直达业务路由。
 * 真实鉴权接入后需替换为服务端校验 + 权限模型。
 */
export function RequireSession({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!getSession()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}

const LoginFlowWrapper = () => {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/client';

  const handleComplete = () => {
    setSession({ appName: 'YYC³ Workspace' });
    window.location.href = redirectTo;
  };
  return <LoginFlow onComplete={handleComplete} />;
};

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold text-slate-800">页面不存在</h1>
      <p className="text-sm text-slate-500 max-w-md">
        你访问的地址可能已被移动或删除。请返回首页，或通过导航进入智能分析工作台。
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        返回首页
      </Link>
    </div>
  );
}

export function RouteError() {
  const error = useRouteError() as Error | undefined;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <p className="text-xl font-semibold text-slate-800">页面加载失败</p>
      <p className="text-sm text-slate-500 max-w-md">
        {error?.message || '发生未知错误，请刷新重试。'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        刷新页面
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginFlowWrapper />
      </Suspense>
    ),
  },
  {
    path: '/enterprise/*',
    element: (
      <RequireSession>
        <Suspense fallback={<LoadingFallback />}>
          <EnterpriseApp />
        </Suspense>
      </RequireSession>
    ),
  },
  {
    path: '/client/*',
    element: (
      <RequireSession>
        <Suspense fallback={<LoadingFallback />}>
          <ClientApp />
        </Suspense>
      </RequireSession>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
