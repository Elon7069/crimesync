'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cityData, safetyPredictions, crimePatterns, preventionTips, type CityData } from '@/lib/analytics-data'
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  MapPin,
  Clock,
  Users,
  Target,
  Lightbulb,
  Activity,
  BarChart3,
  Eye,
  Zap,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart,
  ScatterChart,
  Scatter
} from 'recharts'

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444'
}

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('today')
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const filteredData = selectedCity === 'all' ? cityData : cityData.filter(city => city.name === selectedCity)
  
  const totalCrimes = filteredData.reduce((sum, city) => sum + city.dailyCrimes, 0)
  const avgSafetyScore = Math.round(filteredData.reduce((sum, city) => sum + city.safetyScore, 0) / filteredData.length)
  const highRiskCities = cityData.filter(city => city.riskLevel === 'high').length

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const getRiskColor = (risk: string) => RISK_COLORS[risk as keyof typeof RISK_COLORS]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
              Crime Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time crime analysis and safety predictions across major cities
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cityData.map(city => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Daily Crimes</p>
                    <p className="text-3xl font-bold">{totalCrimes.toLocaleString()}</p>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from yesterday
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
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Safety Score</p>
                    <p className="text-3xl font-bold">{avgSafetyScore}/100</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5% this week
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
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cities Monitored</p>
                    <p className="text-3xl font-bold">{cityData.length}</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      24/7 monitoring
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
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk Cities</p>
                    <p className="text-3xl font-bold">{highRiskCities}</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <Target className="h-3 w-3 mr-1" />
                      Needs attention
                    </p>
                  </div>
                  <Activity className="h-12 w-12 text-orange-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="safety">Safety Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crime Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Crime Distribution by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(
                      filteredData.reduce((acc, city) => {
                        Object.entries(city.crimeTypes).forEach(([type, count]) => {
                          acc[type] = (acc[type] || 0) + count
                        })
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Crime Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={crimePatterns.byTime.weekly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="crimes" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* City Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  City Safety Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cityData.sort((a, b) => b.safetyScore - a.safetyScore).map((city, index) => (
                    <div key={city.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-muted-foreground">{city.state}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{city.dailyCrimes} crimes/day</p>
                          <p className="text-xs text-muted-foreground">
                            Rate: {city.crimeRate.toFixed(1)}/100k
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Progress value={city.safetyScore} className="w-20" />
                          <span className="text-sm font-medium">{city.safetyScore}%</span>
                        </div>
                        
                        <Badge 
                          variant={city.riskLevel === 'low' ? 'secondary' : city.riskLevel === 'medium' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {city.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crime Intensity Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Crime Intensity Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 h-64">
                    {cityData.map((city) => (
                      <motion.div
                        key={city.name}
                        whileHover={{ scale: 1.05 }}
                        className={`rounded-lg p-4 flex flex-col justify-between cursor-pointer transition-all ${
                          city.riskLevel === 'high' ? 'bg-red-100 dark:bg-red-950 border-red-300' :
                          city.riskLevel === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300' :
                          'bg-green-100 dark:bg-green-950 border-green-300'
                        }`}
                        style={{
                          boxShadow: `0 4px 20px ${getRiskColor(city.riskLevel)}40`
                        }}
                      >
                        <div>
                          <p className="font-medium text-sm">{city.name}</p>
                          <p className="text-xs text-muted-foreground">{city.state}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{city.dailyCrimes}</p>
                          <p className="text-xs">crimes/day</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time-based Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hourly Crime Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={crimePatterns.byTime.hourly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="crimes" 
                        stroke="#ef4444" 
                        fill="#ef444440" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Location Hotspots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Crime Hotspots by Location Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crimePatterns.byLocation.hotspots.map((hotspot, index) => (
                    <div key={hotspot.area} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{hotspot.area}</p>
                        <Badge variant="outline">{hotspot.percentage}%</Badge>
                      </div>
                      <Progress value={hotspot.percentage} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {hotspot.crimes} incidents
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6 mt-6">
            {/* Risk Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI-Powered Risk Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safetyPredictions.map((prediction, index) => (
                    <Alert key={index} className={`border-l-4 ${
                      prediction.riskPercentage > 60 ? 'border-l-red-500' :
                      prediction.riskPercentage > 40 ? 'border-l-yellow-500' :
                      'border-l-green-500'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center gap-2">
                        {prediction.location}
                        <Badge variant={
                          prediction.riskPercentage > 60 ? 'destructive' :
                          prediction.riskPercentage > 40 ? 'default' : 'secondary'
                        }>
                          {prediction.riskPercentage}% Risk
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">
                          <strong>Time:</strong> {prediction.timeOfDay} | 
                          <strong> Primary Risk:</strong> {prediction.primaryRisk}
                        </p>
                        <div className="space-y-1">
                          <p className="font-medium">Prevention Tips:</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {prediction.recommendations.slice(0, 2).map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>

              {/* Risk Scatter Plot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk vs Safety Score Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart
                      data={cityData.map(city => ({
                        name: city.name,
                        safetyScore: city.safetyScore,
                        crimeRate: city.crimeRate,
                        dailyCrimes: city.dailyCrimes
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="safetyScore" name="Safety Score" />
                      <YAxis dataKey="crimeRate" name="Crime Rate" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p>Safety Score: {data.safetyScore}%</p>
                                <p>Crime Rate: {data.crimeRate}</p>
                                <p>Daily Crimes: {data.dailyCrimes}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter dataKey="crimeRate" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Crime Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={cityData[0].trends.month.map((crimes, index) => ({
                      day: index + 1,
                      crimes,
                      avg: 1200
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area dataKey="crimes" fill="#3b82f640" stroke="#3b82f6" />
                      <Line dataKey="avg" stroke="#ef4444" strokeDasharray="3 3" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crime Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Crime Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          filteredData.reduce((acc, city) => {
                            Object.entries(city.crimeTypes).forEach(([type, count]) => {
                              acc[type] = (acc[type] || 0) + count
                            })
                            return acc
                          }, {} as Record<string, number>)
                        ).map(([type, count]) => ({ 
                          name: type.charAt(0).toUpperCase() + type.slice(1), 
                          value: count,
                          percentage: Math.round((count / totalCrimes) * 100)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(
                          filteredData.reduce((acc, city) => {
                            Object.entries(city.crimeTypes).forEach(([type, count]) => {
                              acc[type] = (acc[type] || 0) + count
                            })
                            return acc
                          }, {} as Record<string, number>)
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6 mt-6">
            {/* Safety Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    General Safety Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {preventionTips.general.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time-Specific Safety Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(preventionTips.byTime).map(([time, tips]) => (
                    <div key={time}>
                      <h4 className="font-medium mb-2 capitalize">
                        {time.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="space-y-2">
                        {tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            <p className="text-sm text-muted-foreground">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Location-specific Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location-Specific Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(preventionTips.byLocation).map(([location, tips]) => (
                    <div key={location} className="space-y-3">
                      <h4 className="font-medium capitalize text-lg">
                        {location} Areas
                      </h4>
                      <div className="space-y-2">
                        {tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                            <Target className="h-3 w-3 text-blue-600 mt-1 shrink-0" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}