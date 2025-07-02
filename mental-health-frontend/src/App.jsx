import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Mic, MicOff, Send, Heart, Brain, MessageCircle } from 'lucide-react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI mental health companion. I\'m here to listen and support you. How are you feeling today?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
    // For now, it's a placeholder
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Mental Health AI Companion</h1>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A safe, supportive space to express your feelings and receive guidance. 
            Remember, this is a supportive tool and not a replacement for professional mental health care.
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="bg-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Badge variant="secondary" className="text-xs">AI</Badge>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">AI</Badge>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleVoiceInput}
                className="shrink-0"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1"
                disabled={isLoading}
              />
              
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Click the microphone for voice input (coming soon)
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            If you're experiencing a mental health crisis, please contact a mental health professional 
            or call a crisis helpline immediately.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

