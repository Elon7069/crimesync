import { useState, useEffect } from 'react'

interface PWAState {
  isInstalled: boolean
  isOnline: boolean
  canInstall: boolean
  deferredPrompt: any
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    canInstall: false,
    deferredPrompt: null,
  })

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches
      setPwaState(prev => ({ ...prev, isInstalled }))
    }

    // Handle online/offline status
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }))

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: true, 
        deferredPrompt: e 
      }))
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false, 
        deferredPrompt: null 
      }))
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('SW registered: ', registration)
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError)
        }
      }
    }

    // Initial setup
    checkIfInstalled()
    registerServiceWorker()

    // Event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!pwaState.deferredPrompt) return false

    pwaState.deferredPrompt.prompt()
    const { outcome } = await pwaState.deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: false, 
        deferredPrompt: null 
      }))
      return true
    } else {
      console.log('User dismissed the install prompt')
      return false
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options)
    }
  }

  return {
    ...pwaState,
    installApp,
    requestNotificationPermission,
    sendNotification,
  }
}
