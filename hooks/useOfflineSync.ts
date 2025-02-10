"use client"

import { useState, useEffect, useCallback } from "react"
import { openDB, type IDBPDatabase } from "idb"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const DB_NAME = "DominoManagerDB"
const STORE_NAME = "offlineData"

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
    },
  })
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [db, setDB] = useState<IDBPDatabase | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    initDB().then(setDB)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const saveOfflineData = useCallback(
    async (data: any) => {
      if (!db) return

      await db.add(STORE_NAME, data)
    },
    [db],
  )

  const syncOfflineData = useCallback(async () => {
    if (!db || !isOnline || !isSupabaseConfigured || !supabase) return

    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    const offlineData = await store.getAll()

    for (const data of offlineData) {
      try {
        await supabase.from(data.table).upsert(data.payload)
        await store.delete(data.id)
      } catch (error) {
        console.error("Error syncing data:", error)
      }
    }

    await tx.done
  }, [db, isOnline])

  useEffect(() => {
    if (isOnline) {
      syncOfflineData()
    }
  }, [isOnline, syncOfflineData])

  return { isOnline, saveOfflineData }
}

