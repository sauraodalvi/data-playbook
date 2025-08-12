
import { Card } from "@/components/ui/card";
import { ChefHat } from "lucide-react";

interface DietPlanProps {
  plan: Array<{
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }>;
}

export const DietPlan = ({ plan }: DietPlanProps) => {
  return (
    <Card className="health-card">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-wellness">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">7-Day Diet Plan</h2>
        </div>
        <div className="space-y-4">
          {plan.slice(0, 2).map((day, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">{day.day}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-primary">Breakfast:</span>
                  <p className="text-muted-foreground">{day.breakfast}</p>
                </div>
                <div>
                  <span className="font-medium text-primary">Lunch:</span>
                  <p className="text-muted-foreground">{day.lunch}</p>
                </div>
                <div>
                  <span className="font-medium text-primary">Dinner:</span>
                  <p className="text-muted-foreground">{day.dinner}</p>
                </div>
                <div>
                  <span className="font-medium text-primary">Snack:</span>
                  <p className="text-muted-foreground">{day.snack}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
