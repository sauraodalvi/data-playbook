
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HealthData, AIConfig } from "@/pages/Index";
import { MetricCard } from "@/components/MetricCard";
import { FunFactCard } from "@/components/FunFactCard";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import { DietPlan } from "@/components/DietPlan";
import { HealthCharts } from "@/components/HealthCharts";
import { OrganSystemView } from "@/components/OrganSystemView";
import { ChatPanel } from "@/components/ChatPanel";
import { 
  Download, 
  Share2, 
  RefreshCw, 
  Sparkles, 
  Activity,
  Heart,
  Footprints,
  Flame,
  Moon,
  Droplets,
  Award,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HealthReportProps {
  healthData: HealthData;
  aiConfig: AIConfig;
  onReset: () => void;
}

interface ProcessedData {
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    icon: any;
    description: string;
  }>;
  funFacts: Array<{
    metric: string;
    fact: string;
    emoji: string;
  }>;
  workoutPlan: Array<{
    day: string;
    activity: string;
    duration: string;
    intensity: string;
  }>;
  dietPlan: Array<{
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }>;
  summary: {
    overall: string;
    cardiovascular: string;
    metabolic: string;
    lifestyle: string;
  };
}

export const HealthReport = ({ healthData, aiConfig, onReset }: HealthReportProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate comprehensive health insights
    const mockData: ProcessedData = {
      metrics: [
        {
          id: 'steps',
          label: 'Daily Steps',
          value: healthData.steps?.toLocaleString() || '0',
          status: getStepsStatus(healthData.steps || 0),
          icon: Footprints,
          description: getStepsDescription(healthData.steps || 0)
        },
        {
          id: 'distance',
          label: 'Distance',
          value: `${healthData.distance_km || 0} km`,
          status: getDistanceStatus(healthData.distance_km || 0),
          icon: Activity,
          description: 'Great distance covered today'
        },
        {
          id: 'calories',
          label: 'Calories Burned',
          value: `${healthData.calories_kcal?.toLocaleString() || 0} kcal`,
          status: getCaloriesStatus(healthData.calories_kcal || 0),
          icon: Flame,
          description: 'Good calorie burn for the day'
        },
        {
          id: 'sleep',
          label: 'Sleep Quality',
          value: `${healthData.sleep_hours || 0} hours`,
          status: getSleepStatus(healthData.sleep_hours || 0),
          icon: Moon,
          description: getSleepDescription(healthData.sleep_hours || 0)
        },
        {
          id: 'water',
          label: 'Hydration',
          value: `${healthData.water_liters || 0} L`,
          status: getWaterStatus(healthData.water_liters || 0),
          icon: Droplets,
          description: 'Stay hydrated throughout the day'
        },
        {
          id: 'heart',
          label: 'Heart Rate',
          value: `${healthData.heart_rate_bpm || 0} BPM`,
          status: getHeartRateStatus(healthData.heart_rate_bpm || 0),
          icon: Heart,
          description: 'Resting heart rate indicator'
        }
      ],
      funFacts: generateFunFacts(healthData),
      workoutPlan: generateWorkoutPlan(healthData),
      dietPlan: generateDietPlan(healthData),
      summary: generateHealthSummary(healthData)
    };

    // Store report in database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('health_reports')
          .insert({
            user_id: user.id,
            title: `Health Report - ${new Date().toLocaleDateString()}`,
            ai_provider: aiConfig.provider,
            ai_model: getAIModelName(aiConfig.provider),
            report_data: { healthData, processedData: mockData }
          })
          .select()
          .single();

        if (error) {
          console.error('Error storing report:', error);
        } else {
          setReportId(data.id);
        }
      }
    } catch (error) {
      console.error('Error storing report:', error);
    }

    setProcessedData(mockData);
    setIsGenerating(false);
    toast.success("Health report generated successfully!");
  };

  // Helper functions for status determination
  const getStepsStatus = (steps: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (steps >= 12000) return 'excellent';
    if (steps >= 8000) return 'good';
    if (steps >= 5000) return 'warning';
    return 'critical';
  };

  const getStepsDescription = (steps: number): string => {
    if (steps >= 12000) return 'Excellent daily activity level!';
    if (steps >= 8000) return 'Good activity, try to reach 10,000 steps';
    if (steps >= 5000) return 'Moderate activity, increase gradually';
    return 'Low activity level, start with short walks';
  };

  const getDistanceStatus = (distance: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (distance >= 8) return 'excellent';
    if (distance >= 5) return 'good';
    if (distance >= 2) return 'warning';
    return 'critical';
  };

  const getCaloriesStatus = (calories: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (calories >= 2500) return 'excellent';
    if (calories >= 2000) return 'good';
    if (calories >= 1500) return 'warning';
    return 'critical';
  };

  const getSleepStatus = (hours: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (hours >= 7 && hours <= 9) return 'excellent';
    if (hours >= 6 && hours <= 10) return 'good';
    if (hours >= 5) return 'warning';
    return 'critical';
  };

  const getSleepDescription = (hours: number): string => {
    if (hours >= 7 && hours <= 9) return 'Optimal sleep duration for recovery';
    if (hours >= 6) return 'Good sleep, aim for 7-9 hours';
    return 'Insufficient sleep affects health and performance';
  };

  const getWaterStatus = (liters: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (liters >= 2.5) return 'excellent';
    if (liters >= 2) return 'good';
    if (liters >= 1.5) return 'warning';
    return 'critical';
  };

  const getHeartRateStatus = (hr: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (hr >= 60 && hr <= 75) return 'excellent';
    if (hr >= 50 && hr <= 85) return 'good';
    if (hr >= 40 && hr <= 100) return 'warning';
    return 'critical';
  };

  const generateFunFacts = (data: HealthData) => [
    {
      metric: 'Steps',
      fact: `${data.steps?.toLocaleString()} steps = climbing ${Math.round((data.steps || 0) / 354)} Statue of Liberty monuments!`,
      emoji: '🗽'
    },
    {
      metric: 'Distance',
      fact: `${data.distance_km} km = running ${Math.round((data.distance_km || 0) / 42.2 * 100) / 100} marathon distances!`,
      emoji: '🏃‍♂️'
    },
    {
      metric: 'Calories',
      fact: `${data.calories_kcal} calories = energy to power a smartphone for ${Math.round((data.calories_kcal || 0) / 10)} hours!`,
      emoji: '📱'
    }
  ];

  const generateWorkoutPlan = (data: HealthData) => {
    const baseIntensity = (data.steps || 0) > 8000 ? 'Moderate' : 'Low';
    
    return [
      { day: 'Monday', activity: 'Full Body Strength Training', duration: '45 min', intensity: baseIntensity },
      { day: 'Tuesday', activity: 'Cardio & Core Workout', duration: '30 min', intensity: 'High' },
      { day: 'Wednesday', activity: 'Yoga & Flexibility', duration: '40 min', intensity: 'Low' },
      { day: 'Thursday', activity: 'Upper Body Strength', duration: '45 min', intensity: baseIntensity },
      { day: 'Friday', activity: 'HIIT Training', duration: '25 min', intensity: 'High' },
      { day: 'Saturday', activity: 'Outdoor Activity', duration: '60 min', intensity: baseIntensity },
      { day: 'Sunday', activity: 'Active Recovery', duration: '30 min', intensity: 'Low' }
    ];
  };

  const generateDietPlan = (data: HealthData) => [
    {
      day: 'Monday',
      breakfast: 'Greek yogurt with berries and granola',
      lunch: 'Quinoa salad with grilled chicken',
      dinner: 'Baked salmon with roasted vegetables',
      snack: 'Apple with almond butter'
    },
    {
      day: 'Tuesday',
      breakfast: 'Oatmeal with banana and nuts',
      lunch: 'Turkey and avocado wrap',
      dinner: 'Lentil curry with brown rice',
      snack: 'Mixed nuts and dried fruit'
    }
  ];

  const generateHealthSummary = (data: HealthData) => ({
    overall: `Your overall health metrics show ${(data.steps || 0) > 8000 ? 'excellent' : 'moderate'} activity levels with ${(data.sleep_hours || 0) >= 7 ? 'good' : 'suboptimal'} sleep patterns. Continue focusing on consistent healthy habits.`,
    cardiovascular: `Heart rate of ${data.heart_rate_bpm || 0} BPM and blood pressure ${data.blood_pressure?.systolic || 0}/${data.blood_pressure?.diastolic || 0} indicate ${(data.heart_rate_bpm || 0) < 80 ? 'good' : 'elevated'} cardiovascular health.`,
    metabolic: `Blood glucose at ${data.lab_results?.glucose || 0} mg/dL and cholesterol at ${data.lab_results?.cholesterol || 0} mg/dL show ${(data.lab_results?.glucose || 0) < 100 ? 'excellent' : 'concerning'} metabolic function.`,
    lifestyle: `With ${data.water_liters || 0}L daily water intake and ${data.sleep_hours || 0} hours of sleep, your lifestyle habits ${(data.water_liters || 0) >= 2 && (data.sleep_hours || 0) >= 7 ? 'support' : 'could better support'} optimal health.`
  });

  const getAIModelName = (provider: string) => {
    const models = {
      'openai': 'GPT-4',
      'gemini': 'Gemini Pro',
      'grok': 'Grok-2',
      'deepseek': 'DeepSeek-V2',
      'qwen': 'Qwen-Max'
    };
    return models[provider as keyof typeof models] || provider;
  };

  const exportReport = () => {
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Health Report - HealthViz</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
              .metric { padding: 15px; border: 1px solid #ddd; margin: 10px 0; border-radius: 8px; }
              .excellent { background-color: #dcfce7; border-color: #22c55e; }
              .good { background-color: #dbeafe; border-color: #3b82f6; }
              .warning { background-color: #fefce8; border-color: #eab308; }
              .critical { background-color: #fef2f2; border-color: #ef4444; }
              .summary { background-color: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .disclaimer { background-color: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border: 1px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Your Comprehensive Health Report</h1>
              <p>Generated by HealthViz on ${new Date().toLocaleDateString()}</p>
              <p>AI Model: ${getAIModelName(aiConfig.provider)}</p>
            </div>
            
            <div class="summary">
              <h2>Health Summary</h2>
              <p><strong>Overall:</strong> ${processedData?.summary.overall}</p>
              <p><strong>Cardiovascular:</strong> ${processedData?.summary.cardiovascular}</p>
              <p><strong>Metabolic:</strong> ${processedData?.summary.metabolic}</p>
              <p><strong>Lifestyle:</strong> ${processedData?.summary.lifestyle}</p>
            </div>
            
            <h2>Key Health Metrics</h2>
            ${processedData?.metrics.map(metric => `
              <div class="metric ${metric.status}">
                <h3>${metric.label}: ${metric.value}</h3>
                <p><strong>Status:</strong> ${metric.status.toUpperCase()}</p>
                <p>${metric.description}</p>
              </div>
            `).join('')}
            
            <div class="disclaimer">
              <strong>Disclaimer:</strong> This report is AI-generated and for informational purposes only. 
              For any specific medical concerns, please consult a licensed healthcare professional.
            </div>
          </body>
        </html>
      `);
      reportWindow.document.close();
    }
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Report - HealthViz',
          text: 'Check out my latest health insights generated by AI!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Report link copied to clipboard!");
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <Card className="p-12">
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl flex items-center justify-center animate-bounce">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Generating Your Health Report</h2>
              <p className="text-gray-600">
                Our AI ({getAIModelName(aiConfig.provider)}) is analyzing your data and creating personalized insights...
              </p>
            </div>
            <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Your Comprehensive Health Report</h1>
          </div>
          <p className="text-gray-600">
            Generated on {new Date().toLocaleDateString()} using {getAIModelName(aiConfig.provider)}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={exportReport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button onClick={shareReport} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={onReset} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Health Summary */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">AI Health Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-blue-600">Overall Health</h3>
              <p className="text-sm text-gray-700">{processedData?.summary.overall}</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-600">Cardiovascular System</h3>
              <p className="text-sm text-gray-700">{processedData?.summary.cardiovascular}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-green-600">Metabolic Function</h3>
              <p className="text-sm text-gray-700">{processedData?.summary.metabolic}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-600">Lifestyle Factors</h3>
              <p className="text-sm text-gray-700">{processedData?.summary.lifestyle}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedData?.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Organ System View */}
      <OrganSystemView healthData={healthData} />

      {/* Charts and Trends */}
      <HealthCharts healthData={healthData} />

      {/* Fun Facts */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Fun Health Facts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processedData?.funFacts.map((fact, index) => (
            <FunFactCard key={index} fact={fact} />
          ))}
        </div>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WorkoutPlan plan={processedData?.workoutPlan || []} />
        <DietPlan plan={processedData?.dietPlan || []} />
      </div>

      {/* Disclaimer */}
      <Card className="p-6 border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This report is AI-generated and provided for informational purposes only. 
              The analysis is based on the data you provided and should not replace professional medical advice. 
              For any specific health concerns, questions about medications, or before making significant 
              changes to your diet or exercise routine, please consult with a licensed healthcare professional.
            </p>
          </div>
        </div>
      </Card>

      {/* Chat Panel */}
      {reportId && (
        <ChatPanel 
          healthData={healthData} 
          reportId={reportId} 
          aiProvider={getAIModelName(aiConfig.provider)}
        />
      )}
    </div>
  );
};
