import { Users, Swords, Trophy, Timer } from "lucide-react"

export function StatsSection() {
  return (
    <div className="py-24 bg-black/95">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <Users className="h-8 w-8 mx-auto text-red-500" />
            <h4 className="text-2xl font-bold text-gray-200">1000+</h4>
            <p className="text-sm text-gray-400">Active Players</p>
          </div>
          <div className="space-y-2">
            <Swords className="h-8 w-8 mx-auto text-red-500" />
            <h4 className="text-2xl font-bold text-gray-200">50+</h4>
            <p className="text-sm text-gray-400">Active Factions</p>
          </div>
          <div className="space-y-2">
            <Trophy className="h-8 w-8 mx-auto text-red-500" />
            <h4 className="text-2xl font-bold text-gray-200">$10,000</h4>
            <p className="text-sm text-gray-400">Monthly Prizes</p>
          </div>
          <div className="space-y-2">
            <Timer className="h-8 w-8 mx-auto text-red-500" />
            <h4 className="text-2xl font-bold text-gray-200">99.9%</h4>
            <p className="text-sm text-gray-400">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  )
}

