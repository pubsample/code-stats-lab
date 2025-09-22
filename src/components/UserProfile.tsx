import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CodeforcesUser } from '@/services/codeforcesApi';
import { codeforcesApi } from '@/services/codeforcesApi';
import { Users, Trophy, TrendingUp, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: CodeforcesUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const rankColorClass = `text-${codeforcesApi.getRankColor(user.rank)}`;
  const maxRankColorClass = `text-${codeforcesApi.getRankColor(user.maxRank)}`;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.handle} />
              <AvatarFallback>{user.handle[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.handle}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={rankColorClass}>
                  {user.rank}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="font-semibold">{user.rating}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-medium">{user.country || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{user.organization || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.rating}</div>
          <p className={`text-xs ${rankColorClass}`}>
            {user.rank}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Rating</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.maxRating}</div>
          <p className={`text-xs ${maxRankColorClass}`}>
            {user.maxRank}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contribution</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.contribution}</div>
          <p className="text-xs text-muted-foreground">
            Community points
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">{formatDate(user.registrationTimeSeconds)}</div>
          <p className="text-xs text-muted-foreground">
            Member since
          </p>
        </CardContent>
      </Card>
    </div>
  );
};