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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Rating Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="contest" 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Contest #', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--chart-1))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};