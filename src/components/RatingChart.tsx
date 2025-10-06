import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeforcesRatingChange } from '@/services/codeforcesApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface RatingChartProps {
  ratingHistory: CodeforcesRatingChange[];
}

const getRankTitle = (rating: number): string => {
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2200) return 'Candidate Master';
  if (rating < 2300) return 'Master';
  if (rating < 2400) return 'International Master';
  if (rating < 2600) return 'Grandmaster';
  if (rating < 3000) return 'International Grandmaster';
  return 'Legendary Grandmaster';
};

const getRankColor = (rating: number): string => {
  if (rating < 1200) return 'hsl(var(--cf-newbie))';
  if (rating < 1400) return 'hsl(var(--cf-pupil))';
  if (rating < 1600) return 'hsl(var(--cf-specialist))';
  if (rating < 1900) return 'hsl(var(--cf-expert))';
  if (rating < 2200) return 'hsl(var(--cf-candidate-master))';
  if (rating < 2300) return 'hsl(var(--cf-master))';
  if (rating < 2400) return 'hsl(var(--cf-international-master))';
  if (rating < 2600) return 'hsl(var(--cf-grandmaster))';
  if (rating < 3000) return 'hsl(var(--cf-international-grandmaster))';
  return 'hsl(var(--cf-legendary-grandmaster))';
};

const rankZones = [
  { min: 0, max: 1200, color: 'hsl(var(--cf-newbie))', name: 'Newbie' },
  { min: 1200, max: 1400, color: 'hsl(var(--cf-pupil))', name: 'Pupil' },
  { min: 1400, max: 1600, color: 'hsl(var(--cf-specialist))', name: 'Specialist' },
  { min: 1600, max: 1900, color: 'hsl(var(--cf-expert))', name: 'Expert' },
  { min: 1900, max: 2200, color: 'hsl(var(--cf-candidate-master))', name: 'Candidate Master' },
  { min: 2200, max: 2300, color: 'hsl(var(--cf-master))', name: 'Master' },
  { min: 2300, max: 2400, color: 'hsl(var(--cf-international-master))', name: 'International Master' },
  { min: 2400, max: 2600, color: 'hsl(var(--cf-grandmaster))', name: 'Grandmaster' },
  { min: 2600, max: 3000, color: 'hsl(var(--cf-international-grandmaster))', name: 'International Grandmaster' },
  { min: 3000, max: 4000, color: 'hsl(var(--cf-legendary-grandmaster))', name: 'Legendary Grandmaster' },
];

export const RatingChart: React.FC<RatingChartProps> = ({ ratingHistory }) => {
  const chartData = ratingHistory.map((change, index) => ({
    contest: index + 1,
    rating: change.newRating,
    contestName: change.contestName,
    date: new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    rank: change.rank,
    rankTitle: getRankTitle(change.newRating),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rankColor = getRankColor(data.rating);
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-bold text-lg mb-1" style={{ color: rankColor }}>
            {data.rankTitle}
          </p>
          <p className="font-medium text-foreground">{data.contestName}</p>
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">Rating:</span> <span style={{ color: rankColor }}>{data.rating}</span>
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
        <CardTitle>Codeforces Rating Progression</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Colored rank zones */}
            {rankZones.map((zone, idx) => (
              <ReferenceArea
                key={idx}
                y1={zone.min}
                y2={zone.max}
                fill={zone.color}
                fillOpacity={0.1}
              />
            ))}
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
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-3">Rating Ranks</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {rankZones.map((zone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-xs text-foreground/80">{zone.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};