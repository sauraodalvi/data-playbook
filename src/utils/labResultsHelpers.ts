
import { HealthData } from "@/pages/Index";

// Helper function to safely get lab result values
export const getLabValue = (
  labResults: HealthData['lab_results'],
  key: 'hemoglobin' | 'cholesterol' | 'glucose' | 'vitamin_d'
): number | undefined => {
  if (!labResults) return undefined;
  
  // Check if it's the object structure
  if (!Array.isArray(labResults)) {
    return labResults[key];
  }
  
  // Check if it's the array structure
  const parameterMap: Record<string, string> = {
    hemoglobin: 'hemoglobin',
    cholesterol: 'cholesterol',
    glucose: 'glucose',
    vitamin_d: 'vitamin d'
  };
  
  const result = labResults.find(
    item => item.parameter.toLowerCase().includes(parameterMap[key].toLowerCase())
  );
  
  return result?.value;
};

// Type guard to check if lab_results is object structure
export const isObjectLabResults = (
  labResults: HealthData['lab_results']
): labResults is { hemoglobin?: number; cholesterol?: number; glucose?: number; vitamin_d?: number } => {
  return labResults !== undefined && !Array.isArray(labResults);
};
