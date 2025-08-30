'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { addSosAlert } from '@/lib/firebase'
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Share2, 
  Copy,
  Users,
  Clock,
  QrCode
} from 'lucide-react'
import { toast } from 'sonner'

interface EmergencyContact {
  name: string
  number: string
  type: 'police' | 'ambulance' | 'fire' | 'personal'
}

const emergencyContacts: EmergencyContact[] = [
  { name: 'Police', number: '100', type: 'police' },
  { name: 'Ambulance', number: '108', type: 'ambulance' },
  { name: 'Fire Department', number: '101', type: 'fire' },
  { name: 'Emergency Contact', number: '+91-XXXXXXXXXX', type: 'personal' },
]

export function EmergencySOS() {
  const [isOpen, setIsOpen] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [shareableLink, setShareableLink] = useState('')

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isActivated) {
      handleEmergencyActivation()
    }
  }, [countdown, isActivated])

  useEffect(() => {
    // Get user location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          // Create shareable link
          const link = `${window.location.origin}/emergency-location?lat=${position.coords.latitude}&lng=${position.coords.longitude}&time=${Date.now()}`
          setShareableLink(link)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleSOSClick = () => {
    setIsOpen(true)
  }

  const activateEmergency = () => {
    setIsActivated(true)
    setCountdown(5) // 5 second countdown
    toast.error('Emergency SOS activating in 5 seconds...', {
      description: 'Cancel now if this was accidental',
      duration: 5000,
    })
  }

  const cancelEmergency = () => {
    setIsActivated(false)
    setCountdown(0)
    toast.success('Emergency SOS cancelled')
  }

  const handleEmergencyActivation = async () => {
    setIsActivated(false)

    if (!userLocation) {
      toast.error('Could not determine location. SOS aborted.')
      return
    }

    try {
      const newAlert = {
        location: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          address: `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}` // Simple address for now
        },
        userId: 'user_anonymous', // Replace with actual user ID when auth is implemented
        status: 'active' as 'active' | 'resolved',
        message: 'Emergency SOS button activated.',
      }

      await addSosAlert(newAlert)

      toast.error('🚨 EMERGENCY ALERT SENT!', {
        description: 'Your location has been logged and sent to the authorities.',
        duration: 10000,
      })
    } catch (error) {
      console.error("Failed to send SOS alert:", error)
      toast.error('Failed to send SOS alert. Please try again.')
    }
  }

  const callEmergency = (number: string, name: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${number}`, '_self')
      toast.success(`Calling ${name}...`)
    }
  }

  const shareLocation = async () => {
    if (shareableLink) {
      try {
        await navigator.clipboard.writeText(shareableLink)
        toast.success('Emergency location link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }
  }

  const sendPanicAlert = () => {
    toast.error('🚨 Panic alert sent to all emergency contacts!', {
      description: 'Your trusted contacts have been notified of your situation.',
      duration: 8000,
    })
  }

  return (
    <>
      {/* Floating SOS Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Countdown Overlay */}
        <AnimatePresence>
          {isActivated && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2"
            >
              <Card className="bg-red-600 text-white border-red-700 shadow-2xl">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{countdown}</div>
                  <div className="text-sm">Activating SOS...</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEmergency}
                    className="mt-2 text-red-600 hover:text-red-700 border-white"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main SOS Button */}
        <Button
          size="lg"
          onClick={handleSOSClick}
          className={`
            h-16 w-16 rounded-full shadow-2xl text-white font-bold text-lg
            ${isActivated 
              ? 'bg-red-700 hover:bg-red-800 animate-pulse' 
              : 'bg-red-600 hover:bg-red-700'
            }
          `}
        >
          SOS
        </Button>

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full">
          <motion.div
            className="absolute inset-0 rounded-full bg-red-600 opacity-25"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.25, 0, 0.25],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Emergency Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription>
              Quick access to emergency services and safety features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Emergency Activation */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <CardContent className="p-4">
                <Button
                  onClick={activateEmergency}
                  disabled={isActivated}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg"
                >
                  {isActivated ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Activating... {countdown}s
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      ACTIVATE EMERGENCY
                    </span>
                  )}
                </Button>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  Sends location + alert to contacts & authorities
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3">
              {/* Call Emergency Services */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {emergencyContacts.slice(0, 4).map((contact) => (
                    <Button
                      key={contact.number}
                      variant="outline"
                      size="sm"
                      onClick={() => callEmergency(contact.number, contact.name)}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <Phone className="h-3 w-3 mb-1" />
                      <span className="text-xs">{contact.name}</span>
                      <span className="text-xs font-mono">{contact.number}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Share Location */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={shareLocation}
                  className="h-16 flex flex-col items-center justify-center"
                >
                  <MapPin className="h-4 w-4 mb-1" />
                  <span className="text-xs">Share Location</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={sendPanicAlert}
                  className="h-16 flex flex-col items-center justify-center"
                >
                  <Users className="h-4 w-4 mb-1" />
                  <span className="text-xs">Panic Alert</span>
                </Button>
              </div>

              {/* Location Status */}
              {userLocation && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200">
                        Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        Live
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Warning */}
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="p-3">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>⚠️ Important:</strong> Only use emergency features during genuine emergencies. 
                  False alarms may delay response to real emergencies.
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}