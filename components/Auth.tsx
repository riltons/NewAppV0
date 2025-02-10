"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"
import type React from "react" // Added import for React

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useApp()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      alert(error.message)
    } else if (data?.user) {
      setUser(data.user as any)
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert(error.message)
    } else if (data?.user) {
      setUser(data.user as any)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </Button>
          <Button type="button" onClick={handleSignUp} disabled={loading}>
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  )
}

