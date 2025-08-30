import { CommunityFeed } from '@/components/community-feed'
import { AIHotspotAlerts } from '@/components/ai-hotspot-alerts'

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Safety Hub</h1>
        <p className="text-muted-foreground">
          Connect with your community, share safety insights, and get AI-powered crime predictions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommunityFeed />
        </div>
        <div>
          <AIHotspotAlerts />
        </div>
      </div>
    </div>
  )
}