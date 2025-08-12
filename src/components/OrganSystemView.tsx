
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Lungs, 
  Bone, 
  Kidney, 
  Eye,
  Activity,
  Droplets
} from "lucide-react";
import { HealthData } from "@/pages/Index";

interface OrganSystemViewProps {
  healthData: HealthData;
}

interface OrganSystem {
  name: string;
  icon: any;
  color: string;
  parameters: Array<{
    name: string;
    value: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    comment: string;
  }>;
}

export const OrganSystemView = ({ healthData }: OrganSystemViewProps) => {
  const getBloodPressureStatus = (systolic: number, diastolic: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (systolic <= 120 && diastolic <= 80) return 'excellent';
    if (systolic <= 129 && diastolic <= 84) return 'good';
    if (systolic <= 139 || diastolic <= 89) return 'warning';
    return 'critical';
  };

  const getHeartRateStatus = (hr: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (hr >= 60 && hr <= 75) return 'excellent';
    if (hr >= 50 && hr <= 85) return 'good';
    if (hr >= 40 && hr <= 100) return 'warning';
    return 'critical';
  };

  const getCholesterolStatus = (chol: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (chol < 200) return 'excellent';
    if (chol < 240) return 'good';
    if (chol < 280) return 'warning';
    return 'critical';
  };

  const getGlucoseStatus = (glucose: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (glucose >= 70 && glucose <= 100) return 'excellent';
    if (glucose >= 101 && glucose <= 125) return 'good';
    if (glucose >= 126 && glucose <= 140) return 'warning';
    return 'critical';
  };

  const organSystems: OrganSystem[] = [
    {
      name: "Cardiovascular System",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      parameters: [
        {
          name: "Heart Rate",
          value: `${healthData.heart_rate_bpm || 0} BPM`,
          status: healthData.heart_rate_bpm ? getHeartRateStatus(healthData.heart_rate_bpm) : 'warning',
          comment: healthData.heart_rate_bpm ? "Normal resting heart rate" : "No data available"
        },
        {
          name: "Blood Pressure",
          value: `${healthData.blood_pressure?.systolic || 0}/${healthData.blood_pressure?.diastolic || 0} mmHg`,
          status: healthData.blood_pressure ? getBloodPressureStatus(healthData.blood_pressure.systolic, healthData.blood_pressure.diastolic) : 'warning',
          comment: "Optimal blood pressure range"
        },
        {
          name: "Total Cholesterol",
          value: `${healthData.lab_results?.cholesterol || 0} mg/dL`,
          status: healthData.lab_results?.cholesterol ? getCholesterolStatus(healthData.lab_results.cholesterol) : 'warning',
          comment: "Within healthy limits"
        }
      ]
    },
    {
      name: "Metabolic System",
      icon: Activity,
      color: "bg-green-100 text-green-600",
      parameters: [
        {
          name: "Blood Glucose",
          value: `${healthData.lab_results?.glucose || 0} mg/dL`,
          status: healthData.lab_results?.glucose ? getGlucoseStatus(healthData.lab_results.glucose) : 'warning',
          comment: "Fasting glucose levels normal"
        },
        {
          name: "Body Weight",
          value: `${healthData.weight_kg || 0} kg`,
          status: 'good',
          comment: "Maintain current weight"
        },
        {
          name: "Daily Calories",
          value: `${healthData.calories_kcal || 0} kcal`,
          status: (healthData.calories_kcal || 0) > 2000 ? 'excellent' : 'good',
          comment: "Good caloric expenditure"
        }
      ]
    },
    {
      name: "Circulatory System",
      icon: Droplets,
      color: "bg-blue-100 text-blue-600",
      parameters: [
        {
          name: "Hemoglobin",
          value: `${healthData.lab_results?.hemoglobin || 0} g/dL`,
          status: (healthData.lab_results?.hemoglobin || 0) >= 12 ? 'excellent' : 'warning',
          comment: "Normal oxygen-carrying capacity"
        },
        {
          name: "Hydration",
          value: `${healthData.water_liters || 0} L/day`,
          status: (healthData.water_liters || 0) >= 2 ? 'excellent' : 'warning',
          comment: "Adequate daily fluid intake"
        }
      ]
    },
    {
      name: "Musculoskeletal System",
      icon: Bone,
      color: "bg-purple-100 text-purple-600",
      parameters: [
        {
          name: "Physical Activity",
          value: `${healthData.steps || 0} steps`,
          status: (healthData.steps || 0) >= 8000 ? 'excellent' : 'good',
          comment: "Active lifestyle maintained"
        },
        {
          name: "Vitamin D",
          value: `${healthData.lab_results?.vitamin_d || 0} ng/mL`,
          status: (healthData.lab_results?.vitamin_d || 0) >= 30 ? 'excellent' : 'warning',
          comment: "Supports bone health"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Health Parameters by Organ System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {organSystems.map((system, index) => {
          const IconComponent = system.icon;
          
          return (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${system.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{system.name}</h3>
                </div>
                
                <div className="space-y-3">
                  {system.parameters.map((param, paramIndex) => (
                    <div key={paramIndex} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{param.name}</h4>
                        <Badge variant={getStatusBadgeVariant(param.status)}>
                          {param.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{param.value}</span>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(param.status)}`}></div>
                      </div>
                      <p className="text-sm text-gray-600">{param.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
