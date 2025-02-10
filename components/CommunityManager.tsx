"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"

export function CommunityManager() {
  const { communities, addCommunity, user } = useApp()
  const [newCommunityName, setNewCommunityName] = useState("")

  const handleCreateCommunity = async () => {
    if (newCommunityName.trim() && user) {
      const newCommunity = {
        name: newCommunityName.trim(),
        adminId: user.id,
        players: [],
      }
      await addCommunity(newCommunity)
      setNewCommunityName("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Comunidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="Nome da nova comunidade"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleCreateCommunity}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar
          </Button>
        </div>
        <ul className="space-y-2">
          {communities.map((community) => (
            <li key={community.id} className="flex justify-between items-center">
              <span>{community.name}</span>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

