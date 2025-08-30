'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ id: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Auto-login with any credentials (dummy login)
    toast.success('Login successful! Redirecting to admin command center...')
    localStorage.setItem('adminAuth', 'true')
    
    // Add dummy police data
    localStorage.setItem('policeOfficer', JSON.stringify({
      id: 'OFF001',
      name: 'Officer John Smith',
      badge: 'BADGE-12345',
      department: 'Metropolitan Police',
      rank: 'Detective Inspector',
      station: 'Central Command',
      clearanceLevel: 'Level 5'
    }))
    
    router.push('/admin/dashboard')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Command Portal</CardTitle>
            <p className="text-muted-foreground">
              Sign in to access the integrated police & emergency response dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Admin ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="id"
                    type="text"
                    placeholder="Enter admin ID"
                    value={credentials.id}
                    onChange={(e) => setCredentials(prev => ({ ...prev, id: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                <strong>Demo Mode:</strong><br />
                Enter any credentials to access<br />
                the police dashboard
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}