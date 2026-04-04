'use client';

import { useState, useEffect } from 'react';
import { getContactMessages, markMessageAsRead, deleteMessage } from '@/actions/contact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Trash2, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMarkingRead, setIsMarkingRead] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await getContactMessages();
      if (response.success && response.messages) {
        setMessages(response.messages as Message[]);
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setIsMarkingRead(id);
    try {
      const response = await markMessageAsRead(id);
      if (response.success) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMarkingRead(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setIsDeleting(id);
    try {
      const response = await deleteMessage(id);
      if (response.success) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert(response.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
          <p className="text-gray-600">Loading messages...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMessages} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-[calc(100svh-4rem)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-gray-600">
            {unreadCount > 0 ? (
              <span className="text-[#C72C5B] font-medium">{unreadCount} unread</span>
            ) : (
              'No new messages'
            )}
            {' '}• {messages.length} total
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 h-[calc(100%-5rem)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[calc(100%-4rem)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Mail className="h-12 w-12 mb-3 text-gray-300" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                    } ${!message.isRead ? 'bg-blue-50/50' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {message.name}
                          </p>
                          {!message.isRead && (
                            <Badge variant="default" className="bg-[#C72C5B]">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{message.email}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="border-b">
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                    <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Received</p>
                    <p className="text-gray-900">
                      {format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Message</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {!selectedMessage.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        disabled={isMarkingRead === selectedMessage.id}
                      >
                        {isMarkingRead === selectedMessage.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={isDeleting === selectedMessage.id}
                    >
                      {isDeleting === selectedMessage.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-gray-500"
                >
                  <Mail className="h-12 w-12 mb-3 text-gray-300" />
                  <p>Select a message to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
