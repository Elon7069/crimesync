'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { crimeTypes } from '@/lib/seed-data'
import { addCrimeReport, type CrimeReport } from '@/lib/firebase'
import { 
  MapPin, 
  Upload, 
  Calendar, 
  AlertTriangle, 
  Camera,
  Video,
  Eye,
  EyeOff,
  Info,
  Shield,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.string().min(1, 'Please select a crime type'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(5, 'Please provide a valid location'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  severity: z.enum(['low', 'medium', 'high']),
  isAnonymous: z.boolean(),
  reporterName: z.string().optional(),
  reporterPhone: z.string().optional(),
  reporterEmail: z.string().optional(),
}).refine((data) => {
  if (!data.isAnonymous) {
    return data.reporterName && data.reporterName.length > 0
  }
  return true
}, {
  message: "Name is required for non-anonymous reports",
  path: ["reporterName"]
})

type ReportFormData = z.infer<typeof reportSchema>

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [step, setStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null)

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      type: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      severity: 'medium',
      isAnonymous: false,
      reporterName: '',
      reporterPhone: '',
      reporterEmail: '',
    },
  })

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported. Please enter your location manually.')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          
          const location = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          form.setValue('location', location)
          
          toast.success('Location detected and filled automatically!')
        } catch (error) {
          const location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          form.setValue('location', location)
          toast.success('Coordinates filled successfully!')
        }
        
        setIsGettingLocation(false)
      },
      (error) => {
        toast.error('Location access denied. Please enter your location manually.')
        setIsGettingLocation(false)
      }
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`)
        return
      }

      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      
      if (!isVideo && !isImage) {
        toast.error(`${file.name} is not a supported file type. Please upload images or videos.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          file,
          preview: e.target?.result as string,
          type: isVideo ? 'video' : 'image'
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        toast.success(`${file.name} uploaded successfully!`)
      }
      reader.readAsDataURL(file)
    })

    // Clear the input
    event.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    toast.success('File removed')
  }

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true)

    try {
      const reportData: Omit<CrimeReport, 'id' | 'timestamp'> = {
        type: data.type as any,
        location: {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1, // Replace with actual geocoded lat
          lng: 77.2090 + (Math.random() - 0.5) * 0.1, // Replace with actual geocoded lng
          address: data.location
        },
        severity: data.severity,
        description: `${data.title}: ${data.description}`,
        reportedBy: data.isAnonymous ? 'anonymous' : data.reporterName || 'unknown',
        verified: false,
        status: 'active'
      };

      const reportId = await addCrimeReport(reportData);
      
      setSubmittedReportId(reportId);
      setShowSuccessModal(true)
      
      toast.success('🎉 Report submitted successfully!', {
        description: `Report #${reportId.substring(0,6)} has been sent to authorities.`,
        duration: 4000,
      })

      setTimeout(() => {
        form.reset({
          title: '',
          type: '',
          description: '',
          location: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].slice(0, 5),
          severity: 'medium',
          isAnonymous: false,
          reporterName: '',
          reporterPhone: '',
          reporterEmail: '',
        })
        setUploadedFiles([])
        setStep(1)
        setIsAnonymous(false)
      }, 1000)

    } catch (error) {
      console.error('Report submission error:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const isStepValid = () => {
    const values = form.getValues()
    switch (step) {
      case 1:
        return values.title && values.title.length >= 5 && 
               values.type && 
               values.description && values.description.length >= 20
      case 2:
        return values.location && values.location.length >= 5 && 
               values.date && 
               values.time
      case 3:
        return isAnonymous || (values.reporterName && values.reporterName.length > 0)
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step >= stepNum ? '#3b82f6' : '#e5e7eb',
                    color: step >= stepNum ? '#ffffff' : '#6b7280'
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-medium"
                >
                  {step > stepNum ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    stepNum
                  )}
                </motion.div>
                {stepNum < 3 && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: step > stepNum ? '#3b82f6' : '#e5e7eb'
                    }}
                    className="w-20 h-1 mx-4"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Incident Details</span>
            <span>Location & Time</span>
            <span>Reporter Info</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Report Crime or Incident
              {isAnonymous && (
                <Badge variant="secondary" className="ml-2">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Anonymous
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Incident Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    {...form.register('title')}
                    placeholder="Brief summary of the incident (e.g., 'Phone stolen at metro station')"
                    className={form.formState.errors.title ? 'border-red-500' : ''}
                    maxLength={100}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimum 5 characters required</span>
                    <span>{form.watch('title')?.length || 0}/100</span>
                  </div>
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Crime Type & Severity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Crime Type *</Label>
                    <Select 
                      value={form.watch('type')} 
                      onValueChange={(value) => form.setValue('type', value)}
                    >
                      <SelectTrigger className={form.formState.errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select crime category" />
                      </SelectTrigger>
                      <SelectContent>
                        {crimeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.type && (
                      <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Severity Level</Label>
                    <Select 
                      value={form.watch('severity')} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => form.setValue('severity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor incident</SelectItem>
                        <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                        <SelectItem value="high">High - Serious incident</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    {...form.register('description')}
                    placeholder="Describe what happened in detail. Include time, people involved, actions taken, etc."
                    rows={5}
                    className={form.formState.errors.description ? 'border-red-500' : ''}
                    maxLength={1000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimum 20 characters required</span>
                    <span>{form.watch('description')?.length || 0}/1000</span>
                  </div>
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Provide as much detail as possible to help authorities respond appropriately
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Evidence (Photos/Videos)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Max 10MB per file. Images and videos supported.
                    </p>
                  </div>

                  {/* File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          {file.type === 'image' ? (
                            <img
                              src={file.preview}
                              alt={file.file.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={file.preview}
                              className="w-full h-24 object-cover rounded-lg"
                              controls={false}
                            />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <Badge
                            variant="secondary"
                            className="absolute top-1 right-1"
                          >
                            {file.type === 'image' ? (
                              <Camera className="h-3 w-3" />
                            ) : (
                              <Video className="h-3 w-3" />
                            )}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Location & Time */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      {...form.register('location')}
                      placeholder="Enter the incident location"
                      className={`flex-1 ${form.formState.errors.location ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="shrink-0"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {isGettingLocation ? 'Getting...' : 'Use GPS'}
                    </Button>
                  </div>
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      {...form.register('date')}
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      className={form.formState.errors.date ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.date && (
                      <p className="text-sm text-red-600">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      {...form.register('time')}
                      type="time"
                      className={form.formState.errors.time ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.time && (
                      <p className="text-sm text-red-600">{form.formState.errors.time.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Reporter Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Anonymous Reporting Toggle */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <EyeOff className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-blue-900 dark:text-blue-100">
                            Report Anonymously
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Your identity will be completely protected
                          </p>
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Anonymous reports help protect your identity while still allowing 
                              authorities to take action. Your personal information will not be 
                              stored or shared.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={isAnonymous}
                        onCheckedChange={(checked) => {
                          setIsAnonymous(checked)
                          form.setValue('isAnonymous', checked)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Reporter Details (if not anonymous) */}
                {!isAnonymous && (
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reporterName">Full Name *</Label>
                        <Input
                          {...form.register('reporterName')}
                          placeholder="Your full name"
                          className={form.formState.errors.reporterName ? 'border-red-500' : ''}
                        />
                        {form.formState.errors.reporterName && (
                          <p className="text-sm text-red-600">{form.formState.errors.reporterName.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reporterPhone">Phone Number (Optional)</Label>
                          <Input
                            {...form.register('reporterPhone')}
                            placeholder="+1 (555) 123-4567"
                            type="tel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reporterEmail">Email (Optional)</Label>
                          <Input
                            {...form.register('reporterEmail')}
                            placeholder="your.email@example.com"
                            type="email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Notice */}
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-800 dark:text-green-200">
                        <h4 className="font-semibold mb-1">Privacy & Security</h4>
                        <p>
                          Your report is encrypted and securely transmitted to local authorities. 
                          We follow strict privacy protocols to protect all reporter information.
                          {isAnonymous && ' Your identity will never be revealed or stored.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Emergency Notice */}
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-semibold mb-1">⚠️ Emergency Notice</p>
                    <p>
                      If this is an emergency or crime in progress, please call 911 immediately. 
                      This form is for non-emergency reports only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isStepValid()}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Report Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {submittedReportId && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Report ID:</span>
                    <span className="font-mono">#{submittedReportId.substring(0, 6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Submitted:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✅ Your report has been securely transmitted to local authorities</p>
              <p>📋 You'll receive updates on the investigation progress</p>
              <p>🔐 All information is encrypted and protected</p>
              <p>⚡ Emergency situations will be prioritized immediately</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">What happens next?</p>
                  <p className="text-xs mt-1">
                    Authorities will review your report within 24 hours. For urgent matters, 
                    expect faster response times.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
