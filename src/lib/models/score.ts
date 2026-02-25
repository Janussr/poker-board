export interface Score {
  id: number;
  userId: number;
  userName: string;
  points: number;
  createdAt: string;
  totalPoints: number;
}

export interface PlayerScoreDetails {
  userId: number;
  userName: string;
  totalPoints: number;
  entries: Score[];
}


export interface Winner {
  userId: number;
  userName: string;
  winningScore: number;
  winDate: string;
}
