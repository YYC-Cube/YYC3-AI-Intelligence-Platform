import {
  clearSession,
  getSession,
  hasSession,
  isOnboardingDone,
  markOnboardingDone,
  setSession,
} from '../../utils/session';

describe('会话标记', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('初始应无会话', () => {
    expect(hasSession()).toBe(false);
    expect(getSession()).toBeNull();
  });

  it('写入后应可读取会话内容', () => {
    setSession({ appName: 'Demo App' });
    const session = getSession();

    expect(hasSession()).toBe(true);
    expect(session?.appName).toBe('Demo App');
    expect(typeof session?.createdAt).toBe('number');
  });

  it('清除后应回到未登录态', () => {
    setSession({ appName: 'Demo App' });
    clearSession();

    expect(hasSession()).toBe(false);
  });

  it('损坏的会话数据应安全降级为 null', () => {
    window.sessionStorage.setItem('yyc3_session', '{not-json');
    expect(getSession()).toBeNull();
  });

  it('引导完成标记应可读写', () => {
    expect(isOnboardingDone()).toBe(false);
    markOnboardingDone();
    expect(isOnboardingDone()).toBe(true);
  });
});
