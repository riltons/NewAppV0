"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"

export function PlayerManager() {
  const { communities, addPlayer } = useApp()
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerPhone, setNewPlayerPhone] = useState("")

  const handleAddPlayer = async () => {
    if (selectedCommunity && newPlayerName.trim() && newPlayerPhone.trim()) {
      const newPlayer = {
        name: newPlayerName.trim(),
        phone: newPlayerPhone.trim(),
        communityId: selectedCommunity,
      }
      await addPlayer(newPlayer)
      setNewPlayerName("")
      setNewPlayerPhone("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        <select
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Selecione uma comunidade</option>
          {communities.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="Nome do jogador"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="mr-2"
          />
          <Input
            type="tel"
            placeholder="Telefone"
            value={newPlayerPhone}
            onChange={(e) => setNewPlayerPhone(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleAddPlayer}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
        {selectedCommunity && (
          <ul className="space-y-2">
            {communities
              .find((c) => c.id === selectedCommunity)
              ?.players.map((player) => (
                <li key={player.id} className="flex justify-between items-center">
                  <span>
                    {player.name} - {player.phone}
                  </span>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

