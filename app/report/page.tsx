'use client'

import { ReportForm } from '@/components/report-form'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Users
} from 'lucide-react'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-red-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <AlertTriangle className="h-12 w-12 text-red-600 mr-3" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <Shield className="h-3 w-3 mr-1" />
              Secure Reporting Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-red-700 to-slate-900 dark:from-white dark:via-red-300 dark:to-white bg-clip-text text-transparent">
            Report a Crime or Incident
          </h1>
        </motion.div>

        {/* Main Report Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ReportForm />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Emergency Notice */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    🚨 Emergency Situations
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                    If this is an emergency or crime in progress, please call 911 immediately. 
                    This form is for non-emergency reports only.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <Clock className="h-3 w-3" />
                    <span>For immediate assistance: 911</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    🔒 Your Privacy Matters
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    Your reports are encrypted and securely transmitted to local authorities. 
                    We follow strict privacy protocols to protect all reporter information.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                    <Users className="h-3 w-3" />
                    <span>Anonymous reporting available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        
      </div>
    </div>
  )
}
