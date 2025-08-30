import { Incident, Alert } from '@/components/MapView'

// Sample incident data for Delhi region
export const sampleIncidents: Incident[] = [
  {
    id: '1',
    title: 'Traffic Accident on NH-1',
    description: 'Multi-vehicle collision reported near Azadpur Metro Station. Emergency services dispatched.',
    severity: 'high',
    lat: 28.7041,
    lng: 77.1025,
    status: 'investigating',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: 'accident'
  },
  {
    id: '2',
    title: 'Theft at Connaught Place',
    description: 'Mobile phone snatching reported near Metro Station Exit 3. Suspect fled towards Palika Bazaar.',
    severity: 'medium',
    lat: 28.6315,
    lng: 77.2167,
    status: 'pending',
    time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    type: 'theft'
  },
  {
    id: '3',
    title: 'Fire Incident in Karol Bagh',
    description: 'Small fire reported in commercial building. Fire brigade on site, situation under control.',
    severity: 'high',
    lat: 28.6507,
    lng: 77.1934,
    status: 'resolved',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    type: 'emergency'
  },
  {
    id: '4',
    title: 'Harassment at DU Campus',
    description: 'Verbal harassment incident reported near North Campus. Campus security notified.',
    severity: 'medium',
    lat: 28.6872,
    lng: 77.2091,
    status: 'investigating',
    time: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
    type: 'harassment'
  },
  {
    id: '5',
    title: 'Vandalism in Lajpat Nagar',
    description: 'Property damage reported in market area. Shopkeepers seeking police assistance.',
    severity: 'low',
    lat: 28.5677,
    lng: 77.2437,
    status: 'pending',
    time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    type: 'vandalism'
  },
  {
    id: '6',
    title: 'Road Rage Incident',
    description: 'Altercation between drivers on Ring Road near AIIMS. Traffic police investigating.',
    severity: 'medium',
    lat: 28.5672,
    lng: 77.2100,
    status: 'investigating',
    time: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    type: 'assault'
  },
  {
    id: '7',
    title: 'Burglary Attempt in Defence Colony',
    description: 'Attempted break-in reported in residential area. Security guards spotted suspicious activity.',
    severity: 'high',
    lat: 28.5729,
    lng: 77.2302,
    status: 'pending',
    time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    type: 'burglary'
  },
  {
    id: '8',
    title: 'Public Disturbance at India Gate',
    description: 'Large crowd gathering causing traffic disruption. Additional patrol units deployed.',
    severity: 'low',
    lat: 28.6129,
    lng: 77.2295,
    status: 'resolved',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    type: 'disturbance'
  },
  {
    id: '9',
    title: 'Chain Snatching in Nehru Place',
    description: 'Gold chain theft reported near metro station. CCTV footage being reviewed.',
    severity: 'medium',
    lat: 28.5495,
    lng: 77.2536,
    status: 'investigating',
    time: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    type: 'theft'
  },
  {
    id: '10',
    title: 'Gas Leak in Rohini',
    description: 'Suspected gas leak reported in residential sector. Gas agency and fire services alerted.',
    severity: 'high',
    lat: 28.7196,
    lng: 77.1018,
    status: 'investigating',
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    type: 'emergency'
  }
]

// Sample alerts data
export const sampleAlerts: Alert[] = [
  {
    id: 'alert-1',
    message: 'High Crime Area - Exercise caution when traveling alone, especially after dark.',
    lat: 28.6315,
    lng: 77.2167,
    radius: 500,
    priority: 'high'
  },
  {
    id: 'alert-2',
    message: 'Traffic Congestion - Avoid this route during peak hours due to ongoing construction work.',
    lat: 28.7041,
    lng: 77.1025,
    radius: 800,
    priority: 'medium'
  },
  {
    id: 'alert-3',
    message: 'Protest Area - Peaceful demonstration in progress. Expect delays and increased police presence.',
    lat: 28.6129,
    lng: 77.2295,
    radius: 300,
    priority: 'low'
  },
  {
    id: 'alert-4',
    message: 'Emergency Services Active - Fire and rescue operations in progress. Road closures in effect.',
    lat: 28.6507,
    lng: 77.1934,
    radius: 400,
    priority: 'high'
  },
  {
    id: 'alert-5',
    message: 'Safe Zone - Well-lit area with active CCTV monitoring and regular patrol presence.',
    lat: 28.5729,
    lng: 77.2302,
    radius: 600,
    priority: 'low'
  }
]

// Historical incidents for admin view
export const historicalIncidents: Incident[] = [
  {
    id: 'hist-1',
    title: 'Resolved: Bank Fraud Case',
    description: 'ATM fraud case successfully resolved. Suspects apprehended and funds recovered.',
    severity: 'high',
    lat: 28.6289,
    lng: 77.2065,
    status: 'resolved',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'fraud'
  },
  {
    id: 'hist-2',
    title: 'Resolved: Missing Person Case',
    description: 'Missing teenager found safe with relatives. Case closed.',
    severity: 'medium',
    lat: 28.5355,
    lng: 77.3910,
    status: 'resolved',
    time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'missing_person'
  },
  {
    id: 'hist-3',
    title: 'Resolved: Drug Bust Operation',
    description: 'Successful drug bust operation completed. Large quantity of contraband seized.',
    severity: 'high',
    lat: 28.4595,
    lng: 77.0266,
    status: 'resolved',
    time: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    type: 'drugs'
  }
]

// Recent accidents with detailed information
export const recentAccidents: Incident[] = sampleIncidents.filter(incident => 
  incident.type === 'accident' || incident.title.toLowerCase().includes('accident')
).map(incident => ({
  ...incident,
  description: `${incident.description} | Emergency Response Time: ${Math.floor(Math.random() * 15) + 5} minutes | Casualties: ${Math.floor(Math.random() * 3)} | Vehicles Involved: ${Math.floor(Math.random() * 4) + 1}`
}))

// Function to generate real-time updates
export const generateRealtimeIncident = (): Incident => {
  const types = ['theft', 'accident', 'harassment', 'vandalism', 'burglary', 'assault']
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  const statuses: ('pending' | 'investigating' | 'resolved')[] = ['pending', 'investigating']
  
  // Random location within Delhi bounds
  const lat = 28.4 + Math.random() * 0.6 // Delhi latitude range
  const lng = 77.0 + Math.random() * 0.5 // Delhi longitude range
  
  const type = types[Math.floor(Math.random() * types.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  return {
    id: `live-${Date.now()}`,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Incident`,
    description: `New ${type} incident reported. Authorities have been notified and are responding.`,
    severity,
    lat,
    lng,
    status,
    time: new Date().toISOString(),
    type
  }
}

// Crime hotspots data for heatmap
export const crimeHotspots = [
  { lat: 28.6315, lng: 77.2167, intensity: 0.9 }, // Connaught Place
  { lat: 28.6507, lng: 77.1934, intensity: 0.8 }, // Karol Bagh
  { lat: 28.7041, lng: 77.1025, intensity: 0.7 }, // Model Town
  { lat: 28.5677, lng: 77.2437, intensity: 0.6 }, // Lajpat Nagar
  { lat: 28.5495, lng: 77.2536, intensity: 0.8 }, // Nehru Place
  { lat: 28.6872, lng: 77.2091, intensity: 0.5 }, // DU Campus
  { lat: 28.6129, lng: 77.2295, intensity: 0.4 }, // India Gate
  { lat: 28.5729, lng: 77.2302, intensity: 0.6 }, // Defence Colony
  { lat: 28.7196, lng: 77.1018, intensity: 0.7 }, // Rohini
]

// Enhanced accident interface with detailed real-time data
export interface AccidentData extends Incident {
  emergencyResponse: {
    responseTime: number // minutes
    unitsDispatched: string[]
    currentStatus: 'dispatched' | 'on_scene' | 'en_route' | 'resolved'
    estimatedClearTime?: string
  }
  casualties: {
    total: number
    injured: number
    critical: number
    fatalities: number
  }
  vehiclesInvolved: {
    count: number
    types: string[]
    damage: 'minor' | 'moderate' | 'severe' | 'total'
  }
  trafficImpact: {
    lanesBlocked: number
    alternateRoutes: string[]
    congestionLevel: 'low' | 'medium' | 'high' | 'severe'
  }
  aiAnalysis?: {
    riskLevel: number // 0-100
    predictedDuration: number // minutes
    recommendations: string[]
    similarIncidents: number
    weatherFactor: boolean
    timeOfDayFactor: 'rush_hour' | 'off_peak' | 'night'
  }
  witnesses?: {
    count: number
    contactable: number
  }
  evidence: {
    cctv: boolean
    dashcam: boolean
    photos: number
    policeReport: boolean
  }
}

// Enhanced real-time accidents with comprehensive data
export const enhancedAccidents: AccidentData[] = [
  {
    id: 'acc-1',
    title: 'Multi-Vehicle Collision on NH-1',
    description: 'Severe 4-vehicle collision blocking 3 lanes. Emergency services on scene.',
    severity: 'high',
    lat: 28.7041,
    lng: 77.1025,
    status: 'investigating',
    time: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    type: 'accident',
    emergencyResponse: {
      responseTime: 8,
      unitsDispatched: ['Ambulance-101', 'Fire-205', 'Traffic Police-12', 'Crane Service'],
      currentStatus: 'on_scene',
      estimatedClearTime: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    },
    casualties: {
      total: 6,
      injured: 4,
      critical: 2,
      fatalities: 0
    },
    vehiclesInvolved: {
      count: 4,
      types: ['Sedan', 'SUV', 'Truck', 'Motorcycle'],
      damage: 'severe'
    },
    trafficImpact: {
      lanesBlocked: 3,
      alternateRoutes: ['Ring Road', 'GT Karnal Road'],
      congestionLevel: 'severe'
    },
    aiAnalysis: {
      riskLevel: 85,
      predictedDuration: 90,
      recommendations: [
        'Avoid NH-1 for next 2 hours',
        'Use Ring Road as alternate',
        'Heavy traffic expected until 8 PM'
      ],
      similarIncidents: 12,
      weatherFactor: false,
      timeOfDayFactor: 'rush_hour'
    },
    witnesses: {
      count: 8,
      contactable: 5
    },
    evidence: {
      cctv: true,
      dashcam: true,
      photos: 15,
      policeReport: true
    }
  },
  {
    id: 'acc-2',
    title: 'Minor Collision at ITO Intersection',
    description: 'Two-vehicle collision at signal. Minor injuries reported.',
    severity: 'medium',
    lat: 28.6280,
    lng: 77.2420,
    status: 'investigating',
    time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: 'accident',
    emergencyResponse: {
      responseTime: 12,
      unitsDispatched: ['Ambulance-205', 'Traffic Police-08'],
      currentStatus: 'resolved',
    },
    casualties: {
      total: 2,
      injured: 2,
      critical: 0,
      fatalities: 0
    },
    vehiclesInvolved: {
      count: 2,
      types: ['Car', 'Auto-rickshaw'],
      damage: 'minor'
    },
    trafficImpact: {
      lanesBlocked: 1,
      alternateRoutes: ['Mathura Road', 'Bahadur Shah Zafar Marg'],
      congestionLevel: 'low'
    },
    aiAnalysis: {
      riskLevel: 35,
      predictedDuration: 20,
      recommendations: [
        'Minor delay expected',
        'Normal traffic flow resuming'
      ],
      similarIncidents: 28,
      weatherFactor: false,
      timeOfDayFactor: 'off_peak'
    },
    witnesses: {
      count: 3,
      contactable: 2
    },
    evidence: {
      cctv: true,
      dashcam: false,
      photos: 6,
      policeReport: true
    }
  }
]

// AI-powered incident generation with enhanced accident focus
export const generateRealtimeAccident = (): AccidentData => {
  const accidentTypes = [
    'collision', 'rear-end', 'side-impact', 'rollover', 
    'hit-and-run', 'pedestrian', 'motorcycle', 'bus'
  ]
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  const vehicleTypes = ['Car', 'SUV', 'Truck', 'Motorcycle', 'Bus', 'Auto-rickshaw']
  
  // High-risk accident zones in Delhi
  const accidentHotspots = [
    { lat: 28.7041, lng: 77.1025, area: 'NH-1 Azadpur' },
    { lat: 28.6280, lng: 77.2420, area: 'ITO Intersection' },
    { lat: 28.5672, lng: 77.2100, area: 'Ring Road AIIMS' },
    { lat: 28.6507, lng: 77.1934, area: 'Karol Bagh Market' },
    { lat: 28.6315, lng: 77.2167, area: 'Connaught Place' }
  ]
  
  const hotspot = accidentHotspots[Math.floor(Math.random() * accidentHotspots.length)]
  const accidentType = accidentTypes[Math.floor(Math.random() * accidentTypes.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const vehicleCount = Math.floor(Math.random() * 4) + 1
  const casualtyCount = severity === 'high' ? Math.floor(Math.random() * 6) + 2 : 
                      severity === 'medium' ? Math.floor(Math.random() * 3) + 1 : 
                      Math.floor(Math.random() * 2)
  
  // AI risk assessment
  const timeOfDay = new Date().getHours()
  const isRushHour = (timeOfDay >= 8 && timeOfDay <= 10) || (timeOfDay >= 17 && timeOfDay <= 20)
  const riskLevel = severity === 'high' ? 70 + Math.random() * 30 :
                   severity === 'medium' ? 40 + Math.random() * 30 :
                   10 + Math.random() * 30
  
  return {
    id: `live-acc-${Date.now()}`,
    title: `${accidentType.charAt(0).toUpperCase() + accidentType.slice(1)} Accident at ${hotspot.area}`,
    description: `${accidentType} accident involving ${vehicleCount} vehicle(s). Emergency response activated.`,
    severity,
    lat: hotspot.lat + (Math.random() - 0.5) * 0.01,
    lng: hotspot.lng + (Math.random() - 0.5) * 0.01,
    status: 'pending',
    time: new Date().toISOString(),
    type: 'accident',
    emergencyResponse: {
      responseTime: Math.floor(Math.random() * 20) + 5,
      unitsDispatched: [
        `Ambulance-${Math.floor(Math.random() * 300) + 100}`,
        `Traffic Police-${Math.floor(Math.random() * 20) + 1}`,
        ...(severity === 'high' ? [`Fire-${Math.floor(Math.random() * 50) + 200}`] : [])
      ],
      currentStatus: 'dispatched'
    },
    casualties: {
      total: casualtyCount,
      injured: Math.max(0, casualtyCount - 1),
      critical: severity === 'high' ? Math.floor(casualtyCount / 3) : 0,
      fatalities: severity === 'high' && Math.random() > 0.8 ? 1 : 0
    },
    vehiclesInvolved: {
      count: vehicleCount,
      types: Array.from({length: vehicleCount}, () => 
        vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
      ),
      damage: severity === 'high' ? 'severe' : severity === 'medium' ? 'moderate' : 'minor'
    },
    trafficImpact: {
      lanesBlocked: Math.min(Math.floor(Math.random() * 3) + 1, severity === 'high' ? 3 : 2),
      alternateRoutes: ['Ring Road', 'Outer Ring Road', 'NH-24'],
      congestionLevel: severity === 'high' ? 'severe' : severity === 'medium' ? 'high' : 'medium'
    },
    aiAnalysis: {
      riskLevel: Math.floor(riskLevel),
      predictedDuration: severity === 'high' ? 60 + Math.random() * 60 : 
                        severity === 'medium' ? 30 + Math.random() * 30 : 
                        15 + Math.random() * 15,
      recommendations: [
        `Avoid ${hotspot.area} area`,
        isRushHour ? 'Heavy traffic expected during rush hour' : 'Monitor traffic updates',
        severity === 'high' ? 'Seek immediate alternate route' : 'Minor delays expected'
      ],
      similarIncidents: Math.floor(Math.random() * 50) + 10,
      weatherFactor: Math.random() > 0.7,
      timeOfDayFactor: isRushHour ? 'rush_hour' : timeOfDay < 6 || timeOfDay > 22 ? 'night' : 'off_peak'
    },
    witnesses: {
      count: Math.floor(Math.random() * 10) + 2,
      contactable: Math.floor(Math.random() * 5) + 1
    },
    evidence: {
      cctv: Math.random() > 0.4,
      dashcam: Math.random() > 0.6,
      photos: Math.floor(Math.random() * 20) + 5,
      policeReport: true
    }
  }
}

// AI Safety Recommendations Engine
export const aiSafetyRecommendations = {
  getRealTimeRecommendations: (lat: number, lng: number, time: Date) => {
    const hour = time.getHours()
    const dayOfWeek = time.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isNight = hour < 6 || hour > 22
    const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)
    
    // Find nearest hotspot
    const nearestHotspot = crimeHotspots.reduce((closest, hotspot) => {
      const distance = Math.sqrt(
        Math.pow(lat - hotspot.lat, 2) + Math.pow(lng - hotspot.lng, 2)
      )
      return distance < closest.distance ? { ...hotspot, distance } : closest
    }, { lat: 0, lng: 0, intensity: 0, distance: Infinity })
    
    const recommendations = []
    const riskLevel = nearestHotspot.intensity * 100
    
    if (riskLevel > 70) {
      recommendations.push('High Crime Area: Exercise extreme caution')
      recommendations.push('Consider alternate route if possible')
      recommendations.push('Stay in well-lit, populated areas')
    }
    
    if (isNight && riskLevel > 50) {
      recommendations.push('Night Time Risk: Avoid traveling alone')
      recommendations.push('Use verified transportation services')
    }
    
    if (isRushHour) {
      recommendations.push('Rush Hour: Stay alert in crowded areas')
      recommendations.push('Keep valuables secure')
    }
    
    if (isWeekend && riskLevel > 60) {
      recommendations.push('Weekend Alert: Increased social activity may affect safety')
    }
    
    return {
      riskLevel: Math.floor(riskLevel),
      recommendations,
      nearestStation: 'Police Station within 2km',
      emergencyContacts: ['100 - Police', '102 - Ambulance', '101 - Fire']
    }
  },
  
  predictAccidentRisk: (lat: number, lng: number, weatherCondition: string = 'clear') => {
    const hour = new Date().getHours()
    const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)
    const isWeatherPoor = ['rain', 'fog', 'storm'].includes(weatherCondition.toLowerCase())
    
    let baseRisk = 30
    if (isRushHour) baseRisk += 25
    if (isWeatherPoor) baseRisk += 20
    
    // Check proximity to accident hotspots
    const accidentProne = [
      { lat: 28.7041, lng: 77.1025, risk: 40 }, // NH-1
      { lat: 28.6280, lng: 77.2420, risk: 35 }, // ITO
      { lat: 28.5672, lng: 77.2100, risk: 30 }, // Ring Road
    ]
    
    const nearbyRisk = accidentProne.reduce((max, zone) => {
      const distance = Math.sqrt(
        Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
      )
      return distance < 0.01 ? Math.max(max, zone.risk) : max
    }, 0)
    
    const totalRisk = Math.min(baseRisk + nearbyRisk, 100)
    
    return {
      riskLevel: totalRisk,
      category: totalRisk > 70 ? 'high' : totalRisk > 40 ? 'medium' : 'low',
      recommendations: [
        totalRisk > 70 ? 'High accident risk zone - drive carefully' : '',
        isRushHour ? 'Rush hour - expect heavy traffic' : '',
        isWeatherPoor ? 'Poor weather conditions - reduce speed' : '',
      ].filter(Boolean)
    }
  }
}

// AI Pattern Recognition for Police
export const policeAIInsights = {
  getPatternAnalysis: (incidents: Incident[]) => {
    const patterns = {
      timePatterns: {},
      locationClusters: [],
      typeFrequency: {},
      severityTrends: [],
      prediction: {
        nextLikelyIncident: null,
        riskAreas: [],
        timeWindows: []
      }
    }
    
    // Analyze time patterns
    incidents.forEach(incident => {
      const hour = new Date(incident.time).getHours()
      patterns.timePatterns[hour] = (patterns.timePatterns[hour] || 0) + 1
      patterns.typeFrequency[incident.type] = (patterns.typeFrequency[incident.type] || 0) + 1
    })
    
    // Predict high-risk time windows
    patterns.prediction.timeWindows = [
      { start: '08:00', end: '10:00', risk: 'high', reason: 'Morning rush hour' },
      { start: '17:00', end: '20:00', risk: 'high', reason: 'Evening rush hour' },
      { start: '22:00', end: '02:00', risk: 'medium', reason: 'Late night activities' }
    ]
    
    return patterns
  },
  
  getResourceAllocation: (activeIncidents: AccidentData[]) => {
    const highPriorityCount = activeIncidents.filter(i => i.severity === 'high').length
    const mediumPriorityCount = activeIncidents.filter(i => i.severity === 'medium').length
    const ongoingAccidents = activeIncidents.filter(i => i.type === 'accident' && i.status !== 'resolved')
    
    return {
      recommendedUnits: {
        ambulances: Math.max(2, highPriorityCount * 2 + mediumPriorityCount),
        patrolCars: Math.max(3, activeIncidents.length),
        trafficPolice: Math.max(2, ongoingAccidents.length * 2)
      },
      criticalAreas: ongoingAccidents.map(acc => ({
        location: `${acc.lat.toFixed(4)}, ${acc.lng.toFixed(4)}`,
        priority: acc.severity,
        estimatedClearTime: acc.emergencyResponse.estimatedClearTime
      })),
      efficiency: {
        averageResponseTime: '8.5 minutes',
        clearanceRate: '87%',
        resourceUtilization: '75%'
      }
    }
  }
}

// SOS Alert System
export interface SOSAlert {
  id: string
  userId: string
  userName: string
  userPhone: string
  emergencyType: 'medical' | 'assault' | 'theft' | 'harassment' | 'accident' | 'fire' | 'other'
  location: {
    lat: number
    lng: number
    address: string
    accuracy: number
  }
  message: string
  timestamp: string
  status: 'active' | 'responded' | 'resolved' | 'false_alarm'
  priority: 'critical' | 'high' | 'medium' | 'low'
  responders?: {
    unitId: string
    unitType: string
    eta: number
  }[]
  media?: {
    photos: string[]
    audio?: string
    video?: string
  }
  vitals?: {
    heartRate?: number
    location_accuracy: number
    battery_level: number
    last_known_location?: {
      lat: number
      lng: number
      timestamp: string
    }
  }
}

// Sample SOS Alerts
export const activeSOS: SOSAlert[] = [
  {
    id: 'sos-001',
    userId: 'user-12345',
    userName: 'Sarah Johnson',
    userPhone: '+91-98765-43210',
    emergencyType: 'assault',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Near India Gate Metro Station, New Delhi',
      accuracy: 5
    },
    message: 'Someone following me, feels unsafe. Please help immediately!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'active',
    priority: 'critical',
    responders: [
      { unitId: 'POL-024', unitType: 'patrol', eta: 3 }
    ],
    vitals: {
      heartRate: 135,
      location_accuracy: 5,
      battery_level: 78,
      last_known_location: {
        lat: 28.6139,
        lng: 77.2090,
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString()
      }
    },
    media: {
      photos: ['emergency_photo_1.jpg'],
      audio: 'emergency_audio.mp3'
    }
  },
  {
    id: 'sos-002',
    userId: 'user-67890',
    userName: 'Rajesh Kumar',
    userPhone: '+91-87654-32109',
    emergencyType: 'medical',
    location: {
      lat: 28.6507,
      lng: 77.1934,
      address: 'Karol Bagh Market, Block A',
      accuracy: 8
    },
    message: 'Chest pain, difficulty breathing. Need ambulance urgently.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'responded',
    priority: 'critical',
    responders: [
      { unitId: 'AMB-103', unitType: 'ambulance', eta: 7 },
      { unitId: 'POL-019', unitType: 'patrol', eta: 5 }
    ],
    vitals: {
      heartRate: 98,
      location_accuracy: 8,
      battery_level: 45
    }
  },
  {
    id: 'sos-003',
    userId: 'user-11111',
    userName: 'Priya Sharma',
    userPhone: '+91-76543-21098',
    emergencyType: 'theft',
    location: {
      lat: 28.5495,
      lng: 77.2536,
      address: 'Nehru Place Metro Station Exit 2',
      accuracy: 10
    },
    message: 'Phone and bag snatched by two men on motorcycle.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'resolved',
    priority: 'high',
    vitals: {
      location_accuracy: 10,
      battery_level: 89
    }
  }
]

// Generate real-time SOS alerts
export const generateRealtimeSOSAlert = (): SOSAlert => {
  const emergencyTypes: SOSAlert['emergencyType'][] = ['medical', 'assault', 'theft', 'harassment', 'accident', 'fire']
  const names = ['Anita Singh', 'Rohit Gupta', 'Sneha Patel', 'Vikash Kumar', 'Deepika Yadav', 'Sanjay Sharma']
  const addresses = [
    'Connaught Place Metro Station', 'Karol Bagh Main Market', 'Lajpat Nagar Central Market',
    'Nehru Place Bus Terminal', 'Defence Colony Flyover', 'India Gate Lawns'
  ]
  
  const emergencyType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)]
  const priority = ['medical', 'assault', 'accident'].includes(emergencyType) ? 'critical' : 
                   Math.random() > 0.5 ? 'high' : 'medium'
  
  const lat = 28.4 + Math.random() * 0.6
  const lng = 77.0 + Math.random() * 0.5
  
  return {
    id: `sos-${Date.now()}`,
    userId: `user-${Math.floor(Math.random() * 99999)}`,
    userName: names[Math.floor(Math.random() * names.length)],
    userPhone: `+91-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 90000) + 10000}`,
    emergencyType,
    location: { lat, lng, address: addresses[Math.floor(Math.random() * addresses.length)], accuracy: Math.floor(Math.random() * 15) + 3 },
    message: `Emergency: ${emergencyType} situation. Need immediate help!`,
    timestamp: new Date().toISOString(),
    status: 'active',
    priority,
    vitals: {
      heartRate: priority === 'critical' ? 120 + Math.floor(Math.random() * 40) : 70 + Math.floor(Math.random() * 30),
      location_accuracy: Math.floor(Math.random() * 15) + 3,
      battery_level: Math.floor(Math.random() * 80) + 20
    }
  }
}