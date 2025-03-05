import { Shield, Sword, Trophy, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="container py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Our Server?</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Experience Minecraft like never before with our unique features and community.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Shield className="h-12 w-12" />
          <h3 className="font-bold">Anti-Cheat Protection</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Play fair and square with our advanced anti-cheat system.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center">
          <Sword className="h-12 w-12" />
          <h3 className="font-bold">Custom Plugins</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enjoy unique gameplay mechanics and features.</p>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center">
          <Trophy className="h-12 w-12" />
          <h3 className="font-bold">Regular Events</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Participate in tournaments and special events.</p>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center">
          <Users className="h-12 w-12" />
          <h3 className="font-bold">Active Community</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Join a friendly and helpful player base.</p>
        </div>
      </div>
    </section>
  )
}

