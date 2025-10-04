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
      <Card className="md:col-span-2 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
              <AvatarImage src={user.avatar} alt={user.handle} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {user.handle[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {user.handle}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`${rankColorClass} hover:scale-110 transition-transform`}>
                  {user.rank}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="font-semibold text-lg">{user.rating}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">Country</p>
              <p className="font-medium">{user.country || 'Not specified'}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">Organization</p>
              <p className="font-medium">{user.organization || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{user.rating}</div>
          <p className={`text-sm font-medium mt-1 ${rankColorClass}`}>
            {user.rank}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Rating</CardTitle>
          <Trophy className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{user.maxRating}</div>
          <p className={`text-sm font-medium mt-1 ${maxRankColorClass}`}>
            {user.maxRank}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-to-br from-chart-2/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contribution</CardTitle>
          <Users className="h-4 w-4" style={{ color: 'hsl(var(--chart-2))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{user.contribution}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Community points
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-to-br from-chart-3/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered</CardTitle>
          <Calendar className="h-4 w-4" style={{ color: 'hsl(var(--chart-3))' }} />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">{formatDate(user.registrationTimeSeconds)}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Member since
          </p>
        </CardContent>
      </Card>
    </div>
  );
};