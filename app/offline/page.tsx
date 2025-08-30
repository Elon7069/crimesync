'use client'

import { Shield, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="relative">
          <Shield className="h-24 w-24 text-primary mx-auto" />
          <WifiOff className="h-8 w-8 text-muted-foreground absolute -top-2 -right-2" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            You're Offline
          </h1>
          <p className="text-muted-foreground text-lg">
            It looks like you've lost your internet connection. 
            Some features may not be available while offline.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
            size="lg"
          >
            <Wifi className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            asChild 
            className="w-full"
            size="lg"
          >
            <Link href="/">
              <Shield className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        </div>

        {/* Offline Features Info */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Available Offline:</p>
          <ul className="space-y-1 text-left">
            <li>• View cached crime reports</li>
            <li>• Access saved dashboard data</li>
            <li>• View offline map (if cached)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
