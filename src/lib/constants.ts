import { UserRole, SessionStatus } from './types'

export const USER_ROLES: Record<UserRole, string> = {
	guest: 'Guest',
	valet: 'Valet Operator',
	manager: 'Valet Manager',
	admin: 'Platform Admin',
}

export const SESSION_STATUSES: Record<SessionStatus, string> = {
	pending: 'Pending Validation',
	validated: 'Validated',
	parked: 'Parked & Secure',
	requested: 'Return Requested',
	retrieving: 'Retrieving Vehicle',
	ready: 'Ready for Pickup',
	completed: 'Completed',
}

export const STATUS_COLORS: Record<SessionStatus, string> = {
	pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	validated: 'bg-blue-100 text-blue-800 border-blue-200',
	parked: 'bg-green-100 text-green-800 border-green-200',
	requested: 'bg-orange-100 text-orange-800 border-orange-200',
	retrieving: 'bg-purple-100 text-purple-800 border-purple-200',
	ready: 'bg-indigo-100 text-indigo-800 border-indigo-200',
	completed: 'bg-gray-100 text-gray-800 border-gray-200',
}

export const ROLE_PERMISSIONS = {
	guest: {
		canAccess: ['/guest'],
		defaultRoute: '/guest/session',
	},
	valet: {
		canAccess: ['/valet'],
		defaultRoute: '/valet/dashboard',
	},
	manager: {
		canAccess: ['/manager', '/valet'],
		defaultRoute: '/manager/overview',
	},
	admin: {
		canAccess: ['/admin', '/manager', '/valet', '/guest'],
		defaultRoute: '/admin/analytics',
	},
} as const

export const PRIORITY_COLORS = {
	low: 'bg-gray-100 text-gray-800',
	medium: 'bg-yellow-100 text-yellow-800',
	high: 'bg-red-100 text-red-800',
}

export const TASK_STATUS_COLORS = {
	pending: 'bg-yellow-100 text-yellow-800',
	'in-progress': 'bg-blue-100 text-blue-800',
	completed: 'bg-green-100 text-green-800',
}

export const NAVIGATION_ITEMS = {
	guest: [
		{ href: '/guest/session', label: 'Session Status' },
		{ href: '/guest/validate', label: 'Validate' },
		{ href: '/guest/request', label: 'Request Return' },
		{ href: '/guest/tip', label: 'Tip & Rate' },
	],
	valet: [
		{ href: '/valet/dashboard', label: 'Dashboard' },
		{ href: '/valet/create', label: 'Create Session' },
		{ href: '/valet/task', label: 'My Tasks' },
	],
	manager: [
		{ href: '/manager/overview', label: 'Overview' },
		{ href: '/manager/assign', label: 'Assign Tasks' },
		{ href: '/manager/staff', label: 'Staff Management' },
		{ href: '/manager/settings', label: 'Settings' },
	],
	admin: [
		{ href: '/admin/analytics', label: 'Analytics' },
		{ href: '/admin/venues', label: 'Venues' },
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/logs', label: 'Logs' },
	],
}

export const APP_CONFIG = {
	name: 'ValetFlow',
	description: 'Professional Valet Management System',
	version: '1.0.0',
	defaultValidationPinLength: 4,
	sessionTimeoutHours: 24,
	maxTipAmount: 100,
	ratingScale: 5,
} 