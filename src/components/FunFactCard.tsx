
import { Card } from "@/components/ui/card";

interface FunFactCardProps {
  fact: {
    metric: string;
    fact: string;
    emoji: string;
  };
}

export const FunFactCard = ({ fact }: FunFactCardProps) => {
  return (
    <Card className="health-card">
      <div className="text-center space-y-3">
        <div className="text-3xl">{fact.emoji}</div>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-primary">{fact.metric}</h4>
          <p className="text-sm text-muted-foreground">{fact.fact}</p>
        </div>
      </div>
    </Card>
  );
};
