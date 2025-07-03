import { User, ValetSession, Venue, ValetTask, AnalyticsData, MockData } from './types'

const mockUsers: User[] = [
	{
		id: 'guest-1',
		email: 'john.doe@example.com',
		name: 'John Doe',
		role: 'guest',
		phone: '+1-555-0123',
		isActive: true,
		createdAt: new Date('2024-01-15'),
	},
	{
		id: 'guest-2',
		email: 'jane.smith@example.com',
		name: 'Jane Smith',
		role: 'guest',
		phone: '+1-555-0124',
		isActive: true,
		createdAt: new Date('2024-01-16'),
	},
	{
		id: 'valet-1',
		email: 'mike.wilson@company.com',
		name: 'Mike Wilson',
		role: 'valet',
		phone: '+1-555-0125',
		venueId: 'venue-1',
		isActive: true,
		createdAt: new Date('2024-01-10'),
	},
	{
		id: 'valet-2',
		email: 'sarah.jones@company.com',
		name: 'Sarah Jones',
		role: 'valet',
		phone: '+1-555-0126',
		venueId: 'venue-1',
		isActive: true,
		createdAt: new Date('2024-01-11'),
	},
	{
		id: 'manager-1',
		email: 'alex.manager@company.com',
		name: 'Alex Rodriguez',
		role: 'manager',
		phone: '+1-555-0127',
		venueId: 'venue-1',
		isActive: true,
		createdAt: new Date('2024-01-05'),
	},
	{
		id: 'admin-1',
		email: 'admin@company.com',
		name: 'System Administrator',
		role: 'admin',
		phone: '+1-555-0128',
		isActive: true,
		createdAt: new Date('2024-01-01'),
	},
]

const mockVenues: Venue[] = [
	{
		id: 'venue-1',
		name: 'Downtown Hotel & Casino',
		address: '123 Main St, Downtown, NY 10001',
		capacity: 150,
		currentOccupancy: 87,
		managerId: 'manager-1',
		isActive: true,
		coordinates: { lat: 40.7589, lng: -73.9851 },
	},
	{
		id: 'venue-2',
		name: 'Upscale Restaurant & Bar',
		address: '456 Oak Ave, Midtown, NY 10002',
		capacity: 75,
		currentOccupancy: 42,
		managerId: 'manager-1',
		isActive: true,
		coordinates: { lat: 40.7505, lng: -73.9934 },
	},
]

const mockSessions: ValetSession[] = [
	{
		id: 'session-1',
		guestName: 'John Doe',
		guestPhone: '+1-555-0123',
		guestEmail: 'john.doe@example.com',
		licensePlate: 'ABC-1234',
		carMake: 'Tesla',
		carModel: 'Model S',
		carColor: 'Black',
		status: 'parked',
		venueId: 'venue-1',
		locationSlot: 'A-15',
		validationPin: '1234',
		qrCode: 'QR123456',
		valetId: 'valet-1',
		managerId: 'manager-1',
		dropOffTime: new Date(Date.now() - 3600000), // 1 hour ago
		validatedAt: new Date(Date.now() - 3300000), // 55 minutes ago
	},
	{
		id: 'session-2',
		guestName: 'Jane Smith',
		guestPhone: '+1-555-0124',
		guestEmail: 'jane.smith@example.com',
		licensePlate: 'XYZ-9876',
		carMake: 'BMW',
		carModel: 'X5',
		carColor: 'Silver',
		status: 'requested',
		venueId: 'venue-1',
		locationSlot: 'B-23',
		validationPin: '5678',
		qrCode: 'QR789012',
		valetId: 'valet-2',
		managerId: 'manager-1',
		dropOffTime: new Date(Date.now() - 7200000), // 2 hours ago
		validatedAt: new Date(Date.now() - 6900000),
		requestedAt: new Date(Date.now() - 300000), // 5 minutes ago
		estimatedReturnTime: new Date(Date.now() + 600000), // 10 minutes from now
	},
	{
		id: 'session-3',
		guestName: 'Robert Johnson',
		guestPhone: '+1-555-0129',
		licensePlate: 'DEF-5555',
		carMake: 'Mercedes',
		carModel: 'C-Class',
		carColor: 'White',
		status: 'pending',
		venueId: 'venue-1',
		validationPin: '9999',
		qrCode: 'QR345678',
		valetId: 'valet-1',
		managerId: 'manager-1',
		dropOffTime: new Date(Date.now() - 1800000), // 30 minutes ago
	},
]

const mockTasks: ValetTask[] = [
	{
		id: 'task-1',
		sessionId: 'session-2',
		valetId: 'valet-2',
		type: 'pickup',
		priority: 'high',
		status: 'pending',
		assignedAt: new Date(Date.now() - 300000),
		estimatedDuration: 10,
	},
	{
		id: 'task-2',
		sessionId: 'session-3',
		valetId: 'valet-1',
		type: 'dropoff',
		priority: 'medium',
		status: 'in-progress',
		assignedAt: new Date(Date.now() - 1800000),
		estimatedDuration: 5,
	},
]

const mockAnalytics: AnalyticsData[] = [
	{
		venueId: 'venue-1',
		date: new Date(),
		totalSessions: 47,
		avgResponseTime: 8.5,
		avgReturnTime: 12.3,
		validationRate: 94.7,
		averageTip: 15.2,
		averageRating: 4.6,
		peakHours: [
			{ hour: 18, count: 12 },
			{ hour: 19, count: 15 },
			{ hour: 20, count: 18 },
			{ hour: 21, count: 14 },
		],
	},
]

export const mockData: MockData = {
	users: mockUsers,
	sessions: mockSessions,
	venues: mockVenues,
	tasks: mockTasks,
	analytics: mockAnalytics,
}

// Helper functions for mock data manipulation
export function findUserByEmail(email: string): User | undefined {
	return mockData.users.find(user => user.email === email)
}

export function findUserById(id: string): User | undefined {
	return mockData.users.find(user => user.id === id)
}

export function getSessionsByUser(userId: string): ValetSession[] {
	const user = findUserById(userId)
	if (!user) return []

	switch (user.role) {
		case 'guest':
			return mockData.sessions.filter(
				session => session.guestEmail === user.email
			)
		case 'valet':
			return mockData.sessions.filter(session => session.valetId === userId)
		case 'manager':
			return mockData.sessions.filter(session => session.venueId === user.venueId)
		case 'admin':
			return mockData.sessions
		default:
			return []
	}
}

export function getTasksByValet(valetId: string): ValetTask[] {
	return mockData.tasks.filter(task => task.valetId === valetId)
}

export function updateSessionStatus(sessionId: string, status: any): void {
	const session = mockData.sessions.find(s => s.id === sessionId)
	if (session) {
		session.status = status
		if (status === 'requested') {
			session.requestedAt = new Date()
		}
	}
}

export function findSessionByLicensePlate(licensePlate: string): ValetSession | undefined {
	const normalizedPlate = licensePlate.trim().toUpperCase()
	return mockData.sessions.find(session => 
		session.licensePlate.toUpperCase() === normalizedPlate
	)
} 