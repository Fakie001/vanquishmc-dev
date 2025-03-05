import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Gift } from "lucide-react"
import { useBasket } from "@/contexts/basket-context"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface PackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkg: {
    id: number
    name: string
    description: string
    price: number
    perks?: string[]
    commands?: string[]
    kits?: {
      name: string
      items: string[]
    }[]
  }
}

export function PackageDialog({ open, onOpenChange, pkg }: PackageDialogProps) {
  const { addItem } = useBasket()
  const { user } = useAuth()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0b0f] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            {pkg.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            View details and purchase options for this package
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-[#1a1a1a] border-[#9D74FF]/20 border mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            {pkg.perks && pkg.perks.length > 0 && <TabsTrigger value="perks">Perks</TabsTrigger>}
            {pkg.commands && pkg.commands.length > 0 && <TabsTrigger value="commands">Commands</TabsTrigger>}
            {pkg.kits && pkg.kits.length > 0 && <TabsTrigger value="kits">Kits</TabsTrigger>}
          </TabsList>

          <ScrollArea className="max-h-[50vh] pr-6">
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#9D74FF]/10">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                    <p className="text-xl font-bold text-[#9D74FF] mt-2">${pkg.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {pkg.perks && pkg.perks.length > 0 && (
              <TabsContent value="perks">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Perks:</h3>
                  <ul className="space-y-2">
                    {pkg.perks.map((perk, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            )}

            {pkg.commands && pkg.commands.length > 0 && (
              <TabsContent value="commands">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Commands:</h3>
                  <ul className="space-y-2">
                    {pkg.commands.map((command, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <code className="px-1.5 py-0.5 rounded bg-gray-800 text-purple-400 text-sm">{command}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            )}

            {pkg.kits && pkg.kits.length > 0 && (
              <TabsContent value="kits">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Kits:</h3>
                  {pkg.kits.map((kit, kitIndex) => (
                    <div key={kitIndex} className="mb-4">
                      <h4 className="text-purple-400 font-medium mb-2">{kit.name}</h4>
                      <ul className="space-y-1">
                        {kit.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-300 flex items-start gap-2">
                            <span className="text-purple-400/50 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </ScrollArea>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="text-2xl font-bold text-purple-400">${pkg.price.toFixed(2)}</div>

          <Button
            onClick={() => {
              if (user) {
                addItem(pkg.id.toString(), user.minecraft_username)
              } else {
                // This will trigger a login prompt in the addItem function
                addItem(pkg.id.toString(), "guest")
              }
              onOpenChange(false)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

