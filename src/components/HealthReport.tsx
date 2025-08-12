
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
  Award
} from "lucide-react";
import { toast } from "sonner";

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
}

export const HealthReport = ({ healthData, aiConfig, onReset }: HealthReportProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing with realistic data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData: ProcessedData = {
      metrics: [
        {
          id: 'steps',
          label: 'Daily Steps',
          value: healthData.steps?.toLocaleString() || '0',
          status: getStepsStatus(healthData.steps || 0),
          icon: Footprints,
          description: healthData.steps && healthData.steps > 10000 ? 'Excellent daily activity!' : 'Try to reach 10,000 steps daily'
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
          label: 'Sleep',
          value: `${healthData.sleep_hours || 0} hours`,
          status: getSleepStatus(healthData.sleep_hours || 0),
          icon: Moon,
          description: healthData.sleep_hours && healthData.sleep_hours >= 7 ? 'Optimal sleep duration' : 'Aim for 7-9 hours of sleep'
        },
        {
          id: 'water',
          label: 'Water Intake',
          value: `${healthData.water_liters || 0} L`,
          status: getWaterStatus(healthData.water_liters || 0),
          icon: Droplets,
          description: 'Stay hydrated throughout the day'
        }
      ],
      funFacts: [
        {
          metric: 'Steps',
          fact: `${healthData.steps?.toLocaleString()} steps = climbing the Statue of Liberty ${Math.round((healthData.steps || 0) / 354)} times!`,
          emoji: '🗽'
        },
        {
          metric: 'Distance',
          fact: `${healthData.distance_km} km = running ${Math.round((healthData.distance_km || 0) / 42.2)} marathon(s)!`,
          emoji: '🏃‍♂️'
        },
        {
          metric: 'Calories',
          fact: `${healthData.calories_kcal} calories = ${Math.round((healthData.calories_kcal || 0) / 250)} slices of pizza burned!`,
          emoji: '🍕'
        }
      ],
      workoutPlan: [
        { day: 'Monday', activity: 'Full Body Strength', duration: '45 min', intensity: 'Moderate' },
        { day: 'Tuesday', activity: 'Cardio & Core', duration: '30 min', intensity: 'High' },
        { day: 'Wednesday', activity: 'Yoga & Flexibility', duration: '40 min', intensity: 'Low' },
        { day: 'Thursday', activity: 'Upper Body Strength', duration: '45 min', intensity: 'Moderate' },
        { day: 'Friday', activity: 'HIIT Training', duration: '25 min', intensity: 'High' },
        { day: 'Saturday', activity: 'Outdoor Activity', duration: '60 min', intensity: 'Moderate' },
        { day: 'Sunday', activity: 'Rest & Recovery', duration: '30 min', intensity: 'Low' }
      ],
      dietPlan: [
        {
          day: 'Monday',
          breakfast: 'Oatmeal with berries and nuts',
          lunch: 'Grilled chicken salad with quinoa',
          dinner: 'Baked salmon with roasted vegetables',
          snack: 'Greek yogurt with honey'
        },
        {
          day: 'Tuesday',
          breakfast: 'Avocado toast with eggs',
          lunch: 'Lentil soup with whole grain bread',
          dinner: 'Lean beef stir-fry with brown rice',
          snack: 'Mixed nuts and fruit'
        },
        // Add more days...
      ]
    };

    setProcessedData(mockData);
    setIsGenerating(false);
    toast.success("Health report generated successfully!");
  };

  const getStepsStatus = (steps: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (steps >= 12000) return 'excellent';
    if (steps >= 8000) return 'good';
    if (steps >= 5000) return 'warning';
    return 'critical';
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
    if (hours >= 6) return 'good';
    if (hours >= 5) return 'warning';
    return 'critical';
  };

  const getWaterStatus = (liters: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (liters >= 2.5) return 'excellent';
    if (liters >= 2) return 'good';
    if (liters >= 1.5) return 'warning';
    return 'critical';
  };

  const exportReport = () => {
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Health Report - HealthViz</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .metric { padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 8px; }
              .excellent { background-color: #dcfce7; }
              .good { background-color: #ecfdf5; }
              .warning { background-color: #fefce8; }
              .critical { background-color: #fef2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Your Health Report</h1>
              <p>Generated by HealthViz on ${new Date().toLocaleDateString()}</p>
            </div>
            ${processedData?.metrics.map(metric => `
              <div class="metric ${metric.status}">
                <h3>${metric.label}: ${metric.value}</h3>
                <p>${metric.description}</p>
              </div>
            `).join('')}
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
          text: 'Check out my latest health insights!',
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
        <Card className="health-card">
          <div className="py-12 space-y-6">
            <div className="mx-auto w-20 h-20 gradient-wellness rounded-3xl flex items-center justify-center animate-bounce-gentle">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Generating Your Health Report</h2>
              <p className="text-muted-foreground">
                Our AI is analyzing your data and creating personalized insights...
              </p>
            </div>
            <div className="w-64 mx-auto bg-muted rounded-full h-2">
              <div className="bg-gradient-health h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="health-card">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl gradient-health">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold">Your Health Report</h1>
          </div>
          <p className="text-muted-foreground">
            Generated on {new Date().toLocaleDateString()} using {aiConfig.provider}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={exportReport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
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

      {/* Metrics Bento Grid */}
      <div className="bento-grid">
        {processedData?.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Fun Facts */}
      <Card className="health-card">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Fun Health Facts 🎉</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {processedData?.funFacts.map((fact, index) => (
              <FunFactCard key={index} fact={fact} />
            ))}
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WorkoutPlan plan={processedData?.workoutPlan || []} />
        <DietPlan plan={processedData?.dietPlan || []} />
      </div>

      {/* Charts */}
      <HealthCharts healthData={healthData} />
    </div>
  );
};
