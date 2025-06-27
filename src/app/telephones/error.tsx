
// app/telephones/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function TelephonesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Phones page error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-muted-foreground mb-8">
        Impossible de charger les téléphones. Veuillez réessayer.
      </p>
      <Button onClick={reset}>
        Réessayer
      </Button>
    </div>
  )
}