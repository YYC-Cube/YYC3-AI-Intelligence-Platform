import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NotFound, RequireSession } from '../../Router';
import { setSession } from '../../utils/session';

describe('路由守卫与兜底页', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('未登录访问受保护路由时应跳转登录页', () => {
    render(
      <MemoryRouter initialEntries={['/client/aso']}>
        <Routes>
          <Route
            path="/client/*"
            element={
              <RequireSession>
                <div>受保护内容</div>
              </RequireSession>
            }
          />
          <Route path="/login" element={<div>登录页</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('登录页')).toBeInTheDocument();
    expect(screen.queryByText('受保护内容')).not.toBeInTheDocument();
  });

  it('已建立会话时应放行受保护路由', () => {
    setSession({ appName: 'Demo App' });

    render(
      <MemoryRouter initialEntries={['/client/aso']}>
        <Routes>
          <Route
            path="/client/*"
            element={
              <RequireSession>
                <div>受保护内容</div>
              </RequireSession>
            }
          />
          <Route path="/login" element={<div>登录页</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('受保护内容')).toBeInTheDocument();
  });

  it('404 页面应展示提示与返回首页入口', () => {
    render(
      <MemoryRouter initialEntries={['/not-exist']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '页面不存在' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  });
});
