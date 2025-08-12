
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

interface WorkoutPlanProps {
  plan: Array<{
    day: string;
    activity: string;
    duration: string;
    intensity: string;
  }>;
}

export const WorkoutPlan = ({ plan }: WorkoutPlanProps) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="health-card">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-health">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">7-Day Workout Plan</h2>
        </div>
        <div className="space-y-3">
          {plan.map((workout, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{workout.day}</h3>
                <Badge variant={getIntensityColor(workout.intensity)}>
                  {workout.intensity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{workout.activity}</p>
              <p className="text-xs text-muted-foreground">{workout.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
