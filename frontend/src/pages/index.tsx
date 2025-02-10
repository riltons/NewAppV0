"use client"

import { useEffect, useState } from "react"
import { supabase } from "../utils/supabaseClient"
import { useOfflineSync } from "../hooks/useOfflineSync"

export default function Home() {
  const [communities, setCommunities] = useState([])
  const { isOnline, saveOfflineData } = useOfflineSync()

  useEffect(() => {
    fetchCommunities()
  }, [])

  async function fetchCommunities() {
    const { data, error } = await supabase.from("communities").select("*")
    if (error) {
      console.error("Error fetching communities:", error)
    } else {
      setCommunities(data)
    }
  }

  return (
    <div>
      <h1>Domino Manager</h1>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
    </div>
  )
}

