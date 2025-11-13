"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { SuggestAlternativeAccommodationsOutput } from "@/ai/flows/suggest-alternative-accommodations"
import { Wand2 } from "lucide-react"

interface SuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  suggestions: SuggestAlternativeAccommodationsOutput
}

export function SuggestionModal({ isOpen, onClose, suggestions }: SuggestionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            Alternative Suggestions
          </DialogTitle>
          <DialogDescription>
            Your selected room is unavailable. Here are some AI-powered alternatives based on your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 whitespace-pre-wrap text-sm text-muted-foreground bg-secondary p-4 rounded-md">
            {suggestions.alternativeAccommodations}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button onClick={onClose} className="bg-accent text-accent-foreground hover:bg-accent/90">Book an Alternative</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
