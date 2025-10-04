import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeforcesRatingChange } from '@/services/codeforcesApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingChartProps {
  ratingHistory: CodeforcesRatingChange[];
}

export const RatingChart: React.FC<RatingChartProps> = ({ ratingHistory }) => {
  const chartData = ratingHistory.map((change, index) => ({
    contest: index + 1,
    rating: change.newRating,
    contestName: change.contestName,
    date: new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    rank: change.rank,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="font-medium">{data.contestName}</p>
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <p className="text-sm">
            <span className="font-medium">Rating:</span> {data.rating}
          </p>
          <p className="text-sm">
            <span className="font-medium">Rank:</span> {data.rank}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4 hover:shadow-glow transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Rating Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="contest" 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
              label={{ 
                value: 'Contest #', 
                position: 'insideBottom', 
                offset: -5,
                style: { fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <YAxis 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
              label={{ 
                value: 'Rating', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ 
                fill: 'hsl(var(--chart-1))', 
                strokeWidth: 2, 
                r: 5,
                stroke: 'hsl(var(--background))'
              }}
              activeDot={{ 
                r: 8, 
                stroke: 'hsl(var(--chart-1))', 
                strokeWidth: 3,
                fill: 'hsl(var(--background))',
                filter: 'drop-shadow(0 0 8px hsl(var(--chart-1)))'
              }}
              fill="url(#ratingGradient)"
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};