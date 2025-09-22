import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeforcesRatingChange } from '@/services/codeforcesApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ContestHistoryProps {
  ratingHistory: CodeforcesRatingChange[];
}

export const ContestHistory: React.FC<ContestHistoryProps> = ({ ratingHistory }) => {
  const recentContests = ratingHistory.slice(-10).reverse();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getRatingChange = (oldRating: number, newRating: number) => {
    const change = newRating - oldRating;
    return change > 0 ? `+${change}` : change.toString();
  };

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Contest History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">Rating Change</TableHead>
              <TableHead className="text-center">New Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentContests.map((contest) => {
              const ratingChange = contest.newRating - contest.oldRating;
              return (
                <TableRow key={contest.contestId}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {contest.contestName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(contest.ratingUpdateTimeSeconds)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      #{contest.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getRatingChangeColor(ratingChange)}>
                      {getRatingChange(contest.oldRating, contest.newRating)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {contest.newRating}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};