import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface CartDialogProps {
  open: boolean
  onClose: () => void
}

export function CartDialog({ open, onClose }: CartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0B0D13] border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader className="border-b border-gray-800/50">
          <div className="flex items-center justify-between pr-2">
            <DialogTitle className="text-lg font-medium">Cart</DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-800" onClick={onClose}>
              <X className="h-4 w-4" />
              <VisuallyHidden>Close</VisuallyHidden>
            </Button>
          </div>
        </DialogHeader>
        <div className="min-h-[300px] flex items-center justify-center text-gray-400">Your cart is empty</div>
      </DialogContent>
    </Dialog>
  )
}

