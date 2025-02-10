"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, Edit2, Save, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCommunity, getCommunities } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import type { Community } from "@/types"

export function CommunityManager() {
  const { user, currentCommunity, setCurrentCommunity } = useApp()
  const [communities, setCommunities] = useState<Community[]>([])
  const [newCommunityName, setNewCommunityName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadCommunities = async () => {
    try {
      const data = await getCommunities()
      setCommunities(data as Community[])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim() || !user) return
    
    setLoading(true)
    setError("")
    
    try {
      const newCommunity = {
        name: newCommunityName.trim(),
        description: "",
        owner_id: user.id,
        players: []
      }
      
      await createCommunity(newCommunity)
      await loadCommunities()
      setNewCommunityName("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (community: Community) => {
    setEditingId(community.id)
    setEditName(community.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const handleUpdateCommunity = async (id: string) => {
    if (!editName.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      const { data, error } = await supabase
        .from("communities")
        .update({ name: editName.trim() })
        .eq("id", id)
        .select()
        .single()
        
      if (error) throw error
      
      await loadCommunities()
      setEditingId(null)
      setEditName("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCommunity = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta comunidade?")) return
    
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase
        .from("communities")
        .delete()
        .eq("id", id)
        
      if (error) throw error
      
      if (currentCommunity?.id === id) {
        setCurrentCommunity(null)
      }
      
      await loadCommunities()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Comunidades</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Nome da nova comunidade"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleCreateCommunity} disabled={loading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar
          </Button>
        </div>

        <div className="space-y-3">
          {communities.map((community) => (
            <div key={community.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              {editingId === community.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdateCommunity(community.id)}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{community.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit(community)}
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteCommunity(community.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

