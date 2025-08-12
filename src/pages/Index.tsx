
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AIProviderSetup } from "@/components/AIProviderSetup";
import { HealthReport } from "@/components/HealthReport";
import { Activity, Heart, Zap } from "lucide-react";

export interface HealthData {
  steps?: number;
  distance_km?: number;
  calories_kcal?: number;
  sleep_hours?: number;
  water_liters?: number;
  lab_results?: Array<{
    parameter: string;
    value: number;
    unit: string;
    status: string;
  }>;
  diet_preference?: string;
  goal?: string;
}

export interface AIConfig {
  provider: string;
  apiKey: string;
}

const Index = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'ai-setup' | 'report'>('upload');

  const handleDataUploaded = (data: HealthData) => {
    setHealthData(data);
    setCurrentStep('ai-setup');
  };

  const handleAIConfigured = (config: AIConfig) => {
    setAIConfig(config);
    setCurrentStep('report');
  };

  const resetApp = () => {
    setHealthData(null);
    setAIConfig(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl gradient-health">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-health bg-clip-text text-transparent">
              HealthViz
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your health data into beautiful, gamified reports with AI-powered insights
          </p>
          
          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 ${currentStep === 'upload' ? 'text-primary' : (currentStep === 'ai-setup' || currentStep === 'report') ? 'text-health-good' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-primary text-white' : (currentStep === 'ai-setup' || currentStep === 'report') ? 'bg-health-good text-white' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="font-medium">Upload Data</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className={`flex items-center gap-2 ${currentStep === 'ai-setup' ? 'text-primary' : currentStep === 'report' ? 'text-health-good' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'ai-setup' ? 'bg-primary text-white' : currentStep === 'report' ? 'bg-health-good text-white' : 'bg-muted text-muted-foreground'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-medium">AI Setup</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className={`flex items-center gap-2 ${currentStep === 'report' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'report' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-medium">Your Report</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-12">
        {currentStep === 'upload' && (
          <div className="animate-fade-up">
            <FileUpload onDataUploaded={handleDataUploaded} />
          </div>
        )}

        {currentStep === 'ai-setup' && healthData && (
          <div className="animate-fade-up">
            <AIProviderSetup onConfigured={handleAIConfigured} />
          </div>
        )}

        {currentStep === 'report' && healthData && aiConfig && (
          <div className="animate-fade-up">
            <HealthReport 
              healthData={healthData} 
              aiConfig={aiConfig} 
              onReset={resetApp}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
