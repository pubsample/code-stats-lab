export interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

export interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId?: number;
    problemsetName?: string;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId?: number;
    members: Array<{
      handle: string;
      name?: string;
    }>;
    participantType: string;
    ghost: boolean;
    room?: number;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}

export interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

const BASE_URL = 'https://codeforces.com/api';

class CodeforcesAPI {
  async getUserInfo(handle: string): Promise<CodeforcesUser> {
    const response = await fetch(`${BASE_URL}/user.info?handles=${handle}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch user info');
    }
    
    return data.result[0];
  }

  async getUserRating(handle: string): Promise<CodeforcesRatingChange[]> {
    const response = await fetch(`${BASE_URL}/user.rating?handle=${handle}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch user rating');
    }
    
    return data.result;
  }

  async getUserSubmissions(handle: string, from = 1, count = 50): Promise<CodeforcesSubmission[]> {
    const response = await fetch(`${BASE_URL}/user.status?handle=${handle}&from=${from}&count=${count}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch user submissions');
    }
    
    return data.result;
  }

  async getContestList(): Promise<CodeforcesContest[]> {
    const response = await fetch(`${BASE_URL}/contest.list?gym=false`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch contest list');
    }
    
    return data.result;
  }

  getRankColor(rank: string): string {
    const rankColors: Record<string, string> = {
      'newbie': 'cf-newbie',
      'pupil': 'cf-pupil',
      'specialist': 'cf-specialist',
      'expert': 'cf-expert',
      'candidate master': 'cf-candidate-master',
      'master': 'cf-master',
      'international master': 'cf-master',
      'grandmaster': 'cf-grandmaster',
      'international grandmaster': 'cf-grandmaster',
      'legendary grandmaster': 'cf-grandmaster',
    };

    return rankColors[rank?.toLowerCase()] || 'cf-newbie';
  }
}

export const codeforcesApi = new CodeforcesAPI();