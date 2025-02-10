import express from "express"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

app.get("/api/communities", async (req, res) => {
  const { data, error } = await supabase.from("communities").select("*")
  if (error) {
    res.status(500).json({ error: error.message })
  } else {
    res.json(data)
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

