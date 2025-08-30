# Crime Safety & Awareness Module

A comprehensive Next.js application for crime reporting, safety mapping, and community awareness built for hackathons.

## 🚀 Features

### 1. Interactive Crime Map
- **Real-time crime visualization** with Leaflet.js
- **Color-coded markers** (Red: High risk, Yellow: Medium, Green: Low)
- **Detailed popups** with crime info, timestamps, and safety tips
- **Filter system** by crime type and severity
- **GPS integration** for user location

### 2. Crime Reporting System
- **Comprehensive form** with shadcn/ui components
- **Auto-location detection** via GPS
- **Image upload** for evidence (5MB limit)
- **Real-time validation** and success feedback
- **Firebase integration** for data storage

### 3. SOS Emergency System
- **Floating SOS button** with 5-second confirmation
- **Live location sharing** with emergency contacts
- **Alert history sidebar** showing recent SOS activations
- **Integration** with local emergency services

### 4. AI Safety Chatbot
- **Intelligent responses** to safety queries
- **Quick suggestions** for common questions
- **24/7 availability** for safety guidance
- **Context-aware** responses based on location and crime data

### 5. Analytics Dashboard
- **Real-time statistics** and crime trends
- **Interactive charts** using Recharts
- **Top unsafe areas** identification
- **Weekly/monthly trend analysis**
- **Responsive cards** with key metrics

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Components**: shadcn/ui + Radix UI
- **Maps**: Leaflet.js + React Leaflet
- **Charts**: Recharts
- **Backend**: Firebase/Firestore
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd crime-safety-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```
Fill in your Firebase configuration and API keys.

4. **Run the development server**
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Storage (for image uploads)
4. Copy configuration to `.env.local`

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📱 Pages & Routes

- **`/`** - Homepage with feature overview
- **`/crime-map`** - Interactive crime mapping
- **`/report`** - Crime reporting form
- **`/dashboard`** - Analytics dashboard

## 🎨 UI Components

### Core Components
- `CrimeMap` - Interactive Leaflet map with markers
- `ReportForm` - Crime reporting with validation
- `SosButton` - Emergency alert system
- `Chatbot` - AI-powered safety assistant
- `DashboardStats` - Analytics and charts
- `Navbar` - Enhanced navigation with theme toggle and PWA support

### UI Library
All components use shadcn/ui for consistency:
- Button, Card, Input, Select, Dialog
- Toast notifications and form components
- Dark/light mode support
- Enhanced shadows and hover effects
- Improved mobile responsiveness

## 📱 Progressive Web App Features

### PWA Installation
- **Automatic install prompt** when criteria are met
- **Home screen installation** on mobile devices
- **Desktop app installation** on supported browsers
- **App shortcuts** for quick navigation to Report, Map, and Dashboard

### Offline Capabilities
- **Service worker caching** for offline access
- **Offline page** with helpful information
- **Cached resources** for better performance
- **Background sync** when connection returns

### PWA Icons & Branding
- **Professional CrimeSync branding** on all icons
- **Multiple icon sizes** (72x72 to 512x512)
- **SVG format** for crisp display at any size
- **App manifest** with comprehensive metadata

## 🗂 Data Structure

### Crime Report
```typescript
interface CrimeReport {
  id: string
  type: 'theft' | 'harassment' | 'accident' | 'vandalism' | 'assault' | 'burglary'
  location: { lat: number; lng: number; address: string }
  severity: 'high' | 'medium' | 'low'
  description: string
  timestamp: Date
  reportedBy: string
  verified: boolean
}
```

### SOS Alert
```typescript
interface SosAlert {
  id: string
  location: { lat: number; lng: number; address: string }
  timestamp: Date
  userId: string
  status: 'active' | 'resolved'
  message: string
}
```

## 🚨 Safety Features

1. **Real-time Alerts**: Instant notifications for SOS activations
2. **Location Privacy**: User location encrypted and secure
3. **Verification System**: Reports verified by authorities
4. **Emergency Integration**: Direct connection to emergency services
5. **Offline Support**: Core features work without internet

## 📊 Analytics Features

- Daily/weekly crime trends
- Crime type distribution
- Severity risk analysis  
- Geographic hotspot mapping
- Response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🏆 Hackathon Ready

This project is specifically designed for hackathons with:
- **Quick setup** (< 5 minutes)
- **Comprehensive features** in one package
- **Professional UI/UX** with modern design
- **Extensible architecture** for additional features
- **Demo data** included for immediate testing
- **Responsive design** for all devices

## 🎯 Future Enhancements

- [ ] Push notifications for nearby incidents
- [ ] Social features (community discussions)
- [ ] Machine learning for crime prediction
- [ ] Integration with city APIs
- [ ] Mobile app version (React Native)
- [ ] Admin dashboard for authorities
- [ ] Multi-language support
- [ ] Advanced analytics with AI insights

## ✨ Recent Updates

### Enhanced Header Design
- **Improved navigation layout** with better spacing
- **Enhanced button shadows** and hover effects
- **Better mobile responsiveness** with larger touch targets
- **Professional CrimeSync branding** throughout the interface

### PWA Integration
- **Full Progressive Web App support** for app-like experience
- **Offline functionality** with service worker caching
- **Install prompts** for easy app installation
- **Professional app icons** with CrimeSync branding

---

Built with ❤️ for safer communities