import express, { Request, Response, NextFunction } from "express"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.use(cors())
app.use(express.json())

// Error handler middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message })
}

// Communities
app.get("/api/communities", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from("communities").select("*")
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// Games
app.get("/api/games/:communityId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("community_id", req.params.communityId)
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// Competitions
app.get("/api/competitions/:gameId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("game_id", req.params.gameId)
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// Players
app.get("/api/players/:communityId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("community_id", req.params.communityId)
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// Apply error handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

