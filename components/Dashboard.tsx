"use client"
import { useApp } from "@/contexts/AppContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  const { communities, competitions, games } = useApp()

  const activeCommunities = communities.length
  const activeCompetitions = competitions.filter((c) => c.status === "active").length
  const totalPlayers = communities.reduce((acc, community) => acc + community.players.length, 0)
  const totalGames = games.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Comunidades Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{activeCommunities}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Competições Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{activeCompetitions}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total de Jogadores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalPlayers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total de Jogos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalGames}</p>
        </CardContent>
      </Card>
    </div>
  )
}

