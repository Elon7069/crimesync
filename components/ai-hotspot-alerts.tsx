'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  Shield, 
  Brain,
  Eye,
  Bell,
  BellOff,
  Activity,
  Target,
  Zap,
  BarChart3,
  Calendar,
  ChevronRight,
  Info,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface HotspotAlert {
  id: string
  location: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  crimeType: string
  prediction: number // 0-100 probability
  trend: 'increasing' | 'stable' | 'decreasing'
  affectedArea: string
  timeframe: string
  historicalData: {
    pastIncidents: number
    timePattern: string
  }
  recommendations: string[]
  isActive: boolean
  lastUpdated: Date
}

interface AIPrediction {
  id: string
  type: 'crime_spike' | 'pattern_alert' | 'safety_advisory' | 'prevention_tip'
  title: string
  description: string
  confidence: number
  location: string
  severity: 'low' | 'medium' | 'high'
  timeRelevant: string
  actionable: boolean
}

const mockHotspots: HotspotAlert[] = [
  {
    id: '1',
    location: 'Downtown Commercial District',
    riskLevel: 'high',
    crimeType: 'Vehicle Theft',
    prediction: 78,
    trend: 'increasing',
    affectedArea: '0.5 mile radius',
    timeframe: 'Next 6-12 hours',
    historicalData: {
      pastIncidents: 12,
      timePattern: 'Peak: 8PM-2AM weekends'
    },
    recommendations: [
      'Park in well-lit areas',
      'Use secured parking garages',
      'Install vehicle anti-theft devices'
    ],
    isActive: true,
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000) // 10 min ago
  },
  {
    id: '2',
    location: 'University Campus Area',
    riskLevel: 'medium',
    crimeType: 'Bicycle Theft',
    prediction: 65,
    trend: 'stable',
    affectedArea: '0.3 mile radius',
    timeframe: 'Next 24 hours',
    historicalData: {
      pastIncidents: 8,
      timePattern: 'Peak: 10AM-4PM weekdays'
    },
    recommendations: [
      'Use two locks (U-lock + chain)',
      'Register bike with campus security',
      'Park in designated bike areas only'
    ],
    isActive: true,
    lastUpdated: new Date(Date.now() - 25 * 60 * 1000) // 25 min ago
  },
  {
    id: '3',
    location: 'Riverside Park Trail',
    riskLevel: 'medium',
    crimeType: 'Harassment',
    prediction: 45,
    trend: 'decreasing',
    affectedArea: '1.2 mile stretch',
    timeframe: 'Evening hours (6PM-9PM)',
    historicalData: {
      pastIncidents: 5,
      timePattern: 'Peak: Weekday evenings'
    },
    recommendations: [
      'Travel in groups when possible',
      'Use buddy system for evening runs',
      'Report suspicious activity immediately'
    ],
    isActive: true,
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000) // 45 min ago
  }
]

const mockPredictions: AIPrediction[] = [
  {
    id: '1',
    type: 'crime_spike',
    title: 'Vandalism Spike Expected',
    description: 'AI analysis indicates 40% higher vandalism probability in Entertainment District this weekend based on event patterns.',
    confidence: 82,
    location: 'Entertainment District',
    severity: 'medium',
    timeRelevant: 'This weekend',
    actionable: true
  },
  {
    id: '2',
    type: 'pattern_alert',
    title: 'New Crime Pattern Detected',
    description: 'Unusual pattern of break-ins detected near Transit Hub area during morning hours. Pattern emerged over last 2 weeks.',
    confidence: 91,
    location: 'Transit Hub Area',
    severity: 'high',
    timeRelevant: 'Ongoing',
    actionable: true
  },
  {
    id: '3',
    type: 'safety_advisory',
    title: 'Weather-Related Safety Advisory',
    description: 'Heavy rainfall predicted to increase slip-and-fall incidents by 25% citywide. Extra caution advised.',
    confidence: 67,
    location: 'City-wide',
    severity: 'low',
    timeRelevant: 'Next 48 hours',
    actionable: false
  }
]

