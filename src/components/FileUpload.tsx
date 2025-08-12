
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Database, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { HealthData } from "@/pages/Index";

interface FileUploadProps {
  onDataUploaded: (data: HealthData) => void;
}

export const FileUpload = ({ onDataUploaded }: FileUploadProps) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'manual'>('file');
  const [textData, setTextData] = useState('');
  const [preferences, setPreferences] = useState({
    diet_preference: '',
    goal: '',
    age: '',
    weight: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processFileContent(content, file.type);
    };

    if (file.type === 'application/pdf') {
      toast.info("PDF parsing not yet implemented. Please use manual input for now.");
      return;
    }

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const processFileContent = (content: string, fileType: string) => {
    try {
      let data: HealthData = {};

      if (fileType.includes('json')) {
        data = JSON.parse(content);
      } else if (fileType.includes('csv')) {
        // Simple CSV parsing for demo
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const values = lines[1]?.split(',');
        
        if (headers && values) {
          headers.forEach((header, index) => {
            const key = header.trim().toLowerCase();
            const value = values[index]?.trim();
            
            if (key.includes('step')) data.steps = parseInt(value) || 0;
            if (key.includes('distance')) data.distance_km = parseFloat(value) || 0;
            if (key.includes('calorie')) data.calories_kcal = parseInt(value) || 0;
            if (key.includes('sleep')) data.sleep_hours = parseFloat(value) || 0;
            if (key.includes('water')) data.water_liters = parseFloat(value) || 0;
          });
        }
      }

      // Add preferences
      data.diet_preference = preferences.diet_preference;
      data.goal = preferences.goal;

      toast.success("Data uploaded successfully!");
      onDataUploaded(data);
    } catch (error) {
      toast.error("Failed to parse file content");
      console.error(error);
    }
  };

  const parseManualData = () => {
    try {
      // Simple text parsing for demo
      const data: HealthData = {};
      const lines = textData.toLowerCase().split('\n');

      lines.forEach(line => {
        if (line.includes('steps')) {
          const match = line.match(/(\d+)/);
          if (match) data.steps = parseInt(match[1]);
        }
        if (line.includes('distance')) {
          const match = line.match(/(\d+\.?\d*)/);
          if (match) data.distance_km = parseFloat(match[1]);
        }
        if (line.includes('calorie')) {
          const match = line.match(/(\d+)/);
          if (match) data.calories_kcal = parseInt(match[1]);
        }
        if (line.includes('sleep')) {
          const match = line.match(/(\d+\.?\d*)/);
          if (match) data.sleep_hours = parseFloat(match[1]);
        }
        if (line.includes('water')) {
          const match = line.match(/(\d+\.?\d*)/);
          if (match) data.water_liters = parseFloat(match[1]);
        }
      });

      // Add preferences
      data.diet_preference = preferences.diet_preference;
      data.goal = preferences.goal;

      if (Object.keys(data).length === 0) {
        toast.error("No health data detected. Please check your input format.");
        return;
      }

      toast.success("Data parsed successfully!");
      onDataUploaded(data);
    } catch (error) {
      toast.error("Failed to parse manual data");
      console.error(error);
    }
  };

  const loadSampleData = () => {
    const sampleData: HealthData = {
      steps: 12345,
      distance_km: 8.2,
      calories_kcal: 2150,
      sleep_hours: 7.5,
      water_liters: 2.8,
      lab_results: [
        { parameter: "Hemoglobin", value: 14.2, unit: "g/dL", status: "Normal" },
        { parameter: "Cholesterol", value: 180, unit: "mg/dL", status: "Good" },
        { parameter: "Blood Sugar", value: 95, unit: "mg/dL", status: "Normal" }
      ],
      diet_preference: preferences.diet_preference || "Balanced",
      goal: preferences.goal || "General Wellness"
    };

    toast.success("Sample data loaded!");
    onDataUploaded(sampleData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload method selection */}
      <Card className="health-card">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Upload Your Health Data</h2>
            <p className="text-muted-foreground">Choose how you'd like to input your health information</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <Button
              variant={uploadMethod === 'manual' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('manual')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Manual Input
            </Button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="health-card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Health Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diet">Diet Preference</Label>
              <Select value={preferences.diet_preference} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, diet_preference: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Health Goal</Label>
              <Select value={preferences.goal} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, goal: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="general-wellness">General Wellness</SelectItem>
                  <SelectItem value="stress-reduction">Stress Reduction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* File upload */}
      {uploadMethod === 'file' && (
        <Card className="health-card">
          <div
            {...getRootProps()}
            className={`upload-zone cursor-pointer ${isDragActive ? 'border-primary' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 gradient-health rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your files here' : 'Drag & drop your health data'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, JSON, TXT, and PDF files
                </p>
              </div>
              <Button type="button" variant="outline">
                Choose File
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Manual input */}
      {uploadMethod === 'manual' && (
        <Card className="health-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Paste Your Data</h3>
            </div>
            <Textarea
              placeholder="Paste your health data here. Example:&#10;Steps: 12345&#10;Distance: 8.2 km&#10;Calories: 2150&#10;Sleep: 7.5 hours&#10;Water: 2.8 liters"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={parseManualData} disabled={!textData.trim()}>
              <Database className="w-4 h-4 mr-2" />
              Parse Data
            </Button>
          </div>
        </Card>
      )}

      {/* Sample data button */}
      <div className="text-center">
        <Button onClick={loadSampleData} variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Try with Sample Data
        </Button>
      </div>
    </div>
  );
};
