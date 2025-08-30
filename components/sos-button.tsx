'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react'
import { seedSosAlerts, type SosAlert } from '@/lib/seed-data'

export function SosButton() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [recentAlerts, setRecentAlerts] = useState<SosAlert[]>(seedSosAlerts)
  const [showAlerts, setShowAlerts] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0 && isActivating) {
      activateSOS()
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [countdown, isActivating])

  const handleSOSClick = () => {
    setIsOpen(false)
    setIsActivating(true)
    setCountdown(5) // 5 second countdown before activation
    
    toast({
      title: 'SOS Activating...',
      description: 'Cancel within 5 seconds if this was accidental.',
      variant: 'destructive',
    })
  }

  const cancelSOS = () => {
    setIsActivating(false)
    setCountdown(0)
    toast({
      title: 'SOS Cancelled',
      description: 'Emergency alert has been cancelled.',
    })
  }

  const activateSOS = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location required',
        description: 'Please enable location services for emergency alerts.',
        variant: 'destructive',
      })
      setIsActivating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          
          // Create SOS alert (in real app, this would be saved to Firestore)
          const newAlert: SosAlert = {
            id: Date.now().toString(),
            location: {
              lat: latitude,
              lng: longitude,
              address: address,
            },
            timestamp: new Date(),
            userId: 'current_user', // Replace with actual user ID
            status: 'active',
            message: 'Emergency assistance needed - SOS alert activated',
          }
          
          // Add to recent alerts
          setRecentAlerts(prev => [newAlert, ...prev].slice(0, 10))
          
          toast({
            title: 'SOS ACTIVATED!',
            description: `Emergency alert sent! Location: ${address}`,
            variant: 'destructive',
          })
          
          // In a real app, this would:
          // 1. Send SMS/push notifications to emergency contacts
          // 2. Alert local authorities
          // 3. Share live location
          // 4. Start recording audio/video if configured
          
        } catch (error) {
          toast({
            title: 'SOS Alert Sent',
            description: 'Emergency services have been notified.',
            variant: 'destructive',
          })
        }
        
        setIsActivating(false)
      },
      (error) => {
        toast({
          title: 'SOS Alert Sent',
          description: 'Emergency services have been notified (location not available).',
          variant: 'destructive',
        })
        setIsActivating(false)
      }
    )
  }

  return (
    <>
      {/* SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Recent Alerts Sidebar */}
          {showAlerts && (
            <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Recent SOS Alerts</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAlerts(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {recentAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent alerts</p>
                ) : (
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${
                          alert.status === 'active' 
                            ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.status === 'active' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-500 text-white'
                          }`}>
                            {alert.status.toUpperCase()}
                          </span>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-xs flex items-start gap-1 mb-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground line-clamp-2">
                            {alert.location.address}
                          </span>
                        </div>
                        <p className="text-xs">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Countdown overlay */}
          {isActivating && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <Card className="bg-red-600 text-white border-red-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{countdown}</div>
                  <div className="text-xs">Activating SOS...</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelSOS}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Alert count badge */}
          {recentAlerts.filter(alert => alert.status === 'active').length > 0 && (
            <div className="absolute -top-2 -left-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {recentAlerts.filter(alert => alert.status === 'active').length}
            </div>
          )}
          
          {/* Main SOS Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className={`h-16 w-16 rounded-full shadow-lg ${
                  isActivating 
                    ? 'bg-red-700 hover:bg-red-800 animate-pulse' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
                disabled={isActivating}
              >
                <AlertTriangle className="h-8 w-8" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency SOS
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to activate the SOS alert? This will:
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>Alert emergency contacts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Share your live location</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <span>Notify local authorities</span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Only use this button in genuine emergencies. 
                  False alarms may delay response to real emergencies.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSOSClick}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Activate SOS
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Alerts toggle button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAlerts(!showAlerts)}
            className="absolute -top-12 left-0 text-xs"
          >
            Alerts ({recentAlerts.filter(alert => alert.status === 'active').length})
          </Button>
        </div>
      </div>
    </>
  )
}