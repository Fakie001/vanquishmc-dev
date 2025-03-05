"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Gift, Timer, Star, Sparkles, Trophy, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VoteSite {
  id: number
  name: string
  url: string
  cooldown: string
  votes: number
}

interface Reward {
  id: number
  name: string
  icon: typeof Star
  description: string
  votesRequired: number
  isSpecial?: boolean
}

const VOTE_SITES: VoteSite[] = [
  {
    id: 1,
    name: "MinecraftMP",
    url: "https://minecraft-mp.com/server/yourserver",
    cooldown: "24 hours",
    votes: 1,
  },
  {
    id: 2,
    name: "PlanetMinecraft",
    url: "https://www.planetminecraft.com/server/yourserver",
    cooldown: "24 hours",
    votes: 1,
  },
  {
    id: 3,
    name: "Minecraft-Server.net",
    url: "https://minecraft-server.net/vote/yourserver",
    cooldown: "24 hours",
    votes: 1,
  },
  {
    id: 4,
    name: "TopG",
    url: "https://topg.org/minecraft-servers/server-yourserver",
    cooldown: "24 hours",
    votes: 2,
  },
]

const REWARDS: Reward[] = [
  {
    id: 1,
    name: "Vote Key",
    icon: Star,
    description: "Receive a special key to unlock vote crates",
    votesRequired: 1,
  },
  {
    id: 2,
    name: "Money Booster",
    icon: Flame,
    description: "2x Money for 1 hour",
    votesRequired: 3,
  },
  {
    id: 3,
    name: "Mystery Box",
    icon: Gift,
    description: "Contains random valuable items",
    votesRequired: 5,
  },
  {
    id: 4,
    name: "Weekly Voter",
    icon: Trophy,
    description: "Special tag and exclusive rewards",
    votesRequired: 7,
    isSpecial: true,
  },
]

export function VoteSection() {
  const [totalVotes, setTotalVotes] = useState(0)
  const [votedSites, setVotedSites] = useState<number[]>([])

  const handleVote = (siteId: number) => {
    if (!votedSites.includes(siteId)) {
      setVotedSites([...votedSites, siteId])
      const site = VOTE_SITES.find((s) => s.id === siteId)
      if (site) {
        setTotalVotes((prev) => prev + site.votes)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F1A29] to-[#2A2438]">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F1A29]/80 via-[#2A2438]/60 to-[#1F1A29]/40">
          {/* Animated particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#9D74FF] rounded-full"
              animate={{
                y: [-20, -100],
                x: Math.random() * 20 - 10,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative container">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9D74FF]/10 text-[#9D74FF] text-sm font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="w-4 h-4" />
                Vote Daily for Amazing Rewards
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Support Our Server</h1>
            <p className="text-lg text-gray-400">
              Vote daily to earn exclusive rewards and help us grow. The more you vote, the better the rewards!
            </p>
          </div>
        </div>
      </div>

      <div className="container pb-24 space-y-16">
        {/* Voting Sites */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-[#9D74FF]" />
            Voting Sites
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VOTE_SITES.map((site) => (
              <Card
                key={site.id}
                className={cn(
                  "bg-[#2A2438] border-[#9D74FF]/10 hover:border-[#9D74FF]/50 transition-all group",
                  votedSites.includes(site.id) && "opacity-75",
                )}
              >
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 flex items-center justify-between"
                  onClick={() => handleVote(site.id)}
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#9D74FF] transition-colors">
                      {site.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Timer className="w-4 h-4 mr-2" />
                      {site.cooldown}
                    </div>
                  </div>
                  <Button
                    className={cn(
                      "bg-[#9D74FF] hover:bg-[#B594FF] text-white border-none",
                      votedSites.includes(site.id) && "bg-green-500 border-green-500/20 text-white",
                    )}
                  >
                    {votedSites.includes(site.id) ? (
                      "Voted"
                    ) : (
                      <>
                        Vote Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#9D74FF]" />
            Vote Rewards
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REWARDS.map((reward) => (
              <Card
                key={reward.id}
                className={cn(
                  "bg-[#2A2438] border-[#9D74FF]/10 relative group overflow-hidden",
                  reward.isSpecial && "border-[#9D74FF]/30",
                )}
              >
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      reward.isSpecial ? "bg-[#9D74FF]/10" : "bg-[#9D74FF]/10",
                    )}
                  >
                    <reward.icon className={cn("w-8 h-8", reward.isSpecial ? "text-[#9D74FF]" : "text-[#9D74FF]")} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{reward.name}</h3>
                    <p className="text-sm text-gray-400">{reward.description}</p>
                  </div>
                  <div className={cn("text-sm font-medium", reward.isSpecial ? "text-[#9D74FF]" : "text-[#9D74FF]")}>
                    {reward.votesRequired} Vote{reward.votesRequired > 1 ? "s" : ""} Required
                  </div>
                </div>
                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1F1A29]">
                  <div
                    className={cn("h-full transition-all", reward.isSpecial ? "bg-[#9D74FF]" : "bg-[#9D74FF]")}
                    style={{
                      width: `${Math.min((totalVotes / reward.votesRequired) * 100, 100)}%`,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

