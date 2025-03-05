"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Shield, Users, MessageSquare, Swords, Sparkles, Ban, Scale } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RuleCategory {
  id: string
  title: string
  icon: typeof Shield
  description: string
  rules: {
    id: number
    title: string
    description: string
    severity: "low" | "medium" | "high"
  }[]
}

const RULE_CATEGORIES: RuleCategory[] = [
  {
    id: "general",
    title: "General Rules",
    icon: Shield,
    description: "Basic rules that apply to all players on our server",
    rules: [
      {
        id: 1,
        title: "Respect All Players",
        description:
          "Treat all players with respect. Harassment, discrimination, or toxic behavior will not be tolerated.",
        severity: "high",
      },
      {
        id: 2,
        title: "No Inappropriate Content",
        description: "Keep chat and builds family-friendly. No explicit content, hate speech, or offensive material.",
        severity: "high",
      },
      {
        id: 3,
        title: "No Advertising",
        description: "Do not advertise other servers or services in chat or through private messages.",
        severity: "medium",
      },
    ],
  },
  {
    id: "gameplay",
    title: "Gameplay Rules",
    icon: Swords,
    description: "Rules specific to gameplay and combat",
    rules: [
      {
        id: 4,
        title: "No Cheating",
        description: "Use of hacks, exploits, or any unfair advantage is strictly prohibited.",
        severity: "high",
      },
      {
        id: 5,
        title: "No AFK Farming",
        description: "Automated farming using AFK machines or macros is not allowed.",
        severity: "medium",
      },
      {
        id: 6,
        title: "Respect Game Mechanics",
        description: "Do not exploit bugs or glitches. Report them to staff immediately.",
        severity: "medium",
      },
    ],
  },
  {
    id: "chat",
    title: "Chat Rules",
    icon: MessageSquare,
    description: "Guidelines for communication in game",
    rules: [
      {
        id: 7,
        title: "English Only",
        description: "Please use English in public chat to ensure everyone can understand and participate.",
        severity: "low",
      },
      {
        id: 8,
        title: "No Spam",
        description: "Do not spam chat with repeated messages, excessive caps, or symbols.",
        severity: "medium",
      },
      {
        id: 9,
        title: "No Impersonation",
        description: "Do not impersonate staff members or other players.",
        severity: "high",
      },
    ],
  },
  {
    id: "factions",
    title: "Faction Rules",
    icon: Users,
    description: "Rules specific to faction gameplay",
    rules: [
      {
        id: 10,
        title: "Faction Names",
        description: "Faction names must be appropriate and not offensive.",
        severity: "medium",
      },
      {
        id: 11,
        title: "No Alliance Abuse",
        description: "Excessive alliances to dominate the server are not allowed.",
        severity: "medium",
      },
      {
        id: 12,
        title: "Raid Guidelines",
        description: "Follow proper raiding procedures. No abuse of raid mechanics.",
        severity: "high",
      },
    ],
  },
]

const SEVERITY_STYLES = {
  low: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  medium: {
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  high: {
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    text: "text-red-400",
  },
}

export function RulesSection() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1F1A29]">
          {/* Animated particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#E0628C] rounded-full"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0628C]/10 text-[#E0628C] text-sm font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Scale className="w-4 h-4" />
                Server Guidelines
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Server Rules</h1>
            <p className="text-lg text-gray-400">
              Please follow these rules to ensure a fair and enjoyable experience for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="container pb-24">
        {/* Important Notice */}
        <Card className="mb-8 p-6 bg-[#2A2438] border-[#E0628C]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#E0628C]/10">
              <AlertTriangle className="w-6 h-6 text-[#E0628C]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Important Notice</h2>
              <p className="text-gray-400">
                Breaking these rules may result in temporary or permanent suspension from the server. The severity of
                the punishment will be determined by the staff team based on the violation and its impact on the
                community.
              </p>
            </div>
          </div>
        </Card>

        {/* Rules Categories */}
        <div className="grid gap-8 md:grid-cols-2">
          {RULE_CATEGORIES.map((category) => (
            <Card key={category.id} className="bg-[#2A2438] border-[#9D74FF]/10">
              <div className="p-6 space-y-6">
                {/* Category Header */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#9D74FF]/10">
                    <category.icon className="w-6 h-6 text-[#9D74FF]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </div>

                {/* Rules List */}
                <div className="space-y-4">
                  {category.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        SEVERITY_STYLES[rule.severity].border,
                        SEVERITY_STYLES[rule.severity].bg,
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Ban className={cn("w-5 h-5 mt-0.5", SEVERITY_STYLES[rule.severity].text)} />
                        <div>
                          <h3 className="font-medium text-white mb-1">{rule.title}</h3>
                          <p className="text-sm text-gray-400">{rule.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <Card className="mt-8 p-6 bg-[#2A2438] border-[#9D74FF]/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#9D74FF]/10">
              <Sparkles className="w-6 h-6 text-[#9D74FF]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Need Help?</h2>
              <p className="text-gray-400">
                If you have any questions about the rules or need to report a violation, please contact our staff team
                on Discord. We're here to help maintain a positive gaming environment for everyone.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

