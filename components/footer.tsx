'use client'

import Link from 'next/link'
import { Shield, MapPin, AlertTriangle, Users, Phone, Mail, Globe, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Live Map', href: '/crime-map', icon: MapPin },
    { name: 'Report Crime', href: '/report', icon: AlertTriangle },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Dashboard', href: '/dashboard', icon: Shield },
  ]

  const features = [
    'Real-time Crime Alerts',
    'AI-Powered Hotspot Detection',
    'Community Safety Network',
    'Emergency SOS System',
    'Authorities Dashboard',
    'Crime Analytics',
  ]

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'Facebook', href: '#', icon: 'f' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: 'in' },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="font-bold text-2xl text-foreground">
                CrimeSync
              </span>
            </motion.div>
            
            <p className="text-muted-foreground leading-relaxed">
              Empowering communities with real-time crime reporting, AI-powered insights, 
              and collaborative safety solutions for a safer tomorrow.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <span className="font-bold text-sm">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  >
                    <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Features</h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
            
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-3 text-muted-foreground"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center space-x-3 text-muted-foreground"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>support@crimesync.com</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3 text-muted-foreground"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span>www.crimesync.com</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Mail className="mr-2 h-4 w-4" />
                Subscribe to Updates
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Emergency Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-200/20"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-foreground">Emergency Response</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In case of emergency, use our SOS button or contact local authorities immediately. 
              Your safety is our top priority.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="destructive" className="px-4 py-2 text-sm">
                Emergency: 911
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Non-Emergency: 311
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <span>© {currentYear} CrimeSync. All rights reserved.</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-6 text-sm text-muted-foreground"
            >
              <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors duration-300">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="hover:text-primary transition-colors duration-300">
                Accessibility
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
