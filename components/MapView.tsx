'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet'
import { LatLngExpression, Icon, DivIcon } from 'leaflet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Map, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Filter,
  Eye,
  EyeOff,
  Plus,
  Activity,
  Clock,
  Navigation,
  Target,
  Brain,
  Zap,
  Users,
  Car,
  Ambulance,
  Shield,
  Camera,
  Radio,
  TrendingUp,
  BarChart3,
  Settings,
  Layers
} from 'lucide-react'
import { toast } from 'sonner'
import { AccidentData, generateRealtimeAccident, aiSafetyRecommendations, policeAIInsights } from '@/lib/map-data'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface Incident {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  lat: number
  lng: number
  status: 'pending' | 'investigating' | 'resolved'
  time: string
  type?: string
}

export interface Alert {
  id: string
  message: string
  lat: number
  lng: number
  radius: number
  priority?: 'low' | 'medium' | 'high'
}

interface MapViewProps {
  mode: 'client' | 'admin' | 'police'
  incidents: Incident[]
  alerts: Alert[]
  accidents?: AccidentData[]
  onUpdateIncident?: (id: string, updates: Partial<Incident>) => void
  onCreateAlert?: (alert: Omit<Alert, 'id'>) => void
  onRemoveIncident?: (id: string) => void
  onUpdateAccident?: (id: string, updates: Partial<AccidentData>) => void
  onDispatchUnit?: (accidentId: string, unitType: string) => void
  className?: string
}

// Enhanced Emergency Response Units
interface EmergencyUnit {
  id: string
  type: 'ambulance' | 'police' | 'fire' | 'traffic'
  status: 'available' | 'dispatched' | 'on_scene' | 'returning'
  lat: number
  lng: number
  assignedIncident?: string
  eta?: number
}

// Enhanced marker icons for different incident types
const createCustomIcon = (severity: 'low' | 'medium' | 'high', type?: string) => {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  }
  
  const getIcon = (type?: string) => {
    switch (type) {
      case 'accident': return '🚗'
      case 'emergency': return '🚨'
      case 'theft': return '🎯'
      case 'assault': return '⚠️'
      default: return '📍'
    }
  }
  
  return new DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[severity]}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px;">${getIcon(type)}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

