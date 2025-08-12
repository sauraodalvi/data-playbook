
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Heart, 
  Footprints, 
  Moon, 
  Droplets, 
  Scale,
  Zap,
  FileText,
  Upload,
  Plus
} from "lucide-react";
import { HealthData } from "@/pages/Index";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HealthDataInputProps {
  onDataSubmitted: (data: HealthData) => void;
}

export const HealthDataInput = ({ onDataSubmitted }: HealthDataInputProps) => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 8500,
    distance_km: 6.2,
    calories_kcal: 2150,
    sleep_hours: 7.5,
    water_liters: 2.1,
    heart_rate_bpm: 72,
    weight_kg: 70,
    blood_pressure: {
      systolic: 120,
      diastolic: 80
    },
    lab_results: {
      hemoglobin: 14.5,
      cholesterol: 185,
      glucose: 95,
      vitamin_d: 32
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setHealthData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof HealthData],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Store health data in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('health_data')
          .insert({
            user_id: user.id,
            data_type: 'comprehensive',
            source: 'manual',
            data: healthData,
            recorded_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error storing health data:', error);
          toast.error('Failed to store health data');
          return;
        }
      }

      toast.success("Health data submitted successfully!");
      onDataSubmitted(healthData);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit health data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-6">
        <div className="text-center space-y-4 mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Enter Your Health Data</h1>
          <p className="text-gray-600">
            Input your latest health metrics to generate your personalized AI report
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fitness Metrics */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Fitness Metrics</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Footprints className="w-4 h-4" />
                  Daily Steps
                </Label>
                <Input
                  type="number"
                  value={healthData.steps || ''}
                  onChange={(e) => handleInputChange('steps', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 10000"
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Distance (km)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={healthData.distance_km || ''}
                  onChange={(e) => handleInputChange('distance_km', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 5.2"
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Calories Burned
                </Label>
                <Input
                  type="number"
                  value={healthData.calories_kcal || ''}
                  onChange={(e) => handleInputChange('calories_kcal', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 2200"
                />
              </div>
            </div>
          </Card>

          {/* Vital Signs */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-100">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Vital Signs</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Heart Rate (BPM)
                </Label>
                <Input
                  type="number"
                  value={healthData.heart_rate_bpm || ''}
                  onChange={(e) => handleInputChange('heart_rate_bpm', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 72"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Systolic BP</Label>
                  <Input
                    type="number"
                    value={healthData.blood_pressure?.systolic || ''}
                    onChange={(e) => handleNestedInputChange('blood_pressure', 'systolic', parseInt(e.target.value) || 0)}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label>Diastolic BP</Label>
                  <Input
                    type="number"
                    value={healthData.blood_pressure?.diastolic || ''}
                    onChange={(e) => handleNestedInputChange('blood_pressure', 'diastolic', parseInt(e.target.value) || 0)}
                    placeholder="80"
                  />
                </div>
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Weight (kg)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={healthData.weight_kg || ''}
                  onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 70.5"
                />
              </div>
            </div>
          </Card>

          {/* Lifestyle */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-100">
                <Moon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold">Lifestyle</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Sleep Hours
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  value={healthData.sleep_hours || ''}
                  onChange={(e) => handleInputChange('sleep_hours', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 7.5"
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Water Intake (L)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={healthData.water_liters || ''}
                  onChange={(e) => handleInputChange('water_liters', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>
          </Card>

          {/* Lab Results */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Lab Results</h2>
              <Badge variant="secondary">Optional</Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Hemoglobin (g/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={healthData.lab_results?.hemoglobin || ''}
                  onChange={(e) => handleNestedInputChange('lab_results', 'hemoglobin', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 14.5"
                />
              </div>
              
              <div>
                <Label>Total Cholesterol (mg/dL)</Label>
                <Input
                  type="number"
                  value={healthData.lab_results?.cholesterol || ''}
                  onChange={(e) => handleNestedInputChange('lab_results', 'cholesterol', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 180"
                />
              </div>
              
              <div>
                <Label>Glucose (mg/dL)</Label>
                <Input
                  type="number"
                  value={healthData.lab_results?.glucose || ''}
                  onChange={(e) => handleNestedInputChange('lab_results', 'glucose', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 95"
                />
              </div>
              
              <div>
                <Label>Vitamin D (ng/mL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={healthData.lab_results?.vitamin_d || ''}
                  onChange={(e) => handleNestedInputChange('lab_results', 'vitamin_d', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 32"
                />
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? "Generating Report..." : "Generate Health Report"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
