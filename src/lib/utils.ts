import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	}).format(date)
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date)
}

export function formatDateTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	}).format(date)
}

export function formatDuration(minutes: number): string {
	if (minutes < 60) {
		return `${minutes}m`
	}
	const hours = Math.floor(minutes / 60)
	const remainingMinutes = minutes % 60
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function generatePin(length: number = 4): string {
	const digits = '0123456789'
	let pin = ''
	for (let i = 0; i < length; i++) {
		pin += digits.charAt(Math.floor(Math.random() * digits.length))
	}
	return pin
}

export function generateQRCode(sessionId: string): string {
	// In a real app, this would generate an actual QR code
	return `QR-${sessionId.toUpperCase()}`
}

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
} 