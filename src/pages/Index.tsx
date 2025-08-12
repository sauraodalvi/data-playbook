import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { HealthDataInput } from "@/components/HealthDataInput";
import { HealthReport } from "@/components/HealthReport";
import { AIProviderSetup } from "@/components/AIProviderSetup";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";

export interface HealthData {
  steps?: number;
  distance_km?: number;
  calories_kcal?: number;
  sleep_hours?: number;
  water_liters?: number;
  heart_rate_bpm?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  weight_kg?: number;
  lab_results?: {
    hemoglobin?: number;
    cholesterol?: number;
    glucose?: number;
    vitamin_d?: number;
  } | Array<{
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
  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState<'auth' | 'ai_setup' | 'data_input' | 'report'>('auth');
  const [healthData, setHealthData] = useState<HealthData>({});
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setCurrentStep('ai_setup');
        // Check if AI config exists in localStorage
        const savedConfig = localStorage.getItem('healthviz_ai_config');
        if (savedConfig) {
          setAIConfig(JSON.parse(savedConfig));
          setCurrentStep('data_input');
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setCurrentStep('ai_setup');
      } else {
        setCurrentStep('auth');
        setAIConfig(null);
        setHealthData({});
        setReportId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAIConfigured = (config: AIConfig) => {
    setAIConfig(config);
    setCurrentStep('data_input');
  };

  const handleDataSubmitted = (data: HealthData) => {
    setHealthData(data);
    setCurrentStep('report');
  };

  const handleReset = () => {
    setHealthData({});
    setReportId(null);
    setCurrentStep('data_input');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HealthViz</h1>
            <p className="text-gray-600">Your AI-powered health report generator</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {currentStep === 'ai_setup' && (
        <div className="container mx-auto px-4 py-8">
          <AIProviderSetup onConfigured={handleAIConfigured} />
        </div>
      )}

      {currentStep === 'data_input' && aiConfig && (
        <div className="container mx-auto px-4 py-8">
          <FileUpload onDataUploaded={handleDataSubmitted} />
        </div>
      )}

      {currentStep === 'report' && aiConfig && (
        <div className="container mx-auto px-4 py-8">
          <HealthReport 
            healthData={healthData} 
            aiConfig={aiConfig} 
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
