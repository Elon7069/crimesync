// Comprehensive crime analytics data for major Indian cities
export interface CityData {
  name: string
  state: string
  coordinates: [number, number] // [lat, lng]
  population: number
  crimeRate: number // crimes per 100,000 people
  dailyCrimes: number
  riskLevel: 'low' | 'medium' | 'high'
  safetyScore: number // 0-100
  crimeTypes: {
    theft: number
    assault: number
    harassment: number
    burglary: number
    vandalism: number
    accident: number
  }
  trends: {
    week: number[]
    month: number[]
  }
}

export interface SafetyPrediction {
  location: string
  timeOfDay: string
  riskPercentage: number
  primaryRisk: string
  recommendations: string[]
}

export const cityData: CityData[] = [
  {
    name: "Delhi",
    state: "Delhi",
    coordinates: [28.6139, 77.2090],
    population: 32900000,
    crimeRate: 1234.5,
    dailyCrimes: 1247,
    riskLevel: 'high',
    safetyScore: 42,
    crimeTypes: {
      theft: 456,
      assault: 189,
      harassment: 267,
      burglary: 134,
      vandalism: 89,
      accident: 112
    },
    trends: {
      week: [1180, 1205, 1156, 1289, 1347, 1401, 1267],
      month: [1247, 1189, 1298, 1345, 1156, 1289, 1234, 1367, 1298, 1201, 1156, 1234, 1289, 1345, 1267, 1198, 1234, 1289, 1156, 1201, 1267, 1345, 1234, 1189, 1298, 1267, 1234, 1201, 1156, 1289]
    }
  },
  {
    name: "Mumbai",
    state: "Maharashtra", 
    coordinates: [19.0760, 72.8777],
    population: 20700000,
    crimeRate: 987.3,
    dailyCrimes: 892,
    riskLevel: 'high',
    safetyScore: 52,
    crimeTypes: {
      theft: 334,
      assault: 156,
      harassment: 201,
      burglary: 98,
      vandalism: 67,
      accident: 87
    },
    trends: {
      week: [845, 867, 834, 923, 956, 989, 892],
      month: [892, 845, 923, 956, 834, 923, 878, 967, 923, 856, 834, 878, 923, 956, 892, 845, 878, 923, 834, 856, 892, 956, 878, 845, 923, 892, 878, 856, 834, 923]
    }
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    population: 13200000,
    crimeRate: 678.2,
    dailyCrimes: 543,
    riskLevel: 'medium',
    safetyScore: 68,
    crimeTypes: {
      theft: 198,
      assault: 89,
      harassment: 134,
      burglary: 67,
      vandalism: 34,
      accident: 56
    },
    trends: {
      week: [512, 534, 498, 567, 587, 601, 543],
      month: [543, 512, 567, 587, 498, 567, 534, 598, 567, 523, 498, 534, 567, 587, 543, 512, 534, 567, 498, 523, 543, 587, 534, 512, 567, 543, 534, 523, 498, 567]
    }
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707],
    population: 11700000,
    crimeRate: 598.7,
    dailyCrimes: 467,
    riskLevel: 'medium',
    safetyScore: 72,
    crimeTypes: {
      theft: 167,
      assault: 78,
      harassment: 112,
      burglary: 56,
      vandalism: 29,
      accident: 45
    },
    trends: {
      week: [441, 456, 423, 489, 512, 498, 467],
      month: [467, 441, 489, 512, 423, 489, 456, 523, 489, 448, 423, 456, 489, 512, 467, 441, 456, 489, 423, 448, 467, 512, 456, 441, 489, 467, 456, 448, 423, 489]
    }
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    coordinates: [22.5726, 88.3639],
    population: 15700000,
    crimeRate: 743.1,
    dailyCrimes: 634,
    riskLevel: 'medium',
    safetyScore: 58,
    crimeTypes: {
      theft: 234,
      assault: 123,
      harassment: 167,
      burglary: 78,
      vandalism: 45,
      accident: 67
    },
    trends: {
      week: [598, 612, 578, 656, 689, 701, 634],
      month: [634, 598, 656, 689, 578, 656, 612, 712, 656, 605, 578, 612, 656, 689, 634, 598, 612, 656, 578, 605, 634, 689, 612, 598, 656, 634, 612, 605, 578, 656]
    }
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    coordinates: [17.3850, 78.4867],
    population: 10500000,
    crimeRate: 456.8,
    dailyCrimes: 298,
    riskLevel: 'low',
    safetyScore: 81,
    crimeTypes: {
      theft: 112,
      assault: 56,
      harassment: 78,
      burglary: 34,
      vandalism: 18,
      accident: 23
    },
    trends: {
      week: [278, 289, 267, 312, 334, 323, 298],
      month: [298, 278, 312, 334, 267, 312, 289, 345, 312, 285, 267, 289, 312, 334, 298, 278, 289, 312, 267, 285, 298, 334, 289, 278, 312, 298, 289, 285, 267, 312]
    }
  },
  {
    name: "Pune",
    state: "Maharashtra",
    coordinates: [18.5204, 73.8567],
    population: 7400000,
    crimeRate: 389.2,
    dailyCrimes: 201,
    riskLevel: 'low',
    safetyScore: 84,
    crimeTypes: {
      theft: 78,
      assault: 34,
      harassment: 56,
      burglary: 23,
      vandalism: 12,
      accident: 18
    },
    trends: {
      week: [189, 195, 178, 212, 223, 218, 201],
      month: [201, 189, 212, 223, 178, 212, 195, 234, 212, 196, 178, 195, 212, 223, 201, 189, 195, 212, 178, 196, 201, 223, 195, 189, 212, 201, 195, 196, 178, 212]
    }
  }
]

