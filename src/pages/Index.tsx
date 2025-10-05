import React, { useState } from 'react';
import { UserSearch } from '@/components/UserSearch';
import { UserProfile } from '@/components/UserProfile';
import { RatingChart } from '@/components/RatingChart';
import { ContestHistory } from '@/components/ContestHistory';
import { ProblemStats } from '@/components/ProblemStats';
import { AppSidebar } from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { codeforcesApi, CodeforcesUser, CodeforcesRatingChange, CodeforcesSubmission } from '@/services/codeforcesApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Code2, BarChart3 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {user && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                {user && <SidebarTrigger className="lg:hidden" />}
                <div className="flex items-center gap-3 flex-1">
                  <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2 shadow-glow">
                    <Code2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Codeforces Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      Competitive Programming Dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <div className="max-w-md w-full hidden md:block">
                    <UserSearch onSearch={handleSearch} loading={loading} />
                  </div>
                </div>
              </div>
              <div className="mt-4 md:hidden">
                <UserSearch onSearch={handleSearch} loading={loading} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {loading && (
              <div className="flex items-center justify-center py-12 animate-fade-in">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading user data...</span>
              </div>
            )}

            {!user && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-8 mb-6 animate-scale-in">
                  <BarChart3 className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome to Codeforces Analytics
                </h2>
                <p className="text-muted-foreground max-w-md text-lg">
                  Enter a Codeforces handle above to view detailed analytics including rating history, 
                  contest performance, and problem-solving statistics.
                </p>
              </div>
            )}

            {user && !loading && (
              <div className="space-y-8 animate-fade-in">
                {/* User Profile Section */}
                <section id="overview">
                  <UserProfile user={user} />
                </section>

                {/* Charts and Analytics */}
                <div className="grid gap-6">
                  {ratingHistory.length > 0 && (
                    <section id="rating">
                      <RatingChart ratingHistory={ratingHistory} />
                    </section>
                  )}
                  
                  {ratingHistory.length > 0 && (
                    <section id="contests">
                      <ContestHistory ratingHistory={ratingHistory} />
                    </section>
                  )}

                  {submissions.length > 0 && (
                    <section id="problems">
                      <ProblemStats submissions={submissions} />
                    </section>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/40 bg-card/50 backdrop-blur mt-16">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              <p>Built with React, TypeScript, Tailwind CSS, and Codeforces API</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;