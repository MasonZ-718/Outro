export type UserRole = 'guest' | 'valet' | 'manager' | 'admin'

export type SessionStatus = 
	| 'pending'        // Car dropped off, waiting for validation
	| 'validated'      // Guest has validated via QR/PIN
	| 'parked'         // Car is parked and secure
	| 'requested'      // Guest has requested car return
	| 'retrieving'     // Valet is getting the car
	| 'ready'          // Car is ready for pickup
	| 'completed'      // Session completed, car returned

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	phone?: string
	venueId?: string
	isActive: boolean
	createdAt: Date
}

export interface ValetSession {
	id: string
	guestName: string
	guestPhone: string
	guestEmail?: string
	licensePlate: string
	carMake?: string
	carModel?: string
	carColor?: string
	status: SessionStatus
	venueId: string
	locationSlot?: string
	validationPin?: string
	qrCode?: string
	valetId?: string // Assigned valet operator
	managerId?: string
	dropOffTime: Date
	validatedAt?: Date
	requestedAt?: Date
	estimatedReturnTime?: Date
	returnedAt?: Date
	tip?: number
	rating?: number
	notes?: string
}

export interface Venue {
	id: string
	name: string
	address: string
	capacity: number
	currentOccupancy: number
	managerId: string
	isActive: boolean
	coordinates?: {
		lat: number
		lng: number
	}
}

export interface ValetTask {
	id: string
	sessionId: string
	valetId: string
	type: 'dropoff' | 'pickup'
	priority: 'low' | 'medium' | 'high'
	status: 'pending' | 'in-progress' | 'completed'
	assignedAt: Date
	completedAt?: Date
	estimatedDuration: number // in minutes
}

export interface AnalyticsData {
	venueId: string
	date: Date
	totalSessions: number
	avgResponseTime: number // in minutes
	avgReturnTime: number // in minutes
	validationRate: number // percentage
	averageTip: number
	averageRating: number
	peakHours: Array<{ hour: number; count: number }>
}

export interface AuthContextType {
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	isLoading: boolean
}

export interface MockData {
	users: User[]
	sessions: ValetSession[]
	venues: Venue[]
	tasks: ValetTask[]
	analytics: AnalyticsData[]
} 