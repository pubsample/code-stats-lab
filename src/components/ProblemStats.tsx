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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Problems by Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs fill-muted-foreground" />
              <YAxis 
                dataKey="tag" 
                type="category" 
                width={80} 
                className="text-xs fill-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Problems by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Problem Solving Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{uniqueProblems.length}</div>
              <p className="text-sm text-muted-foreground">Unique Problems Solved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{acceptedSubmissions.length}</div>
              <p className="text-sm text-muted-foreground">Accepted Submissions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">{submissions.length}</div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">
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