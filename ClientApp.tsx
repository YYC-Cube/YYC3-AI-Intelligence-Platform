import { Suspense, lazy, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClientSidebar } from './components/ClientSidebar';
import { FloatingAssistant } from './components/FloatingAssistant';
import { Header } from './components/Header';
import { KarbonWelcomeCheck } from './components/KarbonWelcomeCheck';
import { isOnboardingDone, markOnboardingDone } from './utils/session';
import type { AppData, WelcomeContext } from './types';

/**
 * 业务模块按需加载：避免 ClientApp 单 chunk 过大，
 * 也让新增模块只需在注册表 + 路由分支中登记，不再静态引入全部依赖。
 */
const PersonalizedDashboard = lazy(() =>
  import('./components/PersonalizedDashboard').then((m) => ({ default: m.PersonalizedDashboard }))
);
const ExplorerModule = lazy(() =>
  import('./components/modules/ExplorerModule').then((m) => ({ default: m.ExplorerModule }))
);
const TrendsModule = lazy(() =>
  import('./components/modules/TrendsModule').then((m) => ({ default: m.TrendsModule }))
);
const CreativeModule = lazy(() =>
  import('./components/modules/CreativeModule').then((m) => ({ default: m.CreativeModule }))
);
const ASOModule = lazy(() =>
  import('./components/modules/ASOModule').then((m) => ({ default: m.ASOModule }))
);
const PaywallModule = lazy(() =>
  import('./components/modules/PaywallModule').then((m) => ({ default: m.PaywallModule }))
);
const ReviewsModule = lazy(() =>
  import('./components/modules/ReviewsModule').then((m) => ({ default: m.ReviewsModule }))
);
const CrossAnalysisModule = lazy(() =>
  import('./components/modules/CrossAnalysisModule').then((m) => ({
    default: m.CrossAnalysisModule,
  }))
);
const ABTestingModule = lazy(() =>
  import('./components/modules/ABTestingModule').then((m) => ({ default: m.ABTestingModule }))
);
const HumanAICollaborationModule = lazy(() =>
  import('./components/modules/HumanAICollaborationModule').then((m) => ({
    default: m.HumanAICollaborationModule,
  }))
);
const FinancingModule = lazy(() =>
  import('./components/modules/FinancingModule').then((m) => ({ default: m.FinancingModule }))
);
const PricingModule = lazy(() =>
  import('./components/modules/PricingModule').then((m) => ({ default: m.PricingModule }))
);
const UIUXModule = lazy(() =>
  import('./components/modules/UIUXModule').then((m) => ({ default: m.UIUXModule }))
);
const MarketsModule = lazy(() =>
  import('./components/modules/MarketsModule').then((m) => ({ default: m.MarketsModule }))
);
const FeaturesModule = lazy(() =>
  import('./components/modules/FeaturesModule').then((m) => ({ default: m.FeaturesModule }))
);
const IdeasModule = lazy(() =>
  import('./components/modules/IdeasModule').then((m) => ({ default: m.IdeasModule }))
);
const AssistantModule = lazy(() =>
  import('./components/modules/AssistantModule').then((m) => ({ default: m.AssistantModule }))
);
const SupportModule = lazy(() =>
  import('./components/modules/SupportModule').then((m) => ({ default: m.SupportModule }))
);

const MODULE_LOADING = (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="text-slate-500 text-sm">加载模块中...</span>
    </div>
  </div>
);

