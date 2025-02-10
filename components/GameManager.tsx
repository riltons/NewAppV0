"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export function GameManager() {
  const { competitions, games, addGame, updateGameScore } = useApp()
  const [selectedCompetition, setSelectedCompetition] = useState("")
  const [team1Players, setTeam1Players] = useState(["", ""])
  const [team2Players, setTeam2Players] = useState(["", ""])
  const [gameScore, setGameScore] = useState([0, 0])

  const handleCreateGame = async () => {
    if (selectedCompetition && team1Players.every(Boolean) && team2Players.every(Boolean)) {
      const newGame = {
        competitionId: selectedCompetition,
        team1: team1Players,
        team2: team2Players,
        status: "active",
        score: [0, 0],
      }
      await addGame(newGame)
      setTeam1Players(["", ""])
      setTeam2Players(["", ""])
    }
  }

  const handleUpdateScore = async (gameId: string, newScore: [number, number]) => {
    await updateGameScore(gameId, newScore)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Jogos</CardTitle>
      </CardHeader>
      <CardContent>
        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Selecione uma competição</option>
          {competitions
            .filter((c) => c.status === "active")
            .map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
        </select>
        <div className="mb-4">
          <h4 className="mb-2">Time 1</h4>
          {team1Players.map((player, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Jogador ${index + 1}`}
              value={player}
              onChange={(e) => {
                const newPlayers = [...team1Players]
                newPlayers[index] = e.target.value
                setTeam1Players(newPlayers)
              }}
              className="mb-2"
            />
          ))}
        </div>
        <div className="mb-4">
          <h4 className="mb-2">Time 2</h4>
          {team2Players.map((player, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Jogador ${index + 1}`}
              value={player}
              onChange={(e) => {
                const newPlayers = [...team2Players]
                newPlayers[index] = e.target.value
                setTeam2Players(newPlayers)
              }}
              className="mb-2"
            />
          ))}
        </div>
        <Button onClick={handleCreateGame} className="mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Criar Jogo
        </Button>
        <ul className="space-y-4">
          {games
            .filter((g) => g.competitionId === selectedCompetition && g.status === "active")
            .map((game) => (
              <li key={game.id} className="border p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>
                    {game.team1.join(" & ")} vs {game.team2.join(" & ")}
                  </span>
                  <span>
                    Placar: {game.score[0]} - {game.score[1]}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdateScore(game.id, [game.score[0] + 1, game.score[1]])}>
                    +1 Time 1
                  </Button>
                  <Button onClick={() => handleUpdateScore(game.id, [game.score[0], game.score[1] + 1])}>
                    +1 Time 2
                  </Button>
                  <Button onClick={() => handleUpdateScore(game.id, [6, game.score[1]])}>Vitória Time 1</Button>
                  <Button onClick={() => handleUpdateScore(game.id, [game.score[0], 6])}>Vitória Time 2</Button>
                </div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}

