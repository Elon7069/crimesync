'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CombinedAlert } from '@/lib/firebase'
import { MapPin, Shield, Clock, AlertTriangle, User, FileText } from 'lucide-react'

interface SimpleMapProps {
  alerts: CombinedAlert[]
  center: [number, number]
  zoom: number
  userLocation?: [number, number] | null
}

export function SimpleMap(props: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null) // To hold the map instance

  useEffect(() => {
    if (!mapRef.current) return

    let leaflet: any = null

    const loadMap = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (!(window as any).L) {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = () => initializeMap()
          document.head.appendChild(script)
        } else {
          initializeMap()
        }

        function initializeMap() {
          const L = (window as any).L
          leaflet = L

          if (!mapRef.current) return
          if (mapInstance.current) mapInstance.current.remove();

          const map = L.map(mapRef.current).setView(props.center, props.zoom)
          mapInstance.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map)

          if (props.userLocation) {
            const userIcon = L.divIcon({
              html: `<div style="background: linear-gradient(45deg, #3b82f6, #1d4ed8); width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
              className: 'blinking-user-dot',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
            L.marker(props.userLocation, { icon: userIcon }).addTo(map).bindPopup('Your Location')
          }

          props.alerts.forEach((alert) => {
            let icon, popupContent;

            if (alert.alertType === 'sos') {
              icon = L.divIcon({
                html: `<div class="blinking-sos-dot" style="background-color: #ef4444; width: 24px; height: 24px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(239,68,68,0.7);"></div>`,
                className: '',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              });

              popupContent = `
                <div style="padding: 12px; font-family: sans-serif; width: 250px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #b91c1c; display: flex; align-items: center; gap: 6px;">SOS Alert</h3>
                  <p style="margin: 0 0 12px 0; font-size: 14px;">${alert.message}</p>
                  <div style="font-size: 12px; color: #666;">
                    <div style="margin-bottom: 4px;"><b>User:</b> ${alert.userId}</div>
                    <div style="margin-bottom: 4px;"><b>Location:</b> ${alert.location.address}</div>
                    <div><b>Time:</b> ${alert.timestamp.toDate().toLocaleString()}</div>
                  </div>
                  <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;">
                    <span style="background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 99px; font-size: 11px;">Status: ${alert.status}</span>
                  </div>
                </div>
              `;
            } else { // Crime Report
              const colors = { high: '#ef4444', medium: '#f97316', low: '#eab308' };
              const color = colors[alert.severity as keyof typeof colors] || '#6b7280';
              icon = L.divIcon({
                html: `<div style="background-color: ${color}; width: 18px; height: 18px; border: 2px solid white; border-radius: 50%;"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
              });

              popupContent = `
                <div style="padding: 12px; font-family: sans-serif; width: 250px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; text-transform: capitalize;">${alert.type} Report</h3>
                  <p style="margin: 0 0 12px 0; font-size: 14px;">${alert.description}</p>
                  <div style="font-size: 12px; color: #666;">
                    <div style="margin-bottom: 4px;"><b>Severity:</b> <span style="color: ${color};">${alert.severity}</span></div>
                    <div style="margin-bottom: 4px;"><b>Location:</b> ${alert.location.address}</div>
                    <div><b>Time:</b> ${alert.timestamp.toDate().toLocaleString()}</div>
                  </div>
                   <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px;">Status: <b>${alert.status.replace('_', ' ')}</b></span>
                    <span style="font-size: 12px;">${alert.verified ? 'Verified' : 'Unverified'}</span>
                  </div>
                </div>
              `;
            }

            L.marker([alert.location.lat, alert.location.lng], { icon })
              .addTo(map)
              .bindPopup(popupContent, { maxWidth: 300 });
          });
        }
      } catch (error) {
        console.error('Failed to load map:', error)
      }
    }

    loadMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null;
      }
    }
  }, [props.alerts, props.center, props.zoom, props.userLocation])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[600px] w-full">
          <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  )
}