export default function ClientApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // 路由即状态：/client/:module/:subPage，刷新与分享均可还原
  const segments = location.pathname
    .replace(/^\/client\/?/, '')
    .split('/')
    .filter(Boolean);
  const activeModule = segments[0] || 'dashboard';
  const subPage = segments[1] || '';

  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(() => isOnboardingDone());
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [showFloatingAssistant, setShowFloatingAssistant] = useState(false);
  const [appContext, setAppContext] = useState<Record<string, unknown> | null>(null);
  const [welcomeContext, setWelcomeContext] = useState<WelcomeContext | null>(null);

  const setActiveModule = (moduleId: string) => {
    navigate(`/client/${moduleId}`);
  };

  const getModuleInfo = (moduleId: string, subPageId?: string) => {
    const moduleMap = {
      dashboard: {
        title: 'Revenue Dashboard',
        subtitle: 'Your app performance and revenue analytics',
      },
      explorer: {
        title: subPageId === 'detail' ? 'App Deep Analysis' : 'App Analytics',
        subtitle:
          subPageId === 'detail'
            ? 'Comprehensive app analytics and intelligence'
            : 'Your app performance and market position',
      },
      trends: {
        title: subPageId === 'detail' ? 'Trend Deep Analysis' : 'Market Trends',
        subtitle:
          subPageId === 'detail'
            ? 'Detailed trend analysis and forecasting'
            : 'Real-time market intelligence and forecasting',
      },
      creative: {
        title:
          subPageId === 'detail'
            ? 'Creative Deep Analysis'
            : subPageId === 'comparison'
              ? 'Creative Benchmarking'
              : 'Creative Analysis',
        subtitle:
          subPageId === 'detail'
            ? 'Comprehensive visual and creative analysis'
            : subPageId === 'comparison'
              ? 'Side-by-side creative performance comparison'
              : 'Visual design analysis and competitive intelligence',
      },
      aso: {
        title:
          subPageId === 'detail'
            ? 'ASO Deep Analysis'
            : subPageId === 'optimization'
              ? 'ASO Optimization Tools'
              : 'ASO Optimization',
        subtitle:
          subPageId === 'detail'
            ? 'Comprehensive ASO performance analysis'
            : subPageId === 'optimization'
              ? 'App store optimization recommendations'
              : 'App store optimization and keyword intelligence',
      },
      paywall: {
        title:
          subPageId === 'detail'
            ? 'Paywall Deep Analysis'
            : subPageId === 'comparison'
              ? 'Paywall Benchmarking'
              : 'Paywall Scanner',
        subtitle:
          subPageId === 'detail'
            ? 'Comprehensive monetization analysis'
            : subPageId === 'comparison'
              ? 'Paywall strategy comparison and insights'
              : 'Monetization strategy and paywall intelligence',
      },
      reviews: {
        title:
          subPageId === 'analysis'
            ? 'Review Deep Analysis'
            : subPageId === 'monitoring'
              ? 'Review Monitoring'
              : 'Review Analytics',
        subtitle:
          subPageId === 'analysis'
            ? 'Comprehensive review sentiment and feedback analysis'
            : subPageId === 'monitoring'
              ? 'Real-time review tracking and alerts'
              : 'User feedback analysis and sentiment intelligence',
      },
      'cross-analysis': {
        title:
          subPageId === 'report'
            ? 'Intelligence Report'
            : subPageId === 'competitive'
              ? 'Competitive Analysis'
              : 'Cross Analysis',
        subtitle:
          subPageId === 'report'
            ? 'Comprehensive cross-module intelligence report'
            : subPageId === 'competitive'
              ? 'Multi-dimensional competitive intelligence'
              : 'Multi-module analysis and intelligence synthesis',
      },
      'ab-testing': {
        title:
          subPageId === 'test-detail'
            ? 'Test Analysis'
            : subPageId === 'create-test'
              ? 'Create AB Test'
              : 'AB Testing',
        subtitle:
          subPageId === 'test-detail'
            ? 'Detailed test configuration and results'
            : subPageId === 'create-test'
              ? 'Set up new AB test experiments'
              : 'Growth optimization through data-driven testing',
      },
      'human-ai-collaboration': {
        title:
          subPageId === 'workspace'
            ? 'Collaboration Workspace'
            : subPageId === 'plan-builder'
              ? 'Strategic Plan Builder'
              : 'Human-AI Collaboration',
        subtitle:
          subPageId === 'workspace'
            ? 'Real-time collaborative intelligence workspace'
            : subPageId === 'plan-builder'
              ? 'AI-assisted strategic planning and roadmap generation'
              : 'Intelligence amplification for your app growth strategy',
      },
      financing: {
        title:
          subPageId === 'application'
            ? 'Investment Application'
            : subPageId === 'eligibility'
              ? 'Eligibility Assessment'
              : 'App Financing',
        subtitle:
          subPageId === 'application'
            ? 'Apply for growth capital investment'
            : subPageId === 'eligibility'
              ? 'Check your investment eligibility'
              : 'Growth capital and investment opportunities',
      },
      pricing: {
        title:
          subPageId === 'analysis'
            ? 'Pricing Analysis'
            : subPageId === 'optimization'
              ? 'Price Optimization'
              : 'Pricing Strategy',
        subtitle:
          subPageId === 'analysis'
            ? 'Detailed pricing performance analysis'
            : subPageId === 'optimization'
              ? 'AI-powered pricing recommendations'
              : 'Optimize your app monetization strategy',
      },
      'ui-ux': {
        title:
          subPageId === 'analysis'
            ? 'UI/UX Analysis'
            : subPageId === 'recommendations'
              ? 'Design Recommendations'
              : 'UI/UX Analysis',
        subtitle:
          subPageId === 'analysis'
            ? 'Comprehensive interface and experience analysis'
            : subPageId === 'recommendations'
              ? 'AI-powered design improvement suggestions'
              : 'User interface and experience optimization',
      },
      markets: {
        title:
          subPageId === 'detail'
            ? 'Market Deep Analysis'
            : subPageId === 'discovery'
              ? 'Market Discovery'
              : 'Market Discovery',
        subtitle:
          subPageId === 'detail'
            ? 'Comprehensive market opportunity analysis'
            : subPageId === 'discovery'
              ? 'Discover new market opportunities'
              : 'Geographic market analysis and opportunity discovery',
      },
      features: {
        title:
          subPageId === 'comparison'
            ? 'Feature Benchmarking'
            : subPageId === 'prioritizer'
              ? 'Feature Prioritizer'
              : 'Feature Intelligence',
        subtitle:
          subPageId === 'comparison'
            ? 'Feature comparison and competitive analysis'
            : subPageId === 'prioritizer'
              ? 'AI-powered feature prioritization'
              : 'Product feature analysis and roadmap intelligence',
      },
      ideas: {
        title: subPageId === 'detail' ? 'Idea Deep Analysis' : 'Ideas Generator',
        subtitle:
          subPageId === 'detail'
            ? 'Detailed idea analysis and implementation roadmap'
            : 'AI-powered app improvement and feature ideas',
      },
      assistant: {
        title: 'AI Assistant',
        subtitle: 'Intelligent assistance and workflow automation',
      },
      'support-center': {
        title:
          subPageId === 'chatbot'
            ? 'AI Help Chat'
            : subPageId === 'documentation'
              ? 'Documentation'
              : 'Support Center',
        subtitle:
          subPageId === 'chatbot'
            ? 'AI-powered support assistant'
            : subPageId === 'documentation'
              ? 'Comprehensive platform documentation'
              : 'Help, documentation, and support resources',
      },
      chatbot: {
        title: 'AI Help Chat',
        subtitle: 'AI-powered support assistant',
      },
      documentation: {
        title: 'Documentation',
        subtitle: 'Comprehensive platform documentation',
      },
    };

    return (
      moduleMap[moduleId as keyof typeof moduleMap] || {
        title: 'Karbon Intelligence',
        subtitle: 'Your app intelligence platform',
      }
    );
  };

  const handleSubPageChange = (page: string, data?: unknown) => {
    if (data) {
      setSelectedApp(data as AppData);
    }
    navigate(page ? `/client/${activeModule}/${page}` : `/client/${activeModule}`);
  };

  const handleAssistantToggle = () => {
    if (activeModule === 'assistant') {
      return;
    }
    setShowFloatingAssistant(!showFloatingAssistant);
  };

  const handleWelcomeComplete = (context: WelcomeContext) => {
    markOnboardingDone();
    setWelcomeContext(context);
    setHasCompletedWelcome(true);
  };

  if (!hasCompletedWelcome) {
    return (
      <KarbonWelcomeCheck onComplete={handleWelcomeComplete} onSetAppContext={setAppContext} />
    );
  }

  const renderModule = () => {
    const moduleProps = {
      subPage,
      selectedApp: selectedApp as AppData,
      onSubPageChange: handleSubPageChange as (page: string, data?: unknown) => void,
      appContext: (appContext || { selectedApp: null }) as {
        selectedApp: AppData | null;
        [key: string]: unknown;
      },
      welcomeContext: welcomeContext as WelcomeContext | undefined,
    };

    switch (activeModule) {
      case 'dashboard':
        return (
          <PersonalizedDashboard onNavigate={setActiveModule} appData={selectedApp as AppData} />
        );
      case 'explorer':
        return <ExplorerModule {...moduleProps} />;
      case 'trends':
        return <TrendsModule {...moduleProps} />;
      case 'creative':
        return <CreativeModule {...moduleProps} />;
      case 'aso':
        return <ASOModule {...moduleProps} />;
      case 'paywall':
        return <PaywallModule {...moduleProps} />;
      case 'reviews':
        return <ReviewsModule {...moduleProps} />;
      case 'cross-analysis':
        return <CrossAnalysisModule {...moduleProps} />;
      case 'ab-testing':
        return <ABTestingModule {...moduleProps} />;
      case 'human-ai-collaboration':
        return (
          <HumanAICollaborationModule subPage={subPage} onSubPageChange={handleSubPageChange} />
        );
      case 'financing':
        return <FinancingModule {...moduleProps} />;
      case 'pricing':
        return <PricingModule {...moduleProps} />;
      case 'ui-ux':
        return <UIUXModule {...moduleProps} />;
      case 'markets':
        return <MarketsModule {...moduleProps} />;
      case 'features':
        return <FeaturesModule {...moduleProps} />;
      case 'ideas':
        return <IdeasModule {...moduleProps} />;
      case 'assistant':
        return <AssistantModule />;
      case 'support-center':
      case 'chatbot':
      case 'documentation':
        return <SupportModule subPage={subPage} onSubPageChange={handleSubPageChange} />;
      default:
        return (
          <PersonalizedDashboard onNavigate={setActiveModule} appData={selectedApp as AppData} />
        );
    }
  };

  const moduleInfo = getModuleInfo(activeModule, subPage);

  return (
    <div className="min-h-screen bg-background flex">
      <ClientSidebar activeModule={activeModule} onModuleChange={setActiveModule} />

      <div className="flex-1 flex flex-col">
        <Header title={moduleInfo.title} subtitle={moduleInfo.subtitle} />

        <main className="flex-1 p-6">
          <Suspense fallback={MODULE_LOADING}>{renderModule()}</Suspense>
        </main>
      </div>

      {/* Floating Assistant - only show if not in assistant module */}
      {activeModule !== 'assistant' && (
        <FloatingAssistant
          isOpen={showFloatingAssistant}
          onToggle={handleAssistantToggle}
          onNavigateToAssistant={() => setActiveModule('assistant')}
        />
      )}
    </div>
  );
}
