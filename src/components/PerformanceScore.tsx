import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculatePerformanceScore, UserMetrics } from '@/lib/performanceScore';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';

interface PerformanceScoreProps {
  metrics: UserMetrics;
}

export const PerformanceScore: React.FC<PerformanceScoreProps> = ({ metrics }) => {
  const result = calculatePerformanceScore(metrics);
  const { final_score, breakdown, tier, tierColor } = result;

  const metricDetails = [
    { key: 'rating', label: 'Rating', icon: Trophy, value: breakdown.rating },
    { key: 'contests', label: 'Contests', icon: Target, value: breakdown.contests },
    { key: 'frequency', label: 'Frequency', icon: TrendingUp, value: breakdown.frequency },
    { key: 'upsolve', label: 'Upsolve', icon: Zap, value: breakdown.upsolve },
    { key: 'totalProblems', label: 'Problems', icon: Target, value: breakdown.totalProblems },
    { key: 'topics', label: 'Topics', icon: TrendingUp, value: breakdown.topics },
    { key: 'accuracy', label: 'Accuracy', icon: Trophy, value: breakdown.accuracy },
    { key: 'virtual', label: 'Virtual', icon: Zap, value: breakdown.virtual },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Score Card */}
      <Card className="md:col-span-1 border-primary/20 shadow-glow">
        <CardHeader className="text-center pb-4">
          <CardDescription>DSA Performance Score</CardDescription>
          <CardTitle className="text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            {final_score}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: tierColor }}
            />
            <span className="text-sm font-medium" style={{ color: tierColor }}>
              {tier}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={final_score} className="h-3" />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Out of 100
          </p>
        </CardContent>
      </Card>

      {/* Metrics Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Metrics Breakdown
          </CardTitle>
          <CardDescription>Individual metric contributions to your score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {metricDetails.map(({ key, label, icon: Icon, value }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {value.toFixed(1)}
                </div>
                <Progress value={(value / (key === 'rating' ? 25 : key === 'contests' || key === 'totalProblems' ? 15 : key === 'frequency' || key === 'upsolve' || key === 'topics' || key === 'accuracy' ? 10 : 5)) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
