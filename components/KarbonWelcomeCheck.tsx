import { useState } from 'react';
import type { AppData, GenreData, WelcomeCompleteData } from '../types';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CompetitorSampling } from './welcome/CompetitorSampling';
import { GenreSelection } from './welcome/GenreSelection';
import { WelcomeAnalysis } from './welcome/WelcomeAnalysis';
import { WelcomeReportBuilder } from './welcome/WelcomeReportBuilder';

interface KarbonWelcomeCheckProps {
  appData?: AppData;
  onComplete: (welcomeData: WelcomeCompleteData) => void;
  onSetAppContext?: (appData: AppData) => void;
}

export function KarbonWelcomeCheck({
  appData,
  onComplete,
  onSetAppContext: _onSetAppContext,
}: KarbonWelcomeCheckProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [welcomeData, setWelcomeData] = useState<WelcomeCompleteData>({});

  const steps = [
    { id: 1, name: 'Genre Selection', description: 'Choose your app category' },
    { id: 2, name: 'Competitor Sampling', description: 'AI identifies your competition' },
    { id: 3, name: 'Market Analysis', description: 'Deep intelligence analysis' },
    { id: 4, name: 'Report Generation', description: 'Create your intelligence report' },
  ];

  const handleStepComplete = (stepData: Record<string, unknown>) => {
    const newWelcomeData = { ...welcomeData, ...stepData } as WelcomeCompleteData;
    setWelcomeData(newWelcomeData);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        ...newWelcomeData,
        completedAt: new Date().toISOString(),
        appData,
      });
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenreSelection
            appData={appData}
            onComplete={(data) => handleStepComplete({ selectedGenre: data })}
          />
        );
      case 2:
        return (
          <CompetitorSampling
            appData={appData}
            selectedGenre={welcomeData.selectedGenre as unknown as GenreData}
            onComplete={(data) => handleStepComplete({ competitors: data })}
            onBack={handleStepBack}
          />
        );
      case 3:
        return (
          <WelcomeAnalysis
            appData={appData}
            selectedGenre={welcomeData.selectedGenre as unknown as GenreData}
            competitors={welcomeData.competitors || []}
            onComplete={(data) => handleStepComplete({ analysisResults: data })}
            onBack={handleStepBack}
          />
        );
      case 4:
        return (
          <WelcomeReportBuilder
            appData={appData}
            selectedGenre={welcomeData.selectedGenre as unknown as GenreData}
            competitors={welcomeData.competitors || []}
            analysisResults={welcomeData.analysisResults}
            onComplete={(data) => handleStepComplete({ reportData: data })}
            onBack={handleStepBack}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/yyc3-icons/pwa/icon-192x192.png"
                alt="YYC3"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain"
              />
              <div>
                <h1 className="font-semibold">YYC3 · 欢迎引导</h1>
                <p className="text-sm text-muted-foreground">
                  Genre Intelligence Analysis for {appData?.name || 'Your App'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Step {currentStep} of 4
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">{getStepComponent()}</div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          YYC3 · AI Intelligence Platform • Comprehensive Market Analysis
        </p>
      </div>
    </div>
  );
}
