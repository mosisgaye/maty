
import React from 'react';
import { User, Award, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ExpertInsightProps {
  operatorName: string;
  productType: 'forfait' | 'box' | 'téléphone';
  insight: string;
  expertName?: string;
  expertTitle?: string;
  className?: string;
}

const ExpertInsight: React.FC<ExpertInsightProps> = ({
  operatorName,
  productType,
  insight,
  expertName = "Alexandre Martin",
  expertTitle = "Expert Télécom",
  className
}) => {
  return (
    <Card className={`border-primary/20 ${className || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Avis d'expert
          </CardTitle>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> Recommandé
          </span>
        </div>
        <CardDescription>
          Pourquoi cette offre {operatorName} est intéressante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 relative w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full overflow-hidden flex items-center justify-center">
            <User className="h-8 w-8 text-primary/70" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{insight}</p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{expertName}</span>
              <span className="text-xs text-muted-foreground">{expertTitle}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertInsight;
