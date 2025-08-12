
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from "lucide-react";
import { HealthData } from "@/pages/Index";

interface HealthChartsProps {
  healthData: HealthData;
}

export const HealthCharts = ({ healthData }: HealthChartsProps) => {
  // Mock data for demonstration
  const stepsData = [
    { day: 'Mon', steps: healthData.steps ? healthData.steps * 0.8 : 8000 },
    { day: 'Tue', steps: healthData.steps ? healthData.steps * 0.9 : 9000 },
    { day: 'Wed', steps: healthData.steps ? healthData.steps * 1.1 : 11000 },
    { day: 'Thu', steps: healthData.steps ? healthData.steps * 0.7 : 7000 },
    { day: 'Fri', steps: healthData.steps ? healthData.steps * 1.2 : 12000 },
    { day: 'Sat', steps: healthData.steps || 10000 },
    { day: 'Sun', steps: healthData.steps ? healthData.steps * 0.6 : 6000 },
  ];

  const caloriesData = [
    { day: 'Mon', calories: healthData.calories_kcal ? healthData.calories_kcal * 0.9 : 1800 },
    { day: 'Tue', calories: healthData.calories_kcal ? healthData.calories_kcal * 1.1 : 2200 },
    { day: 'Wed', calories: healthData.calories_kcal ? healthData.calories_kcal * 0.8 : 1600 },
    { day: 'Thu', calories: healthData.calories_kcal ? healthData.calories_kcal * 1.2 : 2400 },
    { day: 'Fri', calories: healthData.calories_kcal || 2000 },
    { day: 'Sat', calories: healthData.calories_kcal ? healthData.calories_kcal * 0.7 : 1400 },
    { day: 'Sun', calories: healthData.calories_kcal ? healthData.calories_kcal * 1.0 : 2000 },
  ];

  return (
    <Card className="health-card">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-health">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Weekly Trends</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Steps Chart */}
          <div className="space-y-3">
            <h3 className="font-semibold">Daily Steps</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Calories Chart */}
          <div className="space-y-3">
            <h3 className="font-semibold">Calories Burned</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="hsl(var(--health-good))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