export const safetyPredictions: SafetyPrediction[] = [
  {
    location: "Delhi - Connaught Place",
    timeOfDay: "Late Night (11 PM - 3 AM)",
    riskPercentage: 78,
    primaryRisk: "theft",
    recommendations: [
      "Avoid carrying expensive items openly",
      "Stay in well-lit areas with good foot traffic",
      "Use ride-sharing apps instead of walking alone",
      "Keep emergency contacts readily accessible"
    ]
  },
  {
    location: "Mumbai - Dadar Station",
    timeOfDay: "Rush Hour (8-10 AM, 6-8 PM)",
    riskPercentage: 65,
    primaryRisk: "harassment",
    recommendations: [
      "Stay alert in crowded areas",
      "Keep bags zipped and in front of body",
      "Use women-only compartments if available",
      "Report suspicious behavior immediately"
    ]
  },
  {
    location: "Bangalore - Electronic City",
    timeOfDay: "Evening (6-9 PM)",
    riskPercentage: 42,
    primaryRisk: "accident",
    recommendations: [
      "Use well-maintained vehicles",
      "Avoid shortcuts through poorly lit roads",
      "Wear reflective clothing while walking",
      "Follow traffic rules strictly"
    ]
  },
  {
    location: "Chennai - Marina Beach",
    timeOfDay: "Weekend Evenings",
    riskPercentage: 35,
    primaryRisk: "theft",
    recommendations: [
      "Don't leave belongings unattended",
      "Stay in groups when possible",
      "Avoid isolated areas of the beach",
      "Keep valuables secure and hidden"
    ]
  }
]

export const crimePatterns = {
  byTime: {
    hourly: [
      { hour: '0-3 AM', crimes: 89, risk: 'high' },
      { hour: '3-6 AM', crimes: 45, risk: 'medium' },
      { hour: '6-9 AM', crimes: 234, risk: 'high' },
      { hour: '9-12 PM', crimes: 156, risk: 'medium' },
      { hour: '12-3 PM', crimes: 178, risk: 'medium' },
      { hour: '3-6 PM', crimes: 267, risk: 'high' },
      { hour: '6-9 PM', crimes: 345, risk: 'high' },
      { hour: '9-12 AM', crimes: 198, risk: 'medium' }
    ],
    weekly: [
      { day: 'Monday', crimes: 1456, trend: 'stable' },
      { day: 'Tuesday', crimes: 1398, trend: 'down' },
      { day: 'Wednesday', crimes: 1423, trend: 'up' },
      { day: 'Thursday', crimes: 1567, trend: 'up' },
      { day: 'Friday', crimes: 1789, trend: 'high' },
      { day: 'Saturday', crimes: 1634, trend: 'high' },
      { day: 'Sunday', crimes: 1234, trend: 'down' }
    ]
  },
  byLocation: {
    hotspots: [
      { area: 'Commercial Districts', percentage: 28, crimes: 1456 },
      { area: 'Transport Hubs', percentage: 22, crimes: 1145 },
      { area: 'Residential Areas', percentage: 18, crimes: 938 },
      { area: 'Markets & Malls', percentage: 15, crimes: 781 },
      { area: 'Educational Institutions', percentage: 10, crimes: 521 },
      { area: 'Parks & Recreation', percentage: 7, crimes: 364 }
    ]
  }
}

export const preventionTips = {
  general: [
    "Stay aware of your surroundings at all times",
    "Trust your instincts - if something feels wrong, leave",
    "Keep emergency contacts easily accessible",
    "Avoid displaying expensive items in public",
    "Stay in well-lit, populated areas when possible"
  ],
  byTime: {
    earlyMorning: [
      "Use ride-sharing services instead of walking alone",
      "Inform someone of your travel plans",
      "Carry a charged phone and emergency whistle"
    ],
    rushHour: [
      "Keep bags secure and in front of your body",
      "Stay alert for pickpockets in crowded areas",
      "Use official transport services only"
    ],
    lateNight: [
      "Travel in groups when possible",
      "Avoid shortcuts through deserted areas",
      "Keep doors and windows locked when traveling"
    ]
  },
  byLocation: {
    commercial: [
      "Be cautious with ATM transactions",
      "Don't leave bags unattended while shopping",
      "Park in well-lit, busy areas"
    ],
    transport: [
      "Keep tickets and documents secure",
      "Stay alert for suspicious behavior",
      "Use official transport services only"
    ],
    residential: [
      "Install proper lighting around your property",
      "Know your neighbors and community",
      "Report suspicious activities promptly"
    ]
  }
}