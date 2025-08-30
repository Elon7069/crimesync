'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { listenToCombinedAlerts, CombinedAlert, CrimeReport, SosAlert } from '@/lib/firebase'
import { SimpleMap } from './simple-map'
import { 
  Search, 
  Filter, 
  MapPin, 
  Layers,
  RefreshCw,
  Navigation
} from 'lucide-react'
import { toast } from 'sonner'

const crimeTypes = [
  { value: 'theft', label: 'Theft/Robbery' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'accident', label: 'Accident' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'assault', label: 'Assault' },
  { value: 'burglary', label: 'Burglary' }
]

interface MapFilters {
  category: string
  severity: string
  timeRange: string
  searchLocation: string
  showSos: boolean
  showReports: boolean
}

const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
]

export function CrimeMap() {
  const [alerts, setAlerts] = useState<CombinedAlert[]>([])
  const [filters, setFilters] = useState<MapFilters>({
    category: 'all',
    severity: 'all',
    timeRange: 'all',
    searchLocation: '',
    showSos: true,
    showReports: true,
  })
  const [isClient, setIsClient] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        () => console.log('Location access denied')
      )
    }

    const unsubscribe = listenToCombinedAlerts(setAlerts)
    return () => unsubscribe()
  }, [])

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (!filters.showSos && alert.alertType === 'sos') return false;
      if (!filters.showReports && alert.alertType === 'report') return false;

      if (alert.alertType === 'report') {
        if (filters.category !== 'all' && alert.type !== filters.category) return false
        if (filters.severity !== 'all' && alert.severity !== filters.severity) return false
      }
      
      const now = new Date()
      const alertDate = alert.timestamp.toDate()
      switch (filters.timeRange) {
        case '24h':
          return now.getTime() - alertDate.getTime() <= 24 * 60 * 60 * 1000
        case '7d':
          return now.getTime() - alertDate.getTime() <= 7 * 24 * 60 * 60 * 1000
        case '30d':
          return now.getTime() - alertDate.getTime() <= 30 * 24 * 60 * 60 * 1000
        default:
          return true
      }
    })
  }, [alerts, filters])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Data is real-time, so we just show a toast
    setTimeout(() => {
        setIsRefreshing(false)
        toast.success('Map data is live and up-to-date.')
    }, 1000)
  }

  if (!isClient) {
    return <div className="h-[600px] bg-muted rounded-lg animate-pulse flex items-center justify-center">Loading Map...</div>
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Filter />Filters & View Options</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.category} onValueChange={(v) => setFilters(p => ({...p, category: v}))}>
              <SelectTrigger><SelectValue placeholder="Crime Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {crimeTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.severity} onValueChange={(v) => setFilters(p => ({...p, severity: v}))}>
              <SelectTrigger><SelectValue placeholder="Severity Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.timeRange} onValueChange={(v) => setFilters(p => ({...p, timeRange: v}))}>
              <SelectTrigger><SelectValue placeholder="Time Range" /></SelectTrigger>
              <SelectContent>
                {timeRanges.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center space-x-2">
              <Switch checked={filters.showReports} onCheckedChange={(c) => setFilters(p => ({...p, showReports: c}))} />
              <label>Show Reports</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={filters.showSos} onCheckedChange={(c) => setFilters(p => ({...p, showSos: c}))} />
              <label>Show SOS Alerts</label>
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <SimpleMap 
        alerts={filteredAlerts}
        center={[28.6139, 77.2090]}
        zoom={12}
        userLocation={userLocation}
      />
    </div>
  )
}
