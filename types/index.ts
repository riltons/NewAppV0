export type UserRole = "admin" | "organizer" | "player"

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  game_id: string;
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "finished";
  players: string[];
  created_at: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  community_id: string;
  status: "active" | "finished";
  score: [number, number];
  team1: string[];
  team2: string[];
  created_at: string;
}

export interface Match {
  id: string
  gameId: string
  winner: 1 | 2 | null // 1 for team1, 2 for team2, null for draw
  points: number
  type: "simple" | "carroca" | "la-e-lo" | "cruzada" | "contagem"
}

export interface Player {
  id: string
  user_id: string
  nickname: string
  avatar_url?: string
  community_id: string
  created_at: string
}