export function AIHotspotAlerts() {
  const [hotspots, setHotspots] = useState<HotspotAlert[]>(mockHotspots)
  const [predictions, setPredictions] = useState<AIPrediction[]>(mockPredictions)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all')

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        const now = new Date()
        setHotspots(prev => prev.map(hotspot => ({
          ...hotspot,
          lastUpdated: now,
          prediction: Math.max(0, Math.min(100, hotspot.prediction + (Math.random() - 0.5) * 10))
        })))
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'crime_spike': return <TrendingUp className="h-4 w-4" />
      case 'pattern_alert': return <Target className="h-4 w-4" />
      case 'safety_advisory': return <Shield className="h-4 w-4" />
      case 'prevention_tip': return <Info className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just updated'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const filteredHotspots = hotspots.filter(hotspot => 
    selectedRiskLevel === 'all' || hotspot.riskLevel === selectedRiskLevel
  )

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    toast.success(notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled')
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Crime Prediction
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                />
                <Label className="text-sm">
                  {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  <span className="ml-1">Alerts</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label className="text-sm">
                  <Zap className="h-4 w-4" />
                  <span className="ml-1">Live Updates</span>
                </Label>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>Last updated: {formatTimeAgo(new Date())}</span>
            </div>
          </div>

          {/* Risk Level Filter */}
          <div className="flex gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
              <Button
                key={level}
                variant={selectedRiskLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRiskLevel(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Hotspots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Crime Hotspots
            <Badge variant="secondary">{filteredHotspots.length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredHotspots.map((hotspot, index) => (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${hotspot.riskLevel === 'critical' ? 'ring-2 ring-red-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{hotspot.location}</h3>
                          <Badge className={getRiskColor(hotspot.riskLevel)}>
                            {hotspot.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {hotspot.affectedArea}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {hotspot.timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {getTrendIcon(hotspot.trend)}
                          <span className="text-xs font-medium capitalize">{hotspot.trend}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated {formatTimeAgo(hotspot.lastUpdated)}
                        </div>
                      </div>
                    </div>

                    {/* Crime Type and Prediction */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{hotspot.crimeType}</span>
                        <span className="text-sm font-bold text-red-600">{hotspot.prediction}% risk</span>
                      </div>
                      <Progress value={hotspot.prediction} className="h-2" />
                    </div>

                    {/* Historical Data */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span>{hotspot.historicalData.pastIncidents} incidents (last 30 days)</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{hotspot.historicalData.timePattern}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Safety Recommendations
                      </h4>
                      <div className="space-y-1">
                        {hotspot.recommendations.slice(0, 2).map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                        {hotspot.recommendations.length > 2 && (
                          <Button variant="ghost" size="sm" className="h-6 text-xs p-1">
                            +{hotspot.recommendations.length - 2} more recommendations
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredHotspots.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
              <p className="text-muted-foreground">
                No high-risk crime hotspots detected for the selected criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Predictions & Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          prediction.severity === 'high' ? 'bg-red-100 text-red-600' :
                          prediction.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {getPredictionIcon(prediction.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{prediction.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{prediction.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {prediction.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {prediction.timeRelevant}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskColor(prediction.severity)}>
                          {prediction.severity.toUpperCase()}
                        </Badge>
                        <div className={`text-xs mt-1 font-medium ${getConfidenceColor(prediction.confidence)}`}>
                          {prediction.confidence}% confidence
                        </div>
                      </div>
                    </div>

                    {prediction.actionable && (
                      <div className="pt-2 border-t">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {hotspots.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground">High Risk Areas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {predictions.filter(p => p.confidence >= 75).length}
              </div>
              <div className="text-xs text-muted-foreground">High Confidence Predictions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {predictions.filter(p => p.actionable).length}
              </div>
              <div className="text-xs text-muted-foreground">Actionable Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}