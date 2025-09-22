import React, { useState } from 'react';
import { UserSearch } from '@/components/UserSearch';
import { UserProfile } from '@/components/UserProfile';
import { RatingChart } from '@/components/RatingChart';
import { ContestHistory } from '@/components/ContestHistory';
import { ProblemStats } from '@/components/ProblemStats';
import { codeforcesApi, CodeforcesUser, CodeforcesRatingChange, CodeforcesSubmission } from '@/services/codeforcesApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Code2, BarChart3 } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<CodeforcesUser | null>(null);
  const [ratingHistory, setRatingHistory] = useState<CodeforcesRatingChange[]>([]);
  const [submissions, setSubmissions] = useState<CodeforcesSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (handle: string) => {
    setLoading(true);
    try {
      // Fetch user info, rating history, and submissions in parallel
      const [userInfo, userRating, userSubmissions] = await Promise.all([
        codeforcesApi.getUserInfo(handle),
        codeforcesApi.getUserRating(handle),
        codeforcesApi.getUserSubmissions(handle, 1, 200)
      ]);

      setUser(userInfo);
      setRatingHistory(userRating);
      setSubmissions(userSubmissions);
      
      toast({
        title: "Success!",
        description: `Loaded data for ${userInfo.handle}`,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch user data",
        variant: "destructive",
      });
      
      // Clear previous data on error
      setUser(null);
      setRatingHistory([]);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Codeforces Analytics</h1>
                <p className="text-muted-foreground">Competitive Programming Dashboard</p>
              </div>
            </div>
            <UserSearch onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading user data...</span>
          </div>
        )}

        {!user && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <BarChart3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Codeforces Analytics</h2>
            <p className="text-muted-foreground max-w-md">
              Enter a Codeforces handle above to view detailed analytics including rating history, 
              contest performance, and problem-solving statistics.
            </p>
          </div>
        )}

        {user && !loading && (
          <div className="space-y-8">
            {/* User Profile Section */}
            <UserProfile user={user} />

            {/* Charts and Analytics */}
            <div className="grid gap-6">
              {ratingHistory.length > 0 && (
                <RatingChart ratingHistory={ratingHistory} />
              )}
              
              {ratingHistory.length > 0 && (
                <ContestHistory ratingHistory={ratingHistory} />
              )}

              {submissions.length > 0 && (
                <ProblemStats submissions={submissions} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>Built with React, TypeScript, and Codeforces API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;