import axios from 'axios';

export interface LeetCodeUser {
  username: string;
  avatar: string;
  ranking: number;
  reputation?: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

export interface LeetCodeContestRanking {
  rating: number;
  globalRanking: number;
  attendedContestsCount: number;
  topPercentage: number;
}

export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

class LeetCodeAPI {
  private BASE_URL = 'https://leetcode.com/graphql';

  async getUserProfile(username: string): Promise<{ user: LeetCodeUser; stats: LeetCodeStats }> {
    try {
      const query = {
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                userAvatar
                reputation
              }
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            allQuestionsCount {
              difficulty
              count
            }
          }
        `,
        variables: { username },
      };

      const response = await axios.post(this.BASE_URL, query, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.errors) {
        throw new Error('User not found');
      }

      const matchedUser = response.data.data.matchedUser;
      const allQuestions = response.data.data.allQuestionsCount;

      if (!matchedUser) {
        throw new Error('User not found');
      }

      // Parse submission stats
      const stats = matchedUser.submitStats.acSubmissionNum;
      const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
      const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
      const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
      const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

      const totalQuestions = allQuestions.find((q: any) => q.difficulty === 'All')?.count || 0;

      return {
        user: {
          username: matchedUser.username,
          avatar: matchedUser.profile.userAvatar,
          ranking: matchedUser.profile.ranking,
          reputation: matchedUser.profile.reputation,
        },
        stats: {
          totalSolved,
          totalQuestions,
          easySolved,
          mediumSolved,
          hardSolved,
          acceptanceRate: totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0,
          ranking: matchedUser.profile.ranking,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
      }
      throw error;
    }
  }

  async getUserContestRanking(username: string): Promise<LeetCodeContestRanking | null> {
    try {
      const query = {
        query: `
          query userContestRanking($username: String!) {
            userContestRanking(username: $username) {
              rating
              globalRanking
              attendedContestsCount
              topPercentage
            }
          }
        `,
        variables: { username },
      };

      const response = await axios.post(this.BASE_URL, query, {
        headers: { 'Content-Type': 'application/json' },
      });

      const contestData = response.data.data.userContestRanking;
      
      if (!contestData) {
        return null; // User hasn't participated in contests
      }

      return {
        rating: Math.round(contestData.rating),
        globalRanking: contestData.globalRanking,
        attendedContestsCount: contestData.attendedContestsCount,
        topPercentage: contestData.topPercentage,
      };
    } catch (error) {
      console.warn('Contest ranking not available:', error);
      return null;
    }
  }

  async getRecentSubmissions(username: string, limit: number = 20): Promise<LeetCodeSubmission[]> {
    try {
      const query = {
        query: `
          query recentSubmissions($username: String!, $limit: Int!) {
            recentSubmissionList(username: $username, limit: $limit) {
              title
              titleSlug
              timestamp
              statusDisplay
              lang
            }
          }
        `,
        variables: { username, limit },
      };

      const response = await axios.post(this.BASE_URL, query, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response.data.data.recentSubmissionList || [];
    } catch (error) {
      console.warn('Failed to fetch recent submissions:', error);
      return [];
    }
  }

  getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
    const colors = {
      Easy: 'text-green-500',
      Medium: 'text-yellow-500',
      Hard: 'text-red-500',
    };
    return colors[difficulty] || 'text-muted-foreground';
  }
}

export const leetcodeApi = new LeetCodeAPI();
