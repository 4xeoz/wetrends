'use client'

import { useState, useEffect } from 'react'
import { getContactMessages } from '@/actions/contact'
import MessageList, { Message } from '@/app/_component/me/dashboard/message-list'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await getContactMessages()
      if (response.success && response.messages) {
        setMessages(response.messages)
        setError(null)
      } else {
        setError(response.message || 'Failed to fetch messages')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDeleteSuccess = (deletedId: string) => {
    setMessages(messages.filter(message => message.id !== deletedId))
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <Button 
          onClick={fetchMessages} 
          variant="outline" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-wetrends" />
        </div>
      ) : messages.length > 0 ? (
        <MessageList messages={messages} onDeleteSuccess={handleDeleteSuccess} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No messages found</p>
        </div>
      )}
    </div>
  )
}
