'use client'

import { useState, useEffect } from 'react'
import { listenToCombinedAlerts, updateAlertStatus, CombinedAlert } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  User, 
  FileText, 
  Loader2 
} from 'lucide-react'
import { toast } from 'sonner'

export function RealtimeAlerts() {
  const [alerts, setAlerts] = useState<CombinedAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // The listener will now handle setting the alerts.
    // It will return an empty array if there's an error or no data.
    const unsubscribe = listenToCombinedAlerts((newAlerts) => {
      setAlerts(newAlerts);
      setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (alert: CombinedAlert, status: string) => {
    const collectionName = alert.alertType === 'sos' ? 'sos-alerts' : 'crime-reports';
    try {
      await updateAlertStatus(collectionName, alert.id, status);
      toast.success(`Status updated for alert #${alert.id.substring(0, 6)}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const AlertCard = ({ alert }: { alert: CombinedAlert }) => (
    <Card className={alert.status === 'active' ? 'border-red-500 shadow-lg' : 'border-transparent'}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${alert.alertType === 'sos' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {alert.alertType === 'sos' ? 
                <AlertTriangle className="h-6 w-6 text-red-600" /> : 
                <FileText className="h-6 w-6 text-blue-600" />
              }
            </div>
            <div>
              <CardTitle className="text-lg">
                {alert.alertType === 'sos' ? 'SOS Emergency Alert' : 'New Crime Report'}
              </CardTitle>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.timestamp?.toDate().toLocaleString() ?? 'N/A'}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {alert.alertType === 'sos' ? alert.userId : alert.reportedBy}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>{alert.status}</Badge>
            {alert.alertType === 'report' && (
              <Badge className={getSeverityColor(alert.severity)}>{alert.severity} severity</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          {alert.alertType === 'sos' ? alert.message : alert.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{alert.location.address}</span>
          </div>
          <a 
            href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-xs"
          >
            View on Map
          </a>
        </div>
        <div className="flex justify-end">
          <Select 
            defaultValue={alert.status}
            onValueChange={(value) => handleStatusChange(alert, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Real-time Alerts Dashboard
        </h1>
        <p className="text-muted-foreground">
          Live feed of all incoming SOS alerts and crime reports. Active alerts are highlighted in red.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Connecting to live feed...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">No Alerts Found</h2>
          <p className="mt-2 text-muted-foreground">
            This dashboard is empty. New reports and SOS alerts will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <AlertCard key={`${alert.alertType}-${alert.id}`} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}
