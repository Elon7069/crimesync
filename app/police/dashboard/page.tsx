'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Activity,
  Clock,
  Radio,
  Car,
  Ambulance,
  Users,
  TrendingUp,
  BarChart3,
  Brain,
  Zap,
  Camera,
  Settings,
  Phone,
  FileText,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  sampleIncidents, 
  sampleAlerts, 
  enhancedAccidents, 
  generateRealtimeAccident, 
  policeAIInsights,
  AccidentData 
} from '@/lib/map-data'
import type { Incident, Alert } from '@/components/MapView'

// Dynamic import to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading police command center...</p>
      </div>
    </div>
  )
})

export default function PoliceDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents)
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts)
  const [accidents, setAccidents] = useState<AccidentData[]>(enhancedAccidents)
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  // Emergency response metrics
  const [responseMetrics, setResponseMetrics] = useState({
    averageResponseTime: 8.5,
    unitsDeployed: 12,
    activeIncidents: 0,
    clearanceRate: 87
  })

  // Auto-refresh for live police updates
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLiveMode) {
      interval = setInterval(() => {
        if (Math.random() > 0.85) { // 15% chance of new accident
          const newAccident = generateRealtimeAccident()
          setAccidents(prev => [newAccident, ...prev].slice(0, 12))
          setLastUpdate(new Date())
          
          // Update metrics
          setResponseMetrics(prev => ({
            ...prev,
            activeIncidents: prev.activeIncidents + 1,
            unitsDeployed: prev.unitsDeployed + Math.floor(Math.random() * 3) + 1
          }))
          
          toast.error(`🚨 PRIORITY ALERT: ${newAccident.title}`, {
            description: `Severity: ${newAccident.severity.toUpperCase()} | ${newAccident.casualties.total} casualties`,
            action: {
              label: 'Dispatch Units',
              onClick: () => handleEmergencyDispatch(newAccident.id)
            }
          })
        }
      }, 30000) // Every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLiveMode])

  const handleEmergencyDispatch = (accidentId: string) => {
    toast.success('Emergency units dispatched', {
      description: 'Ambulance and traffic police en route'
    })
  }

  const handleUpdateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id ? { ...incident, ...updates } : incident
    ))
  }

  const handleUpdateAccident = (id: string, updates: Partial<AccidentData>) => {
    setAccidents(prev => prev.map(accident => 
      accident.id === id ? { ...accident, ...updates } : accident
    ))
  }

  const handleCreateAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert = { ...alert, id: `alert-${Date.now()}` }
    setAlerts(prev => [newAlert, ...prev])
    toast.success('Public safety alert created')
  }

  const handleDispatchUnit = (accidentId: string, unitType: string) => {
    toast.success(`${unitType.charAt(0).toUpperCase() + unitType.slice(1)} unit dispatched to incident ${accidentId}`)
  }

  // Calculate statistics
  const stats = {
    totalIncidents: incidents.length + accidents.length,
    activeAccidents: accidents.filter(a => a.status !== 'resolved').length,
    highPriority: accidents.filter(a => a.severity === 'high').length + incidents.filter(i => i.severity === 'high').length,
    totalCasualties: accidents.reduce((sum, acc) => sum + acc.casualties.total, 0),
    unitsAvailable: 24 - responseMetrics.unitsDeployed,
    responseTime: responseMetrics.averageResponseTime
  }

  // AI Pattern Analysis
  const aiAnalysis = policeAIInsights.getPatternAnalysis(incidents)
  const resourceInsights = policeAIInsights.getResourceAllocation(accidents)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-400 mr-3" />
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-400">
                <Activity className="h-3 w-3 mr-1" />
                Police Command Center
              </Badge>
              <Badge 
                className={`${isLiveMode ? 'bg-green-600/20 text-green-300 border-green-400' : 'bg-gray-600/20 text-gray-300 border-gray-400'}`}
              >
                <Radio className="h-3 w-3 mr-1" />
                {isLiveMode ? 'LIVE' : 'OFFLINE'}
              </Badge>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Emergency Response Dashboard
          </h1>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Real-time crime monitoring, accident response, and AI-powered resource allocation
          </p>
        </motion.div>

        {/* Critical Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Accidents', value: stats.activeAccidents, icon: Car, color: 'red', urgent: stats.activeAccidents > 3 },
            { label: 'High Priority', value: stats.highPriority, icon: AlertTriangle, color: 'yellow', urgent: stats.highPriority > 2 },
            { label: 'Total Casualties', value: stats.totalCasualties, icon: Activity, color: 'purple', urgent: stats.totalCasualties > 10 },
            { label: 'Units Available', value: stats.unitsAvailable, icon: Radio, color: 'green', urgent: stats.unitsAvailable < 5 },
            { label: 'Response Time', value: `${stats.responseTime}min`, icon: Clock, color: 'blue', urgent: stats.responseTime > 10 },
            { label: 'Total Incidents', value: stats.totalIncidents, icon: MapPin, color: 'gray', urgent: false }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${metric.urgent ? 'border-red-500 bg-red-500/10' : 'bg-black/20 border-gray-700'} backdrop-blur`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${metric.urgent ? 'text-red-300' : 'text-gray-300'}`}>
                        {metric.label}
                      </p>
                      <p className={`text-2xl font-bold ${metric.urgent ? 'text-red-100' : 'text-white'}`}>
                        {metric.value}
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 opacity-75 ${
                      metric.urgent ? 'text-red-400' : 
                      metric.color === 'red' ? 'text-red-400' :
                      metric.color === 'yellow' ? 'text-yellow-400' :
                      metric.color === 'purple' ? 'text-purple-400' :
                      metric.color === 'green' ? 'text-green-400' :
                      metric.color === 'blue' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  </div>
                  {metric.urgent && (
                    <div className="mt-2">
                      <Badge variant="destructive" className="text-xs">
                        CRITICAL
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="xl:col-span-2">
            <Card className="bg-black/20 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5" />
                  Command Center Map
                  <Button
                    size="sm"
                    variant={isLiveMode ? "default" : "outline"}
                    onClick={() => setIsLiveMode(!isLiveMode)}
                    className="ml-auto"
                  >
                    <Activity className={`h-4 w-4 mr-2 ${isLiveMode ? 'animate-pulse' : ''}`} />
                    {isLiveMode ? 'LIVE' : 'Enable Live'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <MapView
                    mode="police"
                    incidents={incidents}
                    alerts={alerts}
                    accidents={accidents}
                    onUpdateIncident={handleUpdateIncident}
                    onUpdateAccident={handleUpdateAccident}
                    onCreateAlert={handleCreateAlert}
                    onDispatchUnit={handleDispatchUnit}
                    className="rounded-lg overflow-hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-black/20 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  AI Command Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Assessment */}
                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-200">Current Risk Level</span>
                  </div>
                  <Progress value={75} className="h-2 mb-2" />
                  <p className="text-xs text-blue-300">High activity in central areas. Increased patrol recommended.</p>
                </div>

                {/* Resource Allocation */}
                {resourceInsights && (
                  <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-200">Resource Status</span>
                    </div>
                    <div className="space-y-1 text-xs text-green-300">
                      <div className="flex justify-between">
                        <span>Ambulances Needed:</span>
                        <span className="font-medium">{resourceInsights.recommendedUnits.ambulances}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patrol Units:</span>
                        <span className="font-medium">{resourceInsights.recommendedUnits.patrolCars}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traffic Police:</span>
                        <span className="font-medium">{resourceInsights.recommendedUnits.trafficPolice}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pattern Analysis */}
                <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-200">Pattern Analysis</span>
                  </div>
                  <div className="space-y-1 text-xs text-purple-300">
                    {aiAnalysis.prediction.timeWindows.slice(0, 2).map((window, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{window.start}-{window.end}:</span>
                        <Badge 
                          variant={window.risk === 'high' ? 'destructive' : 'default'} 
                          className="text-xs"
                        >
                          {window.risk.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/20 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Camera className="h-3 w-3 mr-1" />
                    CCTV Feeds
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Emergency Calls
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    All Units
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Reports
                  </Button>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={() => {
                    const testAccident = generateRealtimeAccident()
                    setAccidents(prev => [testAccident, ...prev].slice(0, 12))
                    toast.error(`🚨 TEST ALERT: ${testAccident.title}`)
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Simulate Emergency
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/20 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {accidents.slice(0, 5).map((accident, index) => (
                    <div key={accident.id} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        accident.severity === 'high' ? 'bg-red-500' :
                        accident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{accident.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(accident.time).toLocaleTimeString()} • {accident.casualties.total} casualties
                        </p>
                      </div>
                      <Badge 
                        variant={accident.emergencyResponse.currentStatus === 'on_scene' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {accident.emergencyResponse.currentStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}