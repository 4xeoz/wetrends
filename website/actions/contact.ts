// In app/actions.ts (for Next.js App Router)
'use server'

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod'


// Define the form data interface
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Define response types
interface SuccessResponse {
  success: true;
  messageId: number;
}

interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

interface GenericErrorResponse {
  success: false;
  message: string;
}

type ContactFormResponse = SuccessResponse | ValidationErrorResponse | GenericErrorResponse;

// Define a validation schema with Zod
const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  message: z.string().min(1, { message: "Message is required" })
})

export async function submitContactForm(formData: ContactFormData): Promise<ContactFormResponse> {
  try {

    // Validate the data with Zod
    const validatedData = ContactFormSchema.parse(formData)

    // Save to database using Prisma
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message
      }
    })

    return { success: true, messageId: Number(savedMessage.id) }

  } catch (error) {
    console.error("Error submitting contact form:", error)

    // Return validation errors if applicable
    if (error instanceof z.ZodError) {
      const errorMap: Record<string, string> = {};

      error.errors.forEach((err) => {
        if (typeof err.path[0] === 'string') {
          errorMap[err.path[0]] = err.message;
        }
      });

      return {
        success: false,
        errors: errorMap
      }
    }

    // Return generic error
    return {
      success: false,
      message: "Failed to submit your message. Please try again."
    }
  }
}

// Get all messages (admin only)
interface GetMessagesResponse {
  success: boolean;
  messages?: any[];
  message?: string;
}

export async function getContactMessages(): Promise<GetMessagesResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, messages }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return { success: false, message: "Failed to fetch messages" }
  }
}

// Mark a message as read (admin only)
interface MarkAsReadResponse {
  success: boolean;
  message?: string;
}

export async function markMessageAsRead(messageId: string): Promise<MarkAsReadResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true }
    })

    return { success: true }
  } catch (error) {
    console.error("Error marking message as read:", error)
    return { success: false, message: "Failed to mark message as read" }
  }
}


export async function deleteMessage(messageId: string): Promise<MarkAsReadResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.contactMessage.delete({
      where: { id: messageId }
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting message:", error)
    return { success: false, message: "Failed to delete message" }
  }
}
