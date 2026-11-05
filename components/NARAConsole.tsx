/**
 * @fileoverview YYC3 NARA Console - AI Operating System Mode Switcher
 * @description Central hub for NARA modes (Home/Chat/Loop/System) with lazy loading
 * @audit-fix [C2-FIX] [W6-FIX] — Replaced synchronous imports with lazy-loaded components
 * @audit-phase P0
 * @audit-date 2026-04-21
 * @version 1.1.0
 * @author YYC3 Team
 */
import { Home, Languages, Layout, MessageSquare, RefreshCw } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ChatMode, HomeMode, LoopMode, YYCEnterpriseLayout } from './LazyComponents';

const ModeFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="text-slate-500 text-sm">加载模块中...</span>
    </div>
  </div>
);

type Mode = 'home' | 'chat' | 'loop' | 'system';
type Language = 'zh' | 'en';

const translations = {
  zh: {
    title: 'YYC3 · NARA',
    subtitle: 'AI 操作系统',
    status: '在线',
    tabs: {
      home: '主页',
      chat: '对话',
      loop: '循环',
      system: '企业系统',
    },
  },
  en: {
    title: 'YYC3 · NARA',
    subtitle: 'AI Operating System',
    status: 'Online',
    tabs: {
      home: 'Home',
      chat: 'Chat',
      loop: 'Loop',
      system: 'Enterprise System',
    },
  },
};

export function NARAConsole() {
  const [activeMode, setActiveMode] = useState<Mode>('home');
  const [language, setLanguage] = useState<Language>('zh');

  const t = translations[language];

  if (activeMode === 'system') {
    return (
      <div className="relative h-screen w-full">
        <Suspense fallback={<ModeFallback />}>
          <YYCEnterpriseLayout />
        </Suspense>
        <button
          onClick={() => setActiveMode('home')}
          className="fixed bottom-4 right-4 z-50 p-2 bg-slate-800 text-white rounded-full opacity-50 hover:opacity-100 transition-opacity text-xs"
          title="Return to NARA Console"
        >
          Exit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage((l) => (l === 'zh' ? 'en' : 'zh'))}
                title={language === 'zh' ? '切换语言 / Switch to English' : '切换语言 / 切换到中文'}
                aria-label="切换语言"
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2 text-xs font-medium"
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'zh' ? 'EN' : '中文'}</span>
              </button>
              <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs text-emerald-700 font-medium">{t.status}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner overflow-x-auto">
            <button
              onClick={() => setActiveMode('home')}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeMode === 'home'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.tabs.home}</span>
            </button>
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeMode === 'chat'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.tabs.chat}</span>
            </button>
            <button
              onClick={() => setActiveMode('loop')}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeMode === 'loop'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.tabs.loop}</span>
            </button>
            <button
              onClick={() => setActiveMode('system')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                (activeMode as string) === 'system'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>{t.tabs.system}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-50 -z-10 opacity-70 pointer-events-none" />
        {activeMode === 'home' && (
          <Suspense fallback={<ModeFallback />}>
            <HomeMode language={language} />
          </Suspense>
        )}
        {activeMode === 'chat' && (
          <Suspense fallback={<ModeFallback />}>
            <ChatMode language={language} />
          </Suspense>
        )}
        {activeMode === 'loop' && (
          <Suspense fallback={<ModeFallback />}>
            <LoopMode language={language} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
