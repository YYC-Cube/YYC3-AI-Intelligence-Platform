import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, ChevronRight, Menu, Search, Sparkles } from 'lucide-react';
import { createElement, useEffect, useState } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import { YYCLogo } from '../../YYCLogo';
import { EnterpriseModuleView } from './enterprise-views';
import { level4Actions, yycNavigationConfig } from './nav-config';

/**
 * 已实现模块白名单：每个一级模块只保留 4 个真实可用入口，
 * 其余二级入口折叠到「规划中」，避免 92 个入口全部可点却内容雷同。
 */
const READY_L2: Record<string, string[]> = {
  'data-center': ['ai-data-screen', 'data-overview', 'data-analytics', 'smart-alert'],
  'core-business': ['customer-mgmt', 'lead-mgmt', 'contract-mgmt', 'order-mgmt'],
  hr: ['employee-mgmt', 'smart-recruitment', 'performance-mgmt', 'org-structure'],
  finance: ['smart-accounting', 'invoice-mgmt', 'smart-budget', 'smart-reimbursement'],
  office: ['smart-approval', 'document-mgmt', 'workflow-mgmt', 'smart-meetings'],
  'ai-center': ['ai-assistant', 'ai-analytics', 'natural-language', 'ai-content-creator'],
  settings: ['system-settings', 'user-mgmt', 'role-permission', 'log-mgmt'],
};

export function YYCEnterpriseLayout() {
  // State for 4-Level Navigation
  const [activeL1, setActiveL1] = useState<string>('data-center');
  const [activeL2, setActiveL2] = useState<string>(READY_L2['data-center'][0]);
  const [activeL3, setActiveL3] = useState<string>('overview');
  const [showPlanned, setShowPlanned] = useState(false);

  // Mobile & UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useResponsive();

  // Derived Data
  const currentL1 = yycNavigationConfig.find((l1) => l1.id === activeL1) || yycNavigationConfig[0];
  const currentL2List = currentL1.children;
  const readyIds = READY_L2[currentL1.id] ?? currentL2List.map((l2) => l2.id);
  const readyL2List = currentL2List.filter((l2) => readyIds.includes(l2.id));
  const plannedL2List = currentL2List.filter((l2) => !readyIds.includes(l2.id));
  const currentL2 = currentL2List.find((l2) => l2.id === activeL2) || readyL2List[0];
  const currentL3List = currentL2?.tabs || [];
  const currentL3Label = currentL3List.find((l3) => l3.id === activeL3)?.label ?? '';

  // Sidebar sync with breakpoint
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Update L2/L3 defaults when L1 changes
  useEffect(() => {
    const children = yycNavigationConfig.find((l1) => l1.id === activeL1)?.children ?? [];
    const allowed = READY_L2[activeL1] ?? children.map((c) => c.id);
    const firstL2 = children.find((c) => allowed.includes(c.id)) ?? children[0];
    if (firstL2) {
      setActiveL2(firstL2.id);
      setActiveL3(firstL2.tabs[0]?.id ?? '');
    }
    setShowPlanned(false);
  }, [activeL1]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* ==================================================================================
          LEVEL 1: Global Top Navigation
          ================================================================================== */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 z-40 shadow-sm relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <YYCLogo variant="short" size="medium" />
          </div>

          {/* L1 Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 ml-4 overflow-x-auto no-scrollbar">
            {yycNavigationConfig.map((item) => {
              const isActive = activeL1 === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveL1(item.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="l1-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full mx-2 translate-y-[21px]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-500 hover:border-blue-400 transition-colors group"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-blue-500" />
            <span>搜索...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <button
            className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900 shadow-md">
            AD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ==================================================================================
            LEVEL 2: Contextual Sidebar
            ================================================================================== */}
        <AnimatePresence mode="wait">
          {(isSidebarOpen || !isMobile) && (
            <motion.aside
              initial={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
              animate={isMobile ? { x: 0 } : { width: 260, opacity: 1 }}
              exit={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`
                fixed lg:static inset-y-0 left-0 z-30 w-[280px] lg:w-[260px]
                bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                flex flex-col
                ${isMobile && !isSidebarOpen ? 'hidden' : 'flex'}
              `}
            >
              {/* L2 Header Area */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                  当前模块
                </div>
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                  {createElement(currentL1.icon, { className: 'w-5 h-5 text-slate-500' })}
                  {currentL1.label}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{currentL1.description}</p>
              </div>

              {/* L2 List（仅已实现模块可点，其余折叠为规划中） */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {readyL2List.map((item) => {
                  const isActive = activeL2 === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveL2(item.id);
                        if (item.tabs.length > 0) {
                          setActiveL3(item.tabs[0].id);
                        }
                        if (isMobile) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all group
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}

                {plannedL2List.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowPlanned((v) => !v)}
                      aria-expanded={showPlanned}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${showPlanned ? '' : '-rotate-90'}`}
                        />
                        规划中（{plannedL2List.length}）
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                        未开放
                      </span>
                    </button>

                    {showPlanned && (
                      <div className="mt-1 space-y-1">
                        {plannedL2List.map((item) => (
                          <div
                            key={item.id}
                            aria-disabled="true"
                            title="该模块尚在规划中"
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed select-none"
                          >
                            <item.icon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Assistant Trigger in Sidebar */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold">YYC3 · AI 助手</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ==================================================================================
            LEVEL 3 & 4: Main Content Area
            ================================================================================== */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 overflow-hidden relative">
          {/* Breadcrumbs & Header */}
          <div className="flex-none px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span>{currentL1.label}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{currentL2.label}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {currentL3List.find((l3) => l3.id === activeL3)?.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {currentL2?.label}
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800">
                YYC3 · Enterprise
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                演示数据
              </span>
            </h1>
          </div>

          {/* Level 3: Tabs */}
          <div className="flex-none px-6 mt-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6">
              {currentL3List.map((tab) => {
                const isActive = activeL3 === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveL3(tab.id)}
                    className={`
                      relative pb-3 text-sm font-medium transition-colors whitespace-nowrap
                      ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="l3-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 4: Action Toolbar */}
          <div className="flex-none px-6 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {level4Actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border shadow-sm
                      ${
                        action.id === 'create'
                          ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                系统状态: 正常
              </span>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <span>最后更新: 刚刚</span>
            </div>
          </div>

          {/* Module-specific content：每个一级模块使用不同的信息架构 */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-950">
            <motion.div
              key={`${activeL1}-${activeL2}-${activeL3}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <EnterpriseModuleView
                l1Id={activeL1}
                l1Label={currentL1.label}
                l2Label={currentL2?.label ?? ''}
                l3Label={currentL3Label}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Global Search Overlay (Mock) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="搜索页面、功能或数据..."
                  className="flex-1 text-lg bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <kbd className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                  ESC
                </kbd>
              </div>
              <div className="p-2">
                <div className="text-xs font-semibold text-slate-400 px-3 py-2">推荐导航</div>
                {yycNavigationConfig.slice(0, 3).map((l1) => (
                  <button
                    key={l1.id}
                    onClick={() => {
                      setActiveL1(l1.id);
                      setSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-3"
                  >
                    <l1.icon className="w-4 h-4 text-slate-400" />
                    <span>
                      跳转到 <b>{l1.label}</b>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