// Emergency unit icons
const createUnitIcon = (type: 'ambulance' | 'police' | 'fire' | 'traffic', status: string) => {
  const icons = {
    ambulance: '🚑',
    police: '🚓',
    fire: '🚒',
    traffic: '🚔'
  }
  
  const colors = {
    available: '#10b981',
    dispatched: '#f59e0b',
    on_scene: '#ef4444',
    returning: '#6366f1'
  }
  
  return new DivIcon({
    className: 'unit-marker',
    html: `<div style="background-color: ${colors[status]}; width: 28px; height: 28px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px;">${icons[type]}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

const userLocationIcon = new DivIcon({
  className: 'user-location-marker',
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4); animation: pulse 2s infinite;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

// Component for handling map clicks in admin mode
function AdminMapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    contextmenu: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

// Component for centering map on user location
function LocationHandler({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 13)
    }
  }, [map, userLocation])
  
  return null
}

export default function MapView({ 
  mode, 
  incidents, 
  alerts, 
  accidents = [],
  onUpdateIncident, 
  onCreateAlert, 
  onRemoveIncident,
  onUpdateAccident,
  onDispatchUnit,
  className 
}: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)
  const [showUnits, setShowUnits] = useState(mode === 'police')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [selectedAccident, setSelectedAccident] = useState<AccidentData | null>(null)
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [alertFormData, setAlertFormData] = useState({ lat: 0, lng: 0, message: '', radius: 100 })
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>([])
  const [filters, setFilters] = useState({
    showPending: true,
    showResolved: true,
    showHighSeverity: false,
    showHistorical: false,
    showAccidents: true,
    showEmergencyUnits: mode === 'police'
  })
  const [realTimeAccidents, setRealTimeAccidents] = useState<AccidentData[]>(accidents)

  // Initialize emergency units for police mode
  useEffect(() => {
    if (mode === 'police') {
      const units: EmergencyUnit[] = [
        { id: 'amb-101', type: 'ambulance', status: 'available', lat: 28.7041, lng: 77.1025 },
        { id: 'amb-205', type: 'ambulance', status: 'dispatched', lat: 28.6280, lng: 77.2420, assignedIncident: 'acc-2', eta: 8 },
        { id: 'pol-12', type: 'police', status: 'on_scene', lat: 28.7041, lng: 77.1025, assignedIncident: 'acc-1' },
        { id: 'fire-205', type: 'fire', status: 'returning', lat: 28.6507, lng: 77.1934 },
        { id: 'traf-08', type: 'traffic', status: 'available', lat: 28.6315, lng: 77.2167 },
        { id: 'traf-15', type: 'traffic', status: 'dispatched', lat: 28.5672, lng: 77.2100, assignedIncident: 'acc-3', eta: 5 }
      ]
      setEmergencyUnits(units)
    }
  }, [mode])

  // Get user location and generate AI recommendations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(location)
          
          // Generate AI safety recommendations
          if (mode === 'client') {
            const recommendations = aiSafetyRecommendations.getRealTimeRecommendations(
              location[0], location[1], new Date()
            )
            setAiRecommendations(recommendations)
          }
        },
        (error) => {
          console.log('Location access denied')
          // Default to Delhi coordinates
          const defaultLocation: [number, number] = [28.6139, 77.2090]
          setUserLocation(defaultLocation)
          
          if (mode === 'client') {
            const recommendations = aiSafetyRecommendations.getRealTimeRecommendations(
              defaultLocation[0], defaultLocation[1], new Date()
            )
            setAiRecommendations(recommendations)
          }
        }
      )
    } else {
      const defaultLocation: [number, number] = [28.6139, 77.2090]
      setUserLocation(defaultLocation)
    }
  }, [])

  // Real-time accident simulation for police mode
  useEffect(() => {
    if (mode === 'police') {
      const interval = setInterval(() => {
        if (Math.random() > 0.85) { // 15% chance every 45 seconds
          const newAccident = generateRealtimeAccident()
          setRealTimeAccidents(prev => [newAccident, ...prev].slice(0, 10))
          toast.error(`🚨 New Accident: ${newAccident.title}`, {
            description: `Severity: ${newAccident.severity.toUpperCase()} | ${newAccident.casualties.total} casualties`,
            action: {
              label: 'View',
              onClick: () => setSelectedAccident(newAccident)
            }
          })
        }
      }, 45000) // Every 45 seconds
      
      return () => clearInterval(interval)
    }
  }, [mode])

  // Filter incidents based on current filters
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      if (!filters.showPending && incident.status === 'pending') return false
      if (!filters.showResolved && incident.status === 'resolved') return false
      if (filters.showHighSeverity && incident.severity !== 'high') return false
      return true
    })
  }, [incidents, filters])

  // Filter accidents
  const filteredAccidents = useMemo(() => {
    if (!filters.showAccidents) return []
    return realTimeAccidents.filter(accident => {
      if (!filters.showPending && accident.status === 'pending') return false
      if (!filters.showResolved && accident.status === 'resolved') return false
      if (filters.showHighSeverity && accident.severity !== 'high') return false
      return true
    })
  }, [realTimeAccidents, filters])

  // AI Pattern Analysis for police
  const aiPatterns = useMemo(() => {
    if (mode === 'police' && incidents.length > 0) {
      return policeAIInsights.getPatternAnalysis(incidents)
    }
    return null
  }, [incidents, mode])

  // Resource allocation insights
  const resourceInsights = useMemo(() => {
    if (mode === 'police' && realTimeAccidents.length > 0) {
      return policeAIInsights.getResourceAllocation(realTimeAccidents)
    }
    return null
  }, [realTimeAccidents, mode])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (mode === 'admin') {
      setAlertFormData({ lat, lng, message: '', radius: 100 })
      setShowCreateAlert(true)
    }
  }, [mode])

  const handleCreateAlert = useCallback(() => {
    if (onCreateAlert && alertFormData.message) {
      onCreateAlert({
        message: alertFormData.message,
        lat: alertFormData.lat,
        lng: alertFormData.lng,
        radius: alertFormData.radius
      })
      setShowCreateAlert(false)
      setAlertFormData({ lat: 0, lng: 0, message: '', radius: 100 })
      toast.success('Alert created successfully')
    }
  }, [onCreateAlert, alertFormData])

  const handleStatusUpdate = useCallback((id: string, newStatus: 'pending' | 'investigating' | 'resolved') => {
    if (onUpdateIncident) {
      onUpdateIncident(id, { status: newStatus })
      toast.success(`Incident status updated to ${newStatus}`)
    }
  }, [onUpdateIncident])

  const handleAccidentUpdate = useCallback((id: string, updates: Partial<AccidentData>) => {
    if (onUpdateAccident) {
      onUpdateAccident(id, updates)
      setRealTimeAccidents(prev => prev.map(acc => acc.id === id ? { ...acc, ...updates } : acc))
      toast.success('Accident details updated')
    }
  }, [onUpdateAccident])

  const handleDispatchUnit = useCallback((accidentId: string, unitType: string) => {
    if (onDispatchUnit) {
      onDispatchUnit(accidentId, unitType)
      
      // Update unit status
      setEmergencyUnits(prev => prev.map(unit => {
        if (unit.type === unitType && unit.status === 'available') {
          return { ...unit, status: 'dispatched', assignedIncident: accidentId, eta: Math.floor(Math.random() * 15) + 5 }
        }
        return unit
      }))
      
      toast.success(`${unitType.charAt(0).toUpperCase() + unitType.slice(1)} unit dispatched`)
    }
  }, [onDispatchUnit])

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Enhanced Control Panel */}
      <Card className="absolute top-4 right-4 z-[1000] min-w-[320px] max-w-[400px] max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {mode === 'police' ? <Brain className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {mode === 'police' ? 'Police Command Center' : mode === 'admin' ? 'Admin Controls' : 'Map Controls'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'police' ? (
            <Tabs defaultValue="control" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="control">Control</TabsTrigger>
                <TabsTrigger value="ai">AI Insights</TabsTrigger>
                <TabsTrigger value="units">Units</TabsTrigger>
              </TabsList>
              
              <TabsContent value="control" className="space-y-4">
                {/* Enhanced Police Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm font-medium">Crime Heatmap</span>
                    </div>
                    <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Public Alerts</span>
                    </div>
                    <Switch checked={showAlerts} onCheckedChange={setShowAlerts} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span className="text-sm font-medium">Live Accidents</span>
                    </div>
                    <Switch checked={filters.showAccidents} onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showAccidents: checked }))} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      <span className="text-sm font-medium">Emergency Units</span>
                    </div>
                    <Switch checked={showUnits} onCheckedChange={setShowUnits} />
                  </div>
                </div>

                {/* Police Incident Filters */}
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Incident Filters
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Cases</span>
                      <Switch 
                        checked={filters.showPending} 
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showPending: checked }))} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resolved Cases</span>
                      <Switch 
                        checked={filters.showResolved} 
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showResolved: checked }))} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Priority</span>
                      <Switch 
                        checked={filters.showHighSeverity} 
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showHighSeverity: checked }))} 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowCreateAlert(true)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Create Alert
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      View Feeds
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ai" className="space-y-4">
                {/* AI Insights Panel */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-bold">AI Crime Analysis</span>
                  </div>
                  
                  {aiRecommendations && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Risk Assessment</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Current Area Risk</span>
                          <Badge variant={aiRecommendations.riskLevel > 70 ? 'destructive' : aiRecommendations.riskLevel > 40 ? 'default' : 'secondary'}>
                            {aiRecommendations.riskLevel}%
                          </Badge>
                        </div>
                        <Progress value={aiRecommendations.riskLevel} className="h-2" />
                      </div>
                    </div>
                  )}
                  
                  {resourceInsights && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Resource Status</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Ambulances Needed:</span>
                          <span className="font-medium">{resourceInsights.recommendedUnits.ambulances}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Patrol Cars:</span>
                          <span className="font-medium">{resourceInsights.recommendedUnits.patrolCars}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Traffic Police:</span>
                          <span className="font-medium">{resourceInsights.recommendedUnits.trafficPolice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {aiPatterns && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Pattern Analysis</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        {aiPatterns.prediction.timeWindows.slice(0, 2).map((window, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{window.start}-{window.end}:</span>
                            <Badge variant={window.risk === 'high' ? 'destructive' : 'default'} className="text-xs">
                              {window.risk.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="units" className="space-y-4">
                {/* Emergency Units Panel */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-bold">Emergency Units</span>
                  </div>
                  
                  <div className="space-y-2">
                    {emergencyUnits.slice(0, 4).map(unit => (
                      <div key={unit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            unit.status === 'available' ? 'bg-green-500' :
                            unit.status === 'dispatched' ? 'bg-yellow-500' :
                            unit.status === 'on_scene' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-xs font-medium">{unit.id}</span>
                        </div>
                        <div className="text-xs">
                          <Badge variant="outline" className="text-xs">
                            {unit.status.replace('_', ' ')}
                          </Badge>
                          {unit.eta && (
                            <div className="text-gray-500 mt-1">ETA: {unit.eta}min</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      All Units
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Dispatch
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Original admin/client controls
            <>
              {/* Heatmap Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Heatmap View</span>
                </div>
                <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>

              {/* Alerts Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Show Alerts</span>
                </div>
                <Switch checked={showAlerts} onCheckedChange={setShowAlerts} />
              </div>
              
              {/* Client AI Recommendations */}
              {mode === 'client' && aiRecommendations && (
                <div className="border-t pt-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">AI Safety Tips</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Area Risk Level:</span>
                        <Badge variant={aiRecommendations.riskLevel > 70 ? 'destructive' : aiRecommendations.riskLevel > 40 ? 'default' : 'secondary'}>
                          {aiRecommendations.riskLevel}%
                        </Badge>
                      </div>
                      {aiRecommendations.recommendations.slice(0, 2).map((rec, idx) => (
                        <p key={idx} className="text-xs text-blue-700">{rec}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin-only filters */}
              {mode === 'admin' && (
                <>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Incident Filters</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Pending</span>
                        <Switch 
                          checked={filters.showPending} 
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showPending: checked }))} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Resolved</span>
                        <Switch 
                          checked={filters.showResolved} 
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showResolved: checked }))} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High Severity Only</span>
                        <Switch 
                          checked={filters.showHighSeverity} 
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showHighSeverity: checked }))} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Quick Actions</p>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Right-click on map to create alert
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Enhanced Statistics */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Live Statistics
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-50 p-2 rounded">
                <div className="font-medium text-red-700">
                  {filteredIncidents.filter(i => i.severity === 'high').length + filteredAccidents.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-red-600">Critical</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-medium text-green-700">
                  {filteredIncidents.filter(i => i.status === 'resolved').length + filteredAccidents.filter(a => a.status === 'resolved').length}
                </div>
                <div className="text-green-600">Resolved</div>
              </div>
              {mode === 'police' && (
                <>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-medium text-blue-700">
                      {filteredAccidents.length}
                    </div>
                    <div className="text-blue-600">Accidents</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="font-medium text-yellow-700">
                      {emergencyUnits.filter(u => u.status === 'available').length}
                    </div>
                    <div className="text-yellow-600">Units Ready</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location */}
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>
            <div className="text-center">
              <Navigation className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Location Handler */}
        <LocationHandler userLocation={userLocation} />

        {/* Admin Map Events */}
        {mode === 'admin' && <AdminMapEvents onMapClick={handleMapClick} />}

        {/* Incident Markers */}
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lng]}
            icon={createCustomIcon(incident.severity, incident.type)}
          >
            <Popup maxWidth={300}>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{incident.title}</h3>
                    <Badge variant={incident.severity === 'high' ? 'destructive' : 
                                   incident.severity === 'medium' ? 'default' : 'secondary'}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(incident.time).toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {incident.status}
                    </Badge>
                  </div>
                </div>

                {/* Admin & Police Controls */}
                {(mode === 'admin' || mode === 'police') && (
                  <div className="border-t pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Select
                        value={incident.status}
                        onValueChange={(value: 'pending' | 'investigating' | 'resolved') => 
                          handleStatusUpdate(incident.id, value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="investigating">Investigating</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full h-8 text-xs"
                      onClick={() => {
                        if (onRemoveIncident) {
                          onRemoveIncident(incident.id)
                          toast.success('Incident removed')
                        }
                      }}
                    >
                      Remove Incident
                    </Button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Enhanced Accident Markers */}
        {filteredAccidents.map((accident) => (
          <Marker
            key={accident.id}
            position={[accident.lat, accident.lng]}
            icon={createCustomIcon(accident.severity, 'accident')}
          >
            <Popup maxWidth={350}>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-red-600" />
                    <h3 className="font-semibold text-red-700">{accident.title}</h3>
                    <Badge variant={accident.severity === 'high' ? 'destructive' : 
                                   accident.severity === 'medium' ? 'default' : 'secondary'}>
                      {accident.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{accident.description}</p>
                  
                  {/* Accident Details */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-red-50 p-2 rounded">
                        <div className="font-medium text-red-700">
                          {accident.casualties.total}
                        </div>
                        <div className="text-red-600">Casualties</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="font-medium text-blue-700">
                          {accident.vehiclesInvolved.count}
                        </div>
                        <div className="text-blue-600">Vehicles</div>
                      </div>
                    </div>
                    
                    {accident.aiAnalysis && (
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium">AI Analysis</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <span className="font-medium">{accident.aiAnalysis.riskLevel}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Est. Duration:</span>
                            <span className="font-medium">{Math.floor(accident.aiAnalysis.predictedDuration)} min</span>
                          </div>
                          <div className="text-purple-700 font-medium">
                            {accident.aiAnalysis.recommendations[0]}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(accident.time).toLocaleString()}
                      </span>
                      <Badge 
                        variant={accident.emergencyResponse.currentStatus === 'on_scene' ? 'destructive' : 'outline'} 
                        className="text-xs"
                      >
                        {accident.emergencyResponse.currentStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Police Controls */}
                {mode === 'police' && (
                  <div className="border-t pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs"
                        onClick={() => handleDispatchUnit(accident.id, 'ambulance')}
                        disabled={accident.emergencyResponse.unitsDispatched.some(u => u.includes('Ambulance'))}
                      >
                        <Ambulance className="h-3 w-3 mr-1" />
                        Ambulance
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs"
                        onClick={() => handleDispatchUnit(accident.id, 'police')}
                        disabled={accident.emergencyResponse.unitsDispatched.some(u => u.includes('Traffic Police'))}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Police
                      </Button>
                    </div>
                    
                    <Select
                      value={accident.emergencyResponse.currentStatus}
                      onValueChange={(value) => 
                        handleAccidentUpdate(accident.id, {
                          emergencyResponse: { ...accident.emergencyResponse, currentStatus: value as any }
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="en_route">En Route</SelectItem>
                        <SelectItem value="on_scene">On Scene</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Emergency Units */}
        {showUnits && mode === 'police' && emergencyUnits.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.lat, unit.lng]}
            icon={createUnitIcon(unit.type, unit.status)}
          >
            <Popup>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span className="font-semibold">{unit.id}</span>
                  <Badge 
                    variant={unit.status === 'available' ? 'secondary' : 
                            unit.status === 'dispatched' ? 'default' : 
                            unit.status === 'on_scene' ? 'destructive' : 'outline'}
                  >
                    {unit.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Type: {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}</p>
                {unit.eta && (
                  <p className="text-sm text-blue-600">ETA: {unit.eta} minutes</p>
                )}
                {unit.assignedIncident && (
                  <p className="text-sm text-red-600">Assigned to: {unit.assignedIncident}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Enhanced Alert Circles */}
        {showAlerts && alerts.map((alert) => (
          <Circle
            key={alert.id}
            center={[alert.lat, alert.lng]}
            radius={alert.radius}
            pathOptions={{
              color: alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#10b981',
              fillColor: alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#10b981',
              fillOpacity: 0.15,
              weight: 3,
              dashArray: alert.priority === 'high' ? '10, 5' : '5, 10'
            }}
          >
            <Popup>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.priority === 'high' ? 'text-red-500' :
                    alert.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <strong className={`${
                    alert.priority === 'high' ? 'text-red-700' :
                    alert.priority === 'medium' ? 'text-yellow-700' : 'text-green-700'
                  }`}>Public Alert</strong>
                  <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}>
                    {alert.priority?.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm">{alert.message}</p>
                <div className="text-xs text-gray-500">
                  Radius: {alert.radius}m | Active Area Warning
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Floating Action Button for Police */}
      {mode === 'police' && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => {
              const newAccident = generateRealtimeAccident()
              setRealTimeAccidents(prev => [newAccident, ...prev].slice(0, 10))
              toast.success('Test accident generated')
            }}
          >
            <Zap className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Create Alert Modal */}
      <Dialog open={showCreateAlert} onOpenChange={setShowCreateAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Alert
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.000001"
                  value={alertFormData.lat}
                  onChange={(e) => setAlertFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.000001"
                  value={alertFormData.lng}
                  onChange={(e) => setAlertFormData(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Alert Message</Label>
              <Textarea
                id="message"
                placeholder="Enter alert message..."
                value={alertFormData.message}
                onChange={(e) => setAlertFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="radius">Radius (meters)</Label>
              <Input
                id="radius"
                type="number"
                min="50"
                max="5000"
                value={alertFormData.radius}
                onChange={(e) => setAlertFormData(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAlert} disabled={!alertFormData.message}>
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for custom markers */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        
        .user-location-marker {
          background: none !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        .unit-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}