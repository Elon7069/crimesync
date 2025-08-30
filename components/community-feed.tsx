'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Eye,
  Send,
  Search,
  Filter,
  ChevronDown,
  BookmarkPlus,
  Flag,
  Shield,
  TrendingUp,
  Bell,
  UserCheck,
  Camera,
  Video,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { getSosAlerts, type SosAlert } from '@/lib/firebase'

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar?: string
    verified: boolean
    isAuthority: boolean
    location: string
  }
  content: string
  type: 'incident' | 'alert' | 'tip' | 'question' | 'update'
  severity?: 'low' | 'medium' | 'high'
  location: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  views: number
  isLiked: boolean
  isBookmarked: boolean
  tags: string[]
  hasMedia: boolean
  mediaType?: 'image' | 'video' | 'document'
  isUrgent: boolean
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Downtown Police Dept',
      avatar: '',
      verified: true,
      isAuthority: true,
      location: 'Official Account'
    },
    content: '🚨 TRAFFIC ALERT: Major accident on Highway 101 northbound near Main St exit. Expect delays of 30-45 minutes. Please use alternate routes. Emergency crews are responding. #TrafficAlert #SafetyFirst',
    type: 'alert',
    severity: 'high',
    location: 'Highway 101, Downtown',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    likes: 127,
    comments: 23,
    shares: 89,
    views: 1543,
    isLiked: false,
    isBookmarked: false,
    tags: ['traffic', 'emergency', 'highway101'],
    hasMedia: false,
    isUrgent: true
  },
  {
    id: '2',
    author: {
      name: 'Sarah M.',
      avatar: '',
      verified: false,
      isAuthority: false,
      location: 'Riverside District'
    },
    content: 'Witnessed a hit-and-run at Oak Street and 3rd Ave around 2:30 PM. Dark blue sedan, license plate partially visible: ABC-1??. Reported to police. Anyone else see this? Driver hit a parked car and fled.',
    type: 'incident',
    severity: 'medium',
    location: 'Oak St & 3rd Ave',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 34,
    comments: 12,
    shares: 8,
    views: 287,
    isLiked: true,
    isBookmarked: true,
    tags: ['hit-and-run', 'witness', 'vehicle'],
    hasMedia: true,
    mediaType: 'image',
    isUrgent: false
  },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts)
  const [newPost, setNewPost] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'alerts' | 'incidents' | 'tips' | 'authorities'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchAndSetAlerts = async () => {
      try {
        const sosAlerts = await getSosAlerts();
        const transformedAlerts: CommunityPost[] = sosAlerts.map(alert => ({
          id: alert.id,
          author: {
            name: `User ${alert.userId.substring(0, 6)}`,
            verified: true,
            isAuthority: true, // SOS alerts are treated as authoritative
            location: 'SOS Alert'
          },
          content: alert.message,
          type: 'alert',
          severity: 'high',
          location: alert.location.address,
          timestamp: alert.timestamp.toDate(), // Convert Firestore Timestamp to Date
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
          isLiked: false,
          isBookmarked: false,
          tags: ['sos', 'emergency'],
          hasMedia: false,
          isUrgent: true,
        }));

        // Combine mock posts and transformed alerts, then sort by date
        setPosts([...mockPosts, ...transformedAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

      } catch (error) {
        console.error("Failed to fetch SOS alerts:", error);
        toast.error("Could not load SOS alerts.");
        setPosts(mockPosts); // Fallback to mock posts
      }
    };

    fetchAndSetAlerts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'alerts' && post.type === 'alert') ||
      (filter === 'incidents' && post.type === 'incident') ||
      (filter === 'tips' && post.type === 'tip') ||
      (filter === 'authorities' && post.author.isAuthority)
    
    return matchesSearch && matchesFilter
  })

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
    const post = posts.find(p => p.id === postId)
    if (post) {
      toast.success(post.isBookmarked ? 'Bookmark removed' : 'Post bookmarked')
    }
  }

  const handleShare = async (post: CommunityPost) => {
    try {
      await navigator.clipboard.writeText(`${post.content}\n\nShared from Community Safety Hub`)
      toast.success('Post copied to clipboard')
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, shares: p.shares + 1 } : p
      ))
    } catch (error) {
      toast.error('Failed to share post')
    }
  }

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return

    setIsPosting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newPostObj: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        verified: false,
        isAuthority: false,
        location: 'Your Location'
      },
      content: newPost,
      type: 'question',
      location: 'Current Location',
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      views: 1,
      isLiked: false,
      isBookmarked: false,
      tags: [],
      hasMedia: false,
      isUrgent: false
    }

    setPosts(prev => [newPostObj, ...prev])
    setNewPost('')
    setIsPosting(false)
    toast.success('Your post has been shared with the community!')
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInMs / (1000 * 60))}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4" />
      case 'incident': return <Flag className="h-4 w-4" />
      case 'tip': return <Shield className="h-4 w-4" />
      case 'question': return <MessageCircle className="h-4 w-4" />
      case 'update': return <Bell className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image': return <Camera className="h-3 w-3" />
      case 'video': return <Video className="h-3 w-3" />
      case 'document': return <FileText className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts, locations, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filter Buttons */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {(['all', 'alerts', 'incidents', 'tips', 'authorities'] as const).map((filterType) => (
                    <Button
                      key={filterType}
                      variant={filter === filterType ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(filterType)}
                      className="capitalize"
                    >
                      {filterType === 'all' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {filterType === 'alerts' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {filterType === 'incidents' && <Flag className="h-3 w-3 mr-1" />}
                      {filterType === 'tips' && <Shield className="h-3 w-3 mr-1" />}
                      {filterType === 'authorities' && <UserCheck className="h-3 w-3 mr-1" />}
                      {filterType}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* New Post Creation */}
      <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share a safety concern, ask a question, or provide community updates..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </Button>
                </div>
                <Button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || isPosting}
                  size="sm"
                >
                  {isPosting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Send className="h-4 w-4 mr-1" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4 mr-1" />
                  )}
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${post.isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''} hover:shadow-lg transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        {post.author.avatar ? (
                          <AvatarImage src={post.author.avatar} />
                        ) : (
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{post.author.name}</span>
                          {post.author.verified && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              ✓ Verified
                            </Badge>
                          )}
                          {post.author.isAuthority && (
                            <Badge className="text-xs px-1.5 py-0.5 bg-blue-600">
                              <Shield className="h-2.5 w-2.5 mr-1" />
                              Authority
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.author.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {getTypeIcon(post.type)}
                            <span className="ml-1 capitalize">{post.type}</span>
                          </Badge>
                          {post.severity && (
                            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getSeverityColor(post.severity)}`}>
                              {post.severity.toUpperCase()}
                            </Badge>
                          )}
                          {post.isUrgent && (
                            <Badge className="text-xs px-2 py-0.5 bg-red-600 animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(post.timestamp)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Post Content */}
                    <div className="text-sm leading-relaxed">
                      {post.content}
                    </div>

                    {/* Location and Tags */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.location}
                      </div>
                      {post.hasMedia && (
                        <div className="flex items-center">
                          {getMediaIcon(post.mediaType)}
                          <span className="ml-1">Media attached</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="h-3 w-3 mr-1" />
                          {post.shares}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views} views
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`${post.isLiked ? 'text-red-600 hover:text-red-700' : ''}`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShare(post)}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(post.id)}
                        className={`${post.isBookmarked ? 'text-blue-600' : ''}`}
                      >
                        <BookmarkPlus className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters to see more posts.'
                : 'Be the first to share something with your community!'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load more posts
          </Button>
        </div>
      )}
    </div>
  )
}
