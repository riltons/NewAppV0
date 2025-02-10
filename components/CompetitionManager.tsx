"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Play, X, Trophy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCompetition, getCompetitions, getGames } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Competition, Game } from "@/types"

export function CompetitionManager() {
  const { currentCommunity } = useApp()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    game_id: "",
    start_date: "",
    end_date: "",
    status: "pending"
  })

  useEffect(() => {
    if (currentCommunity) {
      loadGames()
    }
  }, [currentCommunity])

  useEffect(() => {
    if (selectedGame) {
      loadCompetitions()
    }
  }, [selectedGame])

  const loadGames = async () => {
    if (!currentCommunity) return
    try {
      const data = await getGames(currentCommunity.id)
      setGames(data as Game[])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadCompetitions = async () => {
    if (!selectedGame) return
    setLoading(true)
    try {
      const data = await getCompetitions(selectedGame)
      setCompetitions(data as Competition[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCompetition = async () => {
    if (!selectedGame || !newCompetition.name.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      await createCompetition({
        ...newCompetition,
        game_id: selectedGame,
        players: [],
        status: "pending"
      })
      
      await loadCompetitions()
      setNewCompetition({
        name: "",
        description: "",
        game_id: "",
        start_date: "",
        end_date: "",
        status: "pending"
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta competição?")) return
    
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase
        .from("competitions")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      await loadCompetitions()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!currentCommunity) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Selecione uma comunidade para gerenciar as competições
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Competições</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mb-6">
          <Select
            value={selectedGame}
            onValueChange={setSelectedGame}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um jogo" />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Nome da competição"
            value={newCompetition.name}
            onChange={(e) => setNewCompetition(prev => ({ ...prev, name: e.target.value }))}
            disabled={loading || !selectedGame}
          />
          
          <Input
            type="text"
            placeholder="Descrição da competição (opcional)"
            value={newCompetition.description}
            onChange={(e) => setNewCompetition(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading || !selectedGame}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Data de início"
              value={newCompetition.start_date}
              onChange={(e) => setNewCompetition(prev => ({ ...prev, start_date: e.target.value }))}
              disabled={loading || !selectedGame}
            />
            
            <Input
              type="date"
              placeholder="Data de término"
              value={newCompetition.end_date}
              onChange={(e) => setNewCompetition(prev => ({ ...prev, end_date: e.target.value }))}
              disabled={loading || !selectedGame}
            />
          </div>

          <Button 
            onClick={handleCreateCompetition} 
            disabled={loading || !selectedGame || !newCompetition.name.trim()}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Competição
          </Button>
        </div>

        <div className="space-y-3">
          {competitions.map((competition) => (
            <div key={competition.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{competition.name}</h4>
                {competition.description && (
                  <p className="text-sm text-muted-foreground">{competition.description}</p>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteCompetition(competition.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {competitions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhuma competição cadastrada ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

