import { User, AuthContextType, UserRole } from './types'
import { findUserByEmail } from './mock-data'
import { ROLE_PERMISSIONS } from './constants'

// Type for auth context
interface AuthContextProps {
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	isLoading: boolean
}

// Simple authentication state management
let currentUser: User | null = null
let authListeners: Array<(user: User | null) => void> = []

// Check for stored user session on module load
if (typeof window !== 'undefined') {
	const storedUser = localStorage.getItem('valetflow-user')
	if (storedUser) {
		try {
			currentUser = JSON.parse(storedUser)
		} catch (error) {
			console.error('Failed to parse stored user:', error)
			localStorage.removeItem('valetflow-user')
		}
	}
}

export const auth = {
	getCurrentUser: () => currentUser,
	
	login: async (email: string, password: string): Promise<void> => {
		// Mock authentication - replace with real authentication
		await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
		
		const foundUser = findUserByEmail(email)
		if (!foundUser) {
			throw new Error('User not found')
		}

		// In a real app, validate password here
		if (password.length < 4) {
			throw new Error('Invalid credentials')
		}

		currentUser = foundUser
		if (typeof window !== 'undefined') {
			localStorage.setItem('valetflow-user', JSON.stringify(foundUser))
			// Also set cookie for middleware
			document.cookie = `user=${encodeURIComponent(JSON.stringify(foundUser))}; path=/; max-age=86400`
		}
		authListeners.forEach(listener => listener(currentUser))
	},

	logout: () => {
		currentUser = null
		if (typeof window !== 'undefined') {
			localStorage.removeItem('valetflow-user')
			// Clear cookie
			document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
		}
		authListeners.forEach(listener => listener(null))
	},

	onAuthChange: (listener: (user: User | null) => void) => {
		authListeners.push(listener)
		return () => {
			authListeners = authListeners.filter(l => l !== listener)
		}
	}
}

export function useAuth() {
	return {
		user: auth.getCurrentUser(),
		login: auth.login,
		logout: auth.logout,
		isLoading: false,
	}
}

// Route guard utility
export function canAccessRoute(userRole: UserRole, route: string): boolean {
	const permissions = ROLE_PERMISSIONS[userRole]
	return permissions.canAccess.some(allowedRoute => 
		route.startsWith(allowedRoute)
	)
}

// Get default route for user role
export function getDefaultRoute(userRole: UserRole): string {
	return ROLE_PERMISSIONS[userRole].defaultRoute
}

// Mock user credentials for testing
export const MOCK_CREDENTIALS = {
	guest: { email: 'john.doe@example.com', password: 'guest123' },
	valet: { email: 'mike.wilson@company.com', password: 'valet123' },
	manager: { email: 'alex.manager@company.com', password: 'manager123' },
	admin: { email: 'admin@company.com', password: 'admin123' },
} 