'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RealtimeAlerts } from '@/components/RealtimeAlerts'
import { 
  listenToCollection, 
  updateDocumentStatus, 
  deleteDocument, 
  type CrimeReport, 
  type SosAlert 
} from '@/lib/firebase'
import { 
  Shield,
  FileText,
  AlertTriangle,
  BarChart3,
  LogOut,
  Clock,
  MapPin,
  CheckCircle,
  Activity,
  Menu
} from 'lucide-react'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('incidents')
  const [incidents, setIncidents] = useState<CrimeReport[]>([])
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    const unsubIncidents = listenToCollection<CrimeReport>('crime-reports', setIncidents)
    const unsubSos = listenToCollection<SosAlert>('sos-alerts', setSosAlerts)

    return () => {
      unsubIncidents()
      unsubSos()
    }
  }, [router])

  const handleStatusUpdate = async (incidentId: string, newStatus: string) => {
    try {
      await updateDocumentStatus('crime-reports', incidentId, newStatus)
      toast.success(`Incident status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update status.")
    }
  }

  const handleRemoveIncident = async (incidentId: string) => {
    try {
      await deleteDocument('crime-reports', incidentId)
      toast.success("Incident removed successfully.")
    } catch (error) {
      toast.error("Failed to remove incident.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login')
    toast.success("You have been logged out.")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const analyticsData = {
    statusCounts: incidents.reduce((acc, incident) => {
      const status = incident.status || 'active';
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    
    severityCounts: incidents.reduce((acc, incident) => {
      const severity = incident.severity || 'medium';
      acc[severity] = (acc[severity] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    
    typeCounts: incidents.reduce((acc, incident) => {
      const type = incident.type || 'theft';
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const chartData = Object.entries(analyticsData.statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' '),
    value: count
  }))

  const typeChartData = Object.entries(analyticsData.typeCounts).map(([type, count]) => ({
    name: type,
    count
  }))

  const activeSosCount = sosAlerts.filter(a => a.status === 'active').length;
  const activeIncidentsCount = incidents.filter(i => i.status === 'active').length;
  const resolvedTodayCount = incidents.filter(i => i.status === 'resolved' && i.timestamp.toDate().toDateString() === new Date().toDateString()).length;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className={cn(
          "w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 flex-col md:flex",
          isSidebarOpen ? "flex" : "hidden"
        )}>
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-bold text-lg">Admin Portal</h1>
                <p className="text-sm text-muted-foreground">Police Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2 flex-grow">
            <Button
              variant={activeTab === 'incidents' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => { setActiveTab('incidents'); setIsSidebarOpen(false); }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Incidents
            </Button>
            <Button
              variant={activeTab === 'alerts' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => { setActiveTab('alerts'); setIsSidebarOpen(false); }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="destructive"
              className="w-full justify-center gap-2 shadow-lg hover:shadow-red-500/20 transition-all"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden mb-4">
            <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active SOS Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{activeSosCount}</div>
                <p className="text-xs text-muted-foreground">Immediate attention required</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New/Active Reports</CardTitle>
                <Activity className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeIncidentsCount}</div>
                <p className="text-xs text-muted-foreground">Incidents pending review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cases Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{resolvedTodayCount}</div>
                <p className="text-xs text-muted-foreground">Total cases closed today</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'incidents' && (
                <motion.div key="incidents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-3xl font-bold">Incident Management</h2>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {incidents.map((incident) => (
                          <div key={incident.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity} severity</Badge>
                                  <Badge className={getStatusColor(incident.status)}>{incident.status.replace('_', ' ')}</Badge>
                                </div>
                                <h3 className="font-medium capitalize">{incident.type}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{incident.location.address}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{incident.timestamp?.toDate().toLocaleString() ?? 'N/A'}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Select defaultValue={incident.status} onValueChange={(value) => handleStatusUpdate(incident.id, value)}>
                                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" onClick={() => handleRemoveIncident(incident.id)}>Remove</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {incidents.length === 0 && <p className="text-muted-foreground text-center py-8">No incidents reported yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <RealtimeAlerts />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader><CardTitle>Incident Status</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Crime Types</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={typeChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription>You will be returned to the admin login page.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}