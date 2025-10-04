import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeforcesSubmission } from '@/services/codeforcesApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ProblemStatsProps {
  submissions: CodeforcesSubmission[];
}

export const ProblemStats: React.FC<ProblemStatsProps> = ({ submissions }) => {
  // Filter only accepted solutions
  const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'OK');

  // Get unique solved problems
  const solvedProblems = new Map();
  acceptedSubmissions.forEach(sub => {
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (!solvedProblems.has(key)) {
      solvedProblems.set(key, sub.problem);
    }
  });

  const uniqueProblems = Array.from(solvedProblems.values());

  // Tag distribution
  const tagCounts = new Map();
  uniqueProblems.forEach(problem => {
    problem.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const tagData = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Difficulty distribution (rating ranges)
  const difficultyRanges = [
    { name: '800-1000', min: 800, max: 1000, count: 0 },
    { name: '1100-1300', min: 1100, max: 1300, count: 0 },
    { name: '1400-1600', min: 1400, max: 1600, count: 0 },
    { name: '1700-1900', min: 1700, max: 1900, count: 0 },
    { name: '2000-2200', min: 2000, max: 2200, count: 0 },
    { name: '2300+', min: 2300, max: 9999, count: 0 },
  ];

  uniqueProblems.forEach(problem => {
    if (problem.rating) {
      const range = difficultyRanges.find(r => 
        problem.rating >= r.min && problem.rating <= r.max
      );
      if (range) range.count++;
    }
  });

  const difficultyData = difficultyRanges.filter(range => range.count > 0);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Enhanced Tag Distribution - Horizontal Bar Chart */}
      <Card className="md:col-span-2 hover:shadow-glow transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Problems by Tag
            <span className="text-sm font-normal text-muted-foreground">
              (Top 10 most frequent)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tagData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                dataKey="tag" 
                type="category" 
                width={120} 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 8, 8, 0]}
                animationDuration={1000}
              >
                {tagData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Difficulty Distribution - Enhanced Pie Chart */}
      <Card className="hover:shadow-glow transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Problems by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="count"
                animationDuration={1000}
              >
                {difficultyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats with Gradient Cards */}
      <Card className="hover:shadow-glow transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Problem Solving Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-primary mb-1">
                {uniqueProblems.length}
              </div>
              <p className="text-sm text-muted-foreground">Unique Problems</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-accent mb-1">
                {acceptedSubmissions.length}
              </div>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/20 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold" style={{ color: 'hsl(var(--chart-3))' }}>
                {submissions.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-chart-4/10 to-chart-4/5 border border-chart-4/20 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold" style={{ color: 'hsl(var(--chart-4))' }}>
                {((acceptedSubmissions.length / submissions.length) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};