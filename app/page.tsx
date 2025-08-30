'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Shield, 
  Brain,
  Zap,
  Eye,
  Activity,
  TrendingUp,
  Bell,
  UserCheck,
  Camera,
  MessageCircle,
  ArrowRight,
  Star,
  Clock,
  FileText
} from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Interactive Crime Map',
    description: 'Real-time crime hotspots with advanced filtering and search capabilities',
    href: '/crime-map',
    color: 'bg-blue-600 hover:bg-blue-700',
    gradient: 'from-blue-100 to-blue-50',
    stats: '2,847 reports mapped'
  },
  {
    icon: AlertTriangle,
    title: 'Report Incidents',
    description: 'Anonymous & verified reporting with photo/video evidence support',
    href: '/report',
    color: 'bg-red-600 hover:bg-red-700',
    gradient: 'from-red-100 to-red-50',
    stats: '24/7 reporting available'
  },
  {
    icon: Users,
    title: 'Community Hub',
    description: 'Connect with neighbors, share safety tips, and stay informed',
    href: '/community',
    color: 'bg-green-600 hover:bg-green-700',
    gradient: 'from-green-100 to-green-50',
    stats: '1,234 active members'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive crime statistics and safety trend analysis',
    href: '/dashboard',
    color: 'bg-yellow-600 hover:bg-yellow-700',
    gradient: 'from-yellow-100 to-yellow-50',
    stats: 'Real-time insights'
  }
]

const stats = [
  { label: 'Active Reports', value: '847', icon: FileText },
  { label: 'Response Time', value: '2.4m', icon: Clock },
  { label: 'Community Members', value: '12.3K', icon: Users },
  { label: 'Success Rate', value: '94%', icon: TrendingUp }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Powered by AI & Community
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                CrimeSync
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Advanced crime reporting and safety platform with real-time alerts, AI predictions, and community-driven safety initiatives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/report">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Report Incident
                  </Button>
                </Link>
                <Link href="/crime-map">
                  <Button size="lg" variant="outline" className="px-8">
                    <MapPin className="h-5 w-5 mr-2" />
                    View Crime Map
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm text-center backdrop-blur-sm"
                >
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Comprehensive Safety Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay safe and keep your community informed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div classNme={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {feature.stats}
                      </Badge>
                      <Link href={feature.href}>
                        <Button 
                          size="sm" 
                          className={`${feature.color} group-hover:translate-x-1 transition-transform`}
                        >
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
