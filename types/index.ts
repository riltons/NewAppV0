export type UserRole = "admin" | "organizer" | "player"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  nickname?: string
  roles: UserRole[]
}

export interface Community {
  id: string
  name: string
  adminId: string
  whatsappGroupId?: string
  players: string[] // Array of player IDs
}

export interface Competition {
  id: string
  name: string
  communityId: string
  organizerId: string
  status: "pending" | "active" | "finished"
  players: string[] // Array of player IDs
}

export interface Game {
  id: string
  competitionId: string
  team1: string[] // Array of 2 player IDs
  team2: string[] // Array of 2 player IDs
  status: "pending" | "active" | "finished"
  score: [number, number] // [team1Score, team2Score]
}

export interface Match {
  id: string
  gameId: string
  winner: 1 | 2 | null // 1 for team1, 2 for team2, null for draw
  points: number
  type: "simple" | "carroca" | "la-e-lo" | "cruzada" | "contagem"
}

