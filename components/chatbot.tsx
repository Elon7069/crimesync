'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, X, MapPin, Shield, AlertTriangle } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const quickSuggestions = [
  {
    text: 'Is this area safe at night?',
    icon: Shield,
  },
  {
    text: 'Find nearby police station',
    icon: MapPin,
  },
  {
    text: 'Safety tips for walking alone',
    icon: AlertTriangle,
  },
]

// Mock AI responses for safety questions
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('safe at night') || lowerMessage.includes('night safety')) {
    return "Based on recent crime data, I'd recommend staying in well-lit areas and avoiding isolated spots after dark. The city center generally has better lighting and more foot traffic. Consider using rideshare services or traveling with others when possible."
  }
  
  if (lowerMessage.includes('police station') || lowerMessage.includes('police')) {
    return "The nearest police station is typically within 2-3 kilometers. You can also call the emergency helpline at 100 (India) or 911 (US) for immediate assistance. For non-emergencies, you can visit the local police station during business hours."
  }
  
  if (lowerMessage.includes('walking alone') || lowerMessage.includes('safety tips')) {
    return "Here are key safety tips: 1) Stay alert and avoid distractions like headphones, 2) Walk confidently in well-lit areas, 3) Trust your instincts - if something feels wrong, move to a public place, 4) Keep your phone charged and share your location with trusted contacts, 5) Avoid displaying expensive items."
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
    return "In case of emergency, immediately call 911 (US), 100 (India Police), or your local emergency number. Use the red SOS button on this app for quick alerts. If you're in immediate danger, try to get to a public place or flag down help."
  }
  
  if (lowerMessage.includes('report crime') || lowerMessage.includes('report')) {
    return "You can report crimes using the 'Report' section of this app. For ongoing crimes, call emergency services immediately. For non-emergency reports, you can also visit your local police station or use their online reporting system."
  }
  
  if (lowerMessage.includes('self defense') || lowerMessage.includes('protect myself')) {
    return "Self-defense tips: 1) Be aware of your surroundings, 2) Trust your instincts, 3) Consider carrying a whistle or personal alarm, 4) Take a self-defense class, 5) Avoid confrontation when possible - your safety is more important than your belongings."
  }
  
  return "I'm here to help with safety-related questions. You can ask me about local safety tips, how to report crimes, emergency procedures, or general personal safety advice. What specific safety concern would you like help with?"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI safety assistant. I can help you with safety tips, emergency information, and answer questions about staying safe in your area. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(textToSend),
      isBot: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, botResponse])
    setIsTyping(false)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <>
      {/* Chat Widget Toggle */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
        
        {/* Notification badge for new users */}
        {!isOpen && messages.length === 1 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            1
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 left-6 w-80 h-96 z-40 shadow-2xl">
          <CardHeader className="pb-3 bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Safety Assistant
              <span className="ml-auto text-xs opacity-75">AI Powered</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.isBot
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="p-3 border-t">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</div>
                <div className="space-y-1">
                  {quickSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSuggestion(suggestion.text)}
                        className="w-full justify-start text-xs h-8"
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {suggestion.text}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t bg-white dark:bg-gray-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about safety..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="text-xs text-gray-500 mt-1">
                AI responses are for guidance only. Call emergency services for urgent help.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}