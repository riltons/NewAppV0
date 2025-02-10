"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type React from "react"
import { useToast } from "@/components/ui/use-toast"

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { setUser } = useApp()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) throw authError
      
      if (data?.user) {
        setUser(data.user)
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        })
      }
    } catch (err: any) {
      console.error('Erro no login:', err)
      setError(err.message === 'Invalid login credentials'
        ? 'Credenciais inválidas'
        : 'Erro ao fazer login. Por favor, tente novamente.')
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao realizar login"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (signUpError) throw signUpError
      
      if (data?.user) {
        setUser(data.user)
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao sistema!"
        })
      }
    } catch (err: any) {
      console.error('Erro no cadastro:', err)
      setError('Erro ao criar conta. Por favor, tente novamente.')
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao criar conta"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Bem-vindo</h2>
          <p className="mt-2 text-gray-600">Entre ou crie sua conta</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Conta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

