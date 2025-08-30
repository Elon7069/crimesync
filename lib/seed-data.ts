export interface CrimeReport {
  id: string
  type: 'theft' | 'harassment' | 'accident' | 'vandalism' | 'assault' | 'burglary'
  location: {
    lat: number
    lng: number
    address: string
  }
  severity: 'high' | 'medium' | 'low'
  description: string
  timestamp: Date
  reportedBy: string
  verified: boolean
  status: 'active' | 'under_review' | 'resolved'
}

export interface SosAlert {
  id: string
  location: {
    lat: number
    lng: number
    address: string
  }
  timestamp: Date
  userId: string
  status: 'active' | 'resolved'
  message: string
}

// Dummy data for testing (Delhi, India coordinates)
export const seedCrimeReports: CrimeReport[] = [
  {
    id: '1',
    type: 'theft',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    severity: 'high',
    description: 'Mobile phone snatching reported near metro station',
    timestamp: new Date('2024-08-29T14:30:00'),
    reportedBy: 'anonymous',
    verified: true,
    status: 'under_review'
  },
  {
    id: '2',
    type: 'harassment',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 18, Noida'
    },
    severity: 'medium',
    description: 'Verbal harassment reported in shopping area',
    timestamp: new Date('2024-08-29T16:45:00'),
    reportedBy: 'user123',
    verified: false,
    status: 'active'
  },
  {
    id: '3',
    type: 'accident',
    location: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Cyber City, Gurgaon'
    },
    severity: 'high',
    description: 'Hit and run accident near office complex',
    timestamp: new Date('2024-08-29T09:15:00'),
    reportedBy: 'witness001',
    verified: true,
    status: 'resolved'
  },
  {
    id: '4',
    type: 'vandalism',
    location: {
      lat: 28.6692,
      lng: 77.4538,
      address: 'Laxmi Nagar, Delhi'
    },
    severity: 'low',
    description: 'Graffiti and property damage in residential area',
    timestamp: new Date('2024-08-28T22:00:00'),
    reportedBy: 'resident456',
    verified: true,
    status: 'resolved'
  },
  {
    id: '5',
    type: 'burglary',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Model Town, Delhi'
    },
    severity: 'high',
    description: 'House break-in reported, valuables stolen',
    timestamp: new Date('2024-08-28T03:20:00'),
    reportedBy: 'homeowner789',
    verified: true,
    status: 'active'
  },
  {
    id: '6',
    type: 'assault',
    location: {
      lat: 28.6289,
      lng: 77.2065,
      address: 'Karol Bagh, Delhi'
    },
    severity: 'high',
    description: 'Physical altercation in market area',
    timestamp: new Date('2024-08-29T19:30:00'),
    reportedBy: 'bystander999',
    verified: false,
    status: 'under_review'
  }
]

export const seedSosAlerts: SosAlert[] = [
  {
    id: '1',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    timestamp: new Date('2024-08-30T10:30:00'),
    userId: 'user123',
    status: 'active',
    message: 'Emergency assistance needed - feeling unsafe'
  },
  {
    id: '2',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 18, Noida'
    },
    timestamp: new Date('2024-08-29T23:45:00'),
    userId: 'user456',
    status: 'resolved',
    message: 'Suspicious activity reported'
  }
]

export const crimeTypes = [
  { value: 'theft', label: 'Theft/Robbery' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'accident', label: 'Accident' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'assault', label: 'Assault' },
  { value: 'burglary', label: 'Burglary' }
]

export const severityColors = {
  high: '#ef4444', // red
  medium: '#f59e0b', // yellow
  low: '#10b981' // green
}