import { Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Domino Manager</h1>
      <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
        <Bell />
      </button>
    </header>
  )
}

