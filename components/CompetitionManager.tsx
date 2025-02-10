"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Play, CircleStopIcon as Stop } from "lucide-react"

export function CompetitionManager() {
  const { communities, competitions, addCompetition, startCompetition, endCompetition } = useApp()
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [newCompetitionName, setNewCompetitionName] = useState("")

  const handleCreateCompetition = async () => {
    if (selectedCommunity && newCompetitionName.trim()) {
      const newCompetition = {
        name: newCompetitionName.trim(),
        communityId: selectedCommunity,
        status: "pending",
        players: [],
      }
      await addCompetition(newCompetition)
      setNewCompetitionName("")
    }
  }

  const handleStartCompetition = async (competitionId: string) => {
    await startCompetition(competitionId)
  }

  const handleEndCompetition = async (competitionId: string) => {
    await endCompetition(competitionId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Competições</CardTitle>
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
            placeholder="Nome da nova competição"
            value={newCompetitionName}
            onChange={(e) => setNewCompetitionName(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleCreateCompetition}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar
          </Button>
        </div>
        <ul className="space-y-2">
          {competitions
            .filter((c) => c.communityId === selectedCommunity)
            .map((competition) => (
              <li key={competition.id} className="flex justify-between items-center">
                <span>
                  {competition.name} - {competition.status}
                </span>
                {competition.status === "pending" && (
                  <Button onClick={() => handleStartCompetition(competition.id)}>
                    <Play className="mr-2 h-4 w-4" /> Iniciar
                  </Button>
                )}
                {competition.status === "active" && (
                  <Button onClick={() => handleEndCompetition(competition.id)}>
                    <Stop className="mr-2 h-4 w-4" /> Encerrar
                  </Button>
                )}
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}

