import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSecureToken(length = 32) {
  if (typeof crypto !== 'undefined' && crypto.randomBytes) {
    // Node.js environment
    return crypto.randomBytes(length).toString('hex')
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser environment
    const randomBytes = new Uint8Array(length)
    crypto.getRandomValues(randomBytes)
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    // Fallback (less secure)
    return Math.random().toString(36).substring(2, length + 2)
  }
}