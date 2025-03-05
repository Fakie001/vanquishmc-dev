import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface PackageVariablesDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (variables: Record<string, string>) => void
  variables: Array<{ identifier: string; name: string }>
}

export function PackageVariablesDialog({ open, onClose, onSubmit, variables }: PackageVariablesDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A2438] border-[#9D74FF]/10">
        <DialogHeader>
          <DialogTitle className="text-white">Additional Information Required</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {variables.map((variable) => (
            <div key={variable.identifier} className="space-y-2">
              <label htmlFor={variable.identifier} className="text-sm text-gray-200">
                {variable.name}
              </label>
              <Input
                id={variable.identifier}
                value={values[variable.identifier] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [variable.identifier]: e.target.value }))}
                className="bg-[#1F1A29] border-[#9D74FF]/20 text-white"
                required
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#9D74FF] hover:bg-[#B594FF] text-white">
              Continue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

