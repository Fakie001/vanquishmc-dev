"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, ExternalLink, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SupportSection() {
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
                <MessageSquare className="w-4 h-4" />
                24/7 Support
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Need Help?</h1>
            <p className="text-lg text-gray-400">We're here to help! Choose your preferred method of contact below.</p>
          </div>
        </div>
      </div>

      <div className="container pb-24 space-y-16">
        {/* Support Options */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Discord Support */}
          <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-lg bg-[#9D74FF]/10">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-m6TztT2NpJ58SAvXEav9M2JNRZmoGY.png"
                alt="Discord"
                className="w-6 h-6"
              />
            </div>
            <h2 className="text-xl font-bold text-white">Discord Support</h2>
            <p className="text-gray-400 flex-1">
              Join our Discord server for immediate assistance from our staff and community.
            </p>
            <Button
              className="w-full bg-[#9D74FF] hover:bg-[#B594FF] text-white"
              onClick={() => window.open("https://discord.gg/yourserver", "_blank")}
            >
              Join Discord
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Email Support */}
          <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-lg bg-[#9D74FF]/10">
              <Mail className="w-6 h-6 text-[#9D74FF]" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Support</h2>
            <p className="text-gray-400 flex-1">
              For business inquiries or specific offers, reach out to us via email.
            </p>
            <Button
              className="w-full bg-[#9D74FF] hover:bg-[#B594FF] text-white"
              onClick={() => (window.location.href = "mailto:contact@vanquishmc.com")}
            >
              contact@vanquishmc.com
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Ticket System */}
          <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-lg bg-[#9D74FF]/10">
              <MessageSquare className="w-6 h-6 text-[#9D74FF]" />
            </div>
            <h2 className="text-xl font-bold text-white">Ticket System</h2>
            <p className="text-gray-400 flex-1">
              Our web-based ticket system is coming soon! Create and track support requests directly through our
              website.
            </p>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 mt-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Support Hours</h2>
            <p className="text-gray-400">
              Our Discord support team is available 24/7 to assist you with any questions or concerns. For email
              inquiries, please allow up to 24-48 hours for a response. We strive to provide the best possible support
              for our community.
            </p>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 pt-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-12">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9D74FF]/10 text-[#9D74FF] text-sm font-medium">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find quick answers to common questions about our support services.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-[#9D74FF]/10">
                <AccordionTrigger className="text-white hover:text-[#9D74FF] hover:no-underline">
                  How quickly can I expect a response on Discord?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Our Discord support team typically responds within minutes during peak hours. For more complex issues,
                  please allow up to a few hours for a thorough response.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-[#9D74FF]/10">
                <AccordionTrigger className="text-white hover:text-[#9D74FF] hover:no-underline">
                  What should I include in my support request?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Please include your Minecraft username, server type (Factions/Prison), a clear description of your
                  issue, and any relevant screenshots or information that might help us assist you better.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-[#9D74FF]/10">
                <AccordionTrigger className="text-white hover:text-[#9D74FF] hover:no-underline">
                  When will the ticket system be available?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Our ticket system is currently in development and will be launched soon. For now, please use our
                  Discord support or email for any assistance you need.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-[#9D74FF]/10">
                <AccordionTrigger className="text-white hover:text-[#9D74FF] hover:no-underline">
                  How do I report a player or bug?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  To report a player or bug, please join our Discord server and use the appropriate report channels. Our
                  moderation team will review your report and take necessary action.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-[#9D74FF]/10">
                <AccordionTrigger className="text-white hover:text-[#9D74FF] hover:no-underline">
                  What if I need business-related support?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  For business inquiries, partnerships, or specific offers, please email us at contact@vanquishmc.com.
                  We aim to respond to business emails within 24-48 hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

