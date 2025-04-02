'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markMessageAsRead, deleteMessage } from '@/actions/contact'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  isRead: boolean
}

interface MessageListProps {
  messages: Message[]
  onDeleteSuccess: (id: string) => void
}

export default function MessageList({ messages, onDeleteSuccess }: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      handleMarkAsRead(message.id)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    setIsMarkingRead(true)
    try {
      const response = await markMessageAsRead(id)
      if (response.success) {
        // Update the message in the list
        const updatedMessages = messages.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        )
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    } finally {
      setIsMarkingRead(false)
    }
  }

  const confirmDelete = (id: string) => {
    setMessageToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!messageToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteMessage(messageToDelete)
      onDeleteSuccess(messageToDelete)
      if (selectedMessage?.id === messageToDelete) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setMessageToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow 
              key={message.id}
              className={message.isRead ? '' : 'bg-wetrends-50'}
            >
              <TableCell>
                {message.isRead ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Read
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wetrends-100 text-wetrends-800">
                    New
                  </span>
                )}
              </TableCell>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewMessage(message)}
                  className="mr-2"
                >
                  {message.isRead ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmDelete(message.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Message View Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
              <DialogDescription>
                Received {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-sm">{selectedMessage.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  confirmDelete(selectedMessage.id)
                  setSelectedMessage(null)
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
