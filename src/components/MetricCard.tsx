
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  metric: {
    id: string;
    label: string;
    value: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    icon: LucideIcon;
    description: string;
  };
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-health-excellent';
      case 'good': return 'bg-health-good';
      case 'warning': return 'bg-health-warning';
      case 'critical': return 'bg-health-critical';
      default: return 'bg-muted';
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

  const IconComponent = metric.icon;

  return (
    <Card className="health-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${getStatusColor(metric.status)}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <Badge variant={getStatusBadgeVariant(metric.status)}>
            {metric.status}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{metric.label}</p>
          <p className="text-2xl font-bold">{metric.value}</p>
        </div>
        <p className="text-sm text-muted-foreground">{metric.description}</p>
      </div>
    </Card>
  );
};
