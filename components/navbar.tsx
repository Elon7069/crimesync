'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Moon, 
  Sun, 
  Menu
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'

const utilityNavigation = [
  { name: 'Live Map', href: '/crime-map', icon: MapPin },
  { name: 'Report', href: '/report', icon: AlertTriangle },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-20 items-center justify-between px-6">
        {/* Enhanced Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
            <Shield className="h-10 w-10 text-primary drop-shadow-lg" />
          </div>
          <span className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
            CrimeSync
          </span>
        </Link>

        {/* Right Side Actions - Grouped */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Utility Navigation (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            {utilityNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'font-medium transition-all duration-300',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative overflow-hidden h-10 w-10 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Admin Login Button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 px-4"
          >
            <Link href="/admin/login">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-lg transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden overflow-hidden border-t bg-background/95 backdrop-blur shadow-lg"
        >
          <div className="container py-4 space-y-2">
            {utilityNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  size="lg"
                  className={cn(
                    "w-full justify-start h-12 text-base font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href={item.href}>
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
            
            {/* Mobile Admin Access */}
            <div className="border-t pt-2 mt-2">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full justify-start h-12 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/admin/login">
                  <Shield className="mr-3 h-5 w-5" />
                  Admin Login
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
