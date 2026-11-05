/**
 * @fileoverview 会话标记（临时方案）
 * @description 当前项目无后端，登录态仅用于前端路由守卫与 UI 展示，
 *              不具备真正的安全能力。接入真实鉴权（Supabase/Auth.js）后应整体替换。
 */

export interface YycSession {
  appName: string;
  createdAt: number;
}

const SESSION_KEY = 'yyc3_session';
const ONBOARDING_KEY = 'yyc3_onboarding_done';

export function setSession(session: Omit<YycSession, 'createdAt'>): void {
  try {
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...session, createdAt: Date.now() })
    );
  } catch {
    /* 隐私模式下忽略 */
  }
}

export function getSession(): YycSession | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as YycSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSession(): boolean {
  return getSession() !== null;
}

/** 标记引导流程已完成，避免深链/刷新时重复进入引导页 */
export function markOnboardingDone(): void {
  try {
    window.sessionStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function isOnboardingDone(): boolean {
  try {
    return window.sessionStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return false;
  }
}
