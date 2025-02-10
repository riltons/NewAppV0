"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, UserCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPlayer, getPlayers } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import type { Player } from "@/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function PlayerManager() {
  const { currentCommunity, user } = useApp()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newPlayer, setNewPlayer] = useState({
    nickname: "",
    avatar_url: "",
    user_id: "",
    community_id: ""
  })

  useEffect(() => {
    if (currentCommunity) {
      loadPlayers()
    }
  }, [currentCommunity])

  const loadPlayers = async () => {
    if (!currentCommunity) return
    try {
      const data = await getPlayers(currentCommunity.id)
      setPlayers(data as Player[])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleCreatePlayer = async () => {
    if (!currentCommunity || !user || !newPlayer.nickname.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      await createPlayer({
        ...newPlayer,
        user_id: user.id,
        community_id: currentCommunity.id
      })
      
      await loadPlayers()
      setNewPlayer({
        nickname: "",
        avatar_url: "",
        user_id: "",
        community_id: ""
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este jogador?")) return
    
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      await loadPlayers()
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
              Selecione uma comunidade para gerenciar os jogadores
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mb-6">
          <Input
            type="text"
            placeholder="Apelido do jogador"
            value={newPlayer.nickname}
            onChange={(e) => setNewPlayer(prev => ({ ...prev, nickname: e.target.value }))}
            disabled={loading}
          />
          <Input
            type="url"
            placeholder="URL do avatar (opcional)"
            value={newPlayer.avatar_url}
            onChange={(e) => setNewPlayer(prev => ({ ...prev, avatar_url: e.target.value }))}
            disabled={loading}
          />
          <Button 
            onClick={handleCreatePlayer} 
            disabled={loading || !newPlayer.nickname.trim()}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Jogador
          </Button>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={player.avatar_url || ''} />
                  <AvatarFallback>
                    <UserCircle2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{player.nickname}</span>
              </div>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDeletePlayer(player.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {players.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCircle2 className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhum jogador cadastrado ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

