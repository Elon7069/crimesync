'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { sampleIncidents, sampleAlerts, enhancedAccidents, generateRealtimeIncident, generateRealtimeAccident, AccidentData } from '@/lib/map-data'
import type { Incident, Alert as AlertType } from '@/components/MapView'
import { 
  MapPin, 
  AlertTriangle, 
  Activity,
  Clock,
  Navigation,
  RefreshCw,
  TrendingUp,
  Shield,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  )
})

export default function CrimeMapPage() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents)
  const [alerts, setAlerts] = useState<AlertType[]>(sampleAlerts)
  const [accidents, setAccidents] = useState<AccidentData[]>(enhancedAccidents)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'accidents' | 'high_priority'>('all')

  // Enhanced auto-refresh with accidents and incidents
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLive) {
      interval = setInterval(() => {
        const random = Math.random()
        
        if (random > 0.8) { // 20% chance of new incident
          const newIncident = generateRealtimeIncident()
          setIncidents(prev => [newIncident, ...prev].slice(0, 20))
          setLastUpdate(new Date())
          toast.success(`New incident: ${newIncident.title}`)
        } else if (random > 0.7) { // 10% chance of new accident
          const newAccident = generateRealtimeAccident()
          setAccidents(prev => [newAccident, ...prev].slice(0, 15))
          setLastUpdate(new Date())
          toast.error(`🚨 Traffic Accident: ${newAccident.title}`, {
            description: `${newAccident.casualties.total} casualties reported`,
            action: {
              label: 'View Details',
              onClick: () => console.log('View accident details')
            }
          })
        }
      }, 25000) // Every 25 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLive])

  const filteredIncidents = incidents.filter(incident => {
    switch (selectedFilter) {
      case 'accidents':
        return incident.type === 'accident' || incident.title.toLowerCase().includes('accident')
      case 'high_priority':
        return incident.severity === 'high'
      default:
        return true
    }
  })

  const filteredAccidents = accidents.filter(accident => {
    switch (selectedFilter) {
      case 'accidents':
        return true
      case 'high_priority':
        return accident.severity === 'high'
      default:
        return selectedFilter === 'all'
    }
  })

  const stats = {
    total: incidents.length + accidents.length,
    active: incidents.filter(i => i.status === 'pending' || i.status === 'investigating').length + 
            accidents.filter(a => a.status === 'pending' || a.status === 'investigating').length,
    highPriority: incidents.filter(i => i.severity === 'high').length + 
                  accidents.filter(a => a.severity === 'high').length,
    resolved: incidents.filter(i => i.status === 'resolved').length + 
              accidents.filter(a => a.status === 'resolved').length,
    accidents: accidents.length,
    casualties: accidents.reduce((sum, acc) => sum + acc.casualties.total, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <MapPin className="h-12 w-12 text-blue-600 mr-3" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Activity className="h-3 w-3 mr-1" />
              Live Crime Map
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
            Live Crime Safety Map
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real-time crime reporting and safety monitoring. View recent incidents, track ongoing investigations, 
            and access safety alerts in your area.
          </p>
        </motion.div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      All time
                    </p>
                  </div>
                  <MapPin className="h-12 w-12 text-blue-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                    <p className="text-3xl font-bold">{stats.active}</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      Under investigation
                    </p>
                  </div>
                  <Activity className="h-12 w-12 text-orange-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                    <p className="text-3xl font-bold">{stats.highPriority}</p>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgent attention
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-3xl font-bold">{stats.resolved}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Shield className="h-3 w-3 mr-1" />
                      Cases closed
                    </p>
                  </div>
                  <Shield className="h-12 w-12 text-green-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Live Accidents</p>
                    <p className="text-3xl font-bold">{stats.accidents}</p>
                    <p className="text-xs text-purple-600 flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Traffic incidents
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-purple-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Casualties</p>
                    <p className="text-3xl font-bold">{stats.casualties}</p>
                    <p className="text-xs text-yellow-600 flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      Emergency response
                    </p>
                  </div>
                  <Activity className="h-12 w-12 text-yellow-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('all')}
                  size="sm"
                >
                  All Reports ({incidents.length + accidents.length})
                </Button>
                <Button
                  variant={selectedFilter === 'accidents' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('accidents')}
                  size="sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Live Accidents ({accidents.length})
                </Button>
                <Button
                  variant={selectedFilter === 'high_priority' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('high_priority')}
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  High Priority ({stats.highPriority})
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                <Button
                  variant={isLive ? 'default' : 'outline'}
                  onClick={() => {
                    setIsLive(!isLive)
                    if (!isLive) {
                      toast.success('Live updates enabled')
                    } else {
                      toast.success('Live updates disabled')
                    }
                  }}
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
                  {isLive ? 'Live' : 'Enable Live Updates'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Updates Alert */}
        {isLive && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Activity className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">Live Updates Active</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              The map will automatically update with new incidents every 30 seconds. 
              You'll receive notifications when new reports come in.
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="h-[650px] w-full">
              <MapView 
                mode="client"
                incidents={filteredIncidents}
                alerts={alerts}
                accidents={filteredAccidents}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Accidents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Live Traffic Accidents & Emergency Response
                <Badge variant="destructive" className="ml-2">
                  {accidents.filter(a => a.status !== 'resolved').length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accidents.slice(0, 5).map((accident, index) => (
                  <motion.div
                    key={accident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full mt-2 flex items-center justify-center text-xs ${
                      accident.severity === 'high' ? 'bg-red-500 text-white' :
                      accident.severity === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      🚗
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{accident.title}</h3>
                        <Badge variant={accident.severity === 'high' ? 'destructive' : 
                                       accident.severity === 'medium' ? 'default' : 'secondary'}>
                          {accident.severity}
                        </Badge>
                        <Badge 
                          variant={accident.emergencyResponse.currentStatus === 'on_scene' ? 'destructive' : 'outline'}
                        >
                          {accident.emergencyResponse.currentStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {accident.description}
                      </p>
                      
                      {/* Enhanced Accident Details */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-red-50 p-2 rounded text-center">
                          <div className="text-sm font-bold text-red-700">{accident.casualties.total}</div>
                          <div className="text-xs text-red-600">Casualties</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <div className="text-sm font-bold text-blue-700">{accident.vehiclesInvolved.count}</div>
                          <div className="text-xs text-blue-600">Vehicles</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                          <div className="text-sm font-bold text-yellow-700">{accident.trafficImpact.lanesBlocked}</div>
                          <div className="text-xs text-yellow-600">Lanes Blocked</div>
                        </div>
                      </div>
                      
                      {/* AI Recommendations */}
                      {accident.aiAnalysis && (
                        <div className="bg-purple-50 p-2 rounded mb-2">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium text-purple-700">AI Analysis</span>
                          </div>
                          <p className="text-xs text-purple-600">{accident.aiAnalysis.recommendations[0]}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(accident.time).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {accident.lat.toFixed(4)}, {accident.lng.toFixed(4)}
                        </span>
                        {accident.emergencyResponse.estimatedClearTime && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Activity className="h-3 w-3" />
                            Clear: {new Date(accident.emergencyResponse.estimatedClearTime).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Stay Safe & Informed</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Report Incidents</h4>
                    <p className="opacity-90">Help your community by reporting incidents through our secure platform.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Stay Alert</h4>
                    <p className="opacity-90">Monitor real-time updates and avoid high-risk areas when possible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Emergency Services</h4>
                    <p className="opacity-90">For immediate emergencies, always call 911 or local emergency services.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}