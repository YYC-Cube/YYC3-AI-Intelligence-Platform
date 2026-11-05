import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClientApp from '../../ClientApp';
import { markOnboardingDone, setSession } from '../../utils/session';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/client/*" element={<ClientApp />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ClientApp 路由即状态（深链还原）', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setSession({ appName: 'Test App' });
    markOnboardingDone();
  });

  it('访问 /client 时默认落到 Dashboard', () => {
    renderAt('/client');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Revenue Dashboard' })
    ).toBeInTheDocument();
  });

  it('访问 /client/aso 应还原 ASO 模块', () => {
    renderAt('/client/aso');

    expect(screen.getByRole('heading', { level: 1, name: 'ASO Optimization' })).toBeInTheDocument();
  });

  it('访问 /client/trends/detail 应还原子页标题', () => {
    renderAt('/client/trends/detail');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Trend Deep Analysis' })
    ).toBeInTheDocument();
  });

  it('未知模块应回退到默认标题', () => {
    renderAt('/client/unknown-module');

    expect(
      screen.getByRole('heading', { level: 1, name: 'YYC3 · Intelligence' })
    ).toBeInTheDocument();
  });
});
