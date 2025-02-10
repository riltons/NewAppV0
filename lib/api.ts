import { supabase } from './supabase'
import type { Community, Game, Competition, Player } from '@/types'
import type { Database } from '@/types/supabase'

if (!supabase) {
  throw new Error('Supabase client not initialized')
}

// Communities
export const createCommunity = async (community: Omit<Community, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('communities')
    .insert(community)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Community
}

export const getCommunities = async () => {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Community[]
}

// Games
export const createGame = async (game: Omit<Game, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Game
}

export const getGames = async (communityId: string) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Game[]
}

export const updateGameScore = async (gameId: string, score: [number, number]) => {
  const { data, error } = await supabase
    .from('games')
    .update({ score })
    .eq('id', gameId)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Game
}

// Competitions
export const createCompetition = async (competition: Omit<Competition, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('competitions')
    .insert(competition)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Competition
}

export const getCompetitions = async (gameId: string) => {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('game_id', gameId)
    .order('start_date', { ascending: true })
  if (error) throw error
  return data as unknown as Competition[]
}

export const updateCompetitionStatus = async (id: string, status: Competition['status']) => {
  const { data, error } = await supabase
    .from('competitions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Competition
}

// Players
export const createPlayer = async (player: Omit<Player, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('players')
    .insert(player)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Player
}

export const getPlayers = async (communityId: string) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('community_id', communityId)
    .order('nickname', { ascending: true })
  if (error) throw error
  return data as unknown as Player[]
}

// Profile
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}