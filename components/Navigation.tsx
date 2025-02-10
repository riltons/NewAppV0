"use client"

import { Home, Users, Trophy, Settings } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

const navItems = [
  { icon: Home, label: "Início" },
  { icon: Users, label: "Comunidades" },
  { icon: Trophy, label: "Competições" },
  { icon: Settings, label: "Configurações" },
]

export default function Navigation() {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <nav className="bg-secondary w-16 flex flex-col items-center py-4">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          className={`p-3 my-2 rounded-full relative ${
            activeItem === index ? "text-primary" : "text-secondary-foreground"
          }`}
          onClick={() => setActiveItem(index)}
        >
          <item.icon size={24} />
          {activeItem === index && (
            <motion.div
              className="absolute inset-0 bg-primary-foreground rounded-full -z-10"
              layoutId="activeBackground"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}

