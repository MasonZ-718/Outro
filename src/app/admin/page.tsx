import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STATUS_COLORS } from '@/lib/constants'
import { findUserByEmail, mockData } from '@/lib/mock-data'
import { ValetSession, User, Venue, AnalyticsData } from '@/lib/types'
import Link from 'next/link'

export default function AdminDashboard() {
	// In a real app, get admin from session/auth
	const admin = findUserByEmail('admin@company.com')
	const allSessions = mockData.sessions
	const allUsers = mockData.users
	const allVenues = mockData.venues
	const analyticsData = mockData.analytics[0] // Using first analytics entry as example
	
	// Calculate platform-wide metrics
	const totalUsers = allUsers.length
	const activeVenues = allVenues.filter((venue: Venue) => venue.isActive).length
	const todaysSessions = allSessions.filter((session: ValetSession) => {
		const today = new Date()
		const sessionDate = new Date(session.dropOffTime)
		return sessionDate.toDateString() === today.toDateString()
	})
	
	const usersByRole = {
		guests: allUsers.filter((user: User) => user.role === 'guest').length,
		valets: allUsers.filter((user: User) => user.role === 'valet').length,
		managers: allUsers.filter((user: User) => user.role === 'manager').length,
		admins: allUsers.filter((user: User) => user.role === 'admin').length,
	}

	const totalCapacity = allVenues.reduce((sum: number, venue: Venue) => sum + venue.capacity, 0)
	const totalOccupancy = allVenues.reduce((sum: number, venue: Venue) => sum + venue.currentOccupancy, 0)
	const overallOccupancyRate = Math.round((totalOccupancy / totalCapacity) * 100)

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-7xl mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Platform Analytics
					</h1>
					<p className="text-gray-600">
						Welcome, {admin?.name || 'Admin'}! Here's your platform overview
					</p>
				</div>

				{/* Platform Overview */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Total Users
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-gray-900">
								{totalUsers}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								+5% this month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Active Venues
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{activeVenues}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{allVenues.length} total venues
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Today's Sessions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{todaysSessions.length}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								Across all venues
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Platform Occupancy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-600">
								{overallOccupancyRate}%
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{totalOccupancy}/{totalCapacity} total
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Performance Metrics */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Platform Performance</CardTitle>
						<CardDescription>
							Key performance indicators across all venues
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600 mb-1">
									{analyticsData.avgResponseTime.toFixed(1)}min
								</div>
								<p className="text-sm text-gray-600">Avg Response Time</p>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600 mb-1">
									{analyticsData.avgReturnTime.toFixed(1)}min
								</div>
								<p className="text-sm text-gray-600">Avg Return Time</p>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600 mb-1">
									{analyticsData.validationRate.toFixed(1)}%
								</div>
								<p className="text-sm text-gray-600">Validation Rate</p>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-600 mb-1">
									{analyticsData.averageRating.toFixed(1)}/5
								</div>
								<p className="text-sm text-gray-600">Average Rating</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* User Distribution */}
					<Card>
						<CardHeader>
							<CardTitle>User Distribution</CardTitle>
							<CardDescription>
								User breakdown by role
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Guests</span>
									<div className="flex items-center gap-2">
										<div className="w-32 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-blue-600 h-2 rounded-full" 
												style={{ width: `${(usersByRole.guests / totalUsers) * 100}%` }}
											></div>
										</div>
										<span className="text-sm text-gray-600 w-8">{usersByRole.guests}</span>
									</div>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Valets</span>
									<div className="flex items-center gap-2">
										<div className="w-32 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-green-600 h-2 rounded-full" 
												style={{ width: `${(usersByRole.valets / totalUsers) * 100}%` }}
											></div>
										</div>
										<span className="text-sm text-gray-600 w-8">{usersByRole.valets}</span>
									</div>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Managers</span>
									<div className="flex items-center gap-2">
										<div className="w-32 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-orange-600 h-2 rounded-full" 
												style={{ width: `${(usersByRole.managers / totalUsers) * 100}%` }}
											></div>
										</div>
										<span className="text-sm text-gray-600 w-8">{usersByRole.managers}</span>
									</div>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Admins</span>
									<div className="flex items-center gap-2">
										<div className="w-32 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-purple-600 h-2 rounded-full" 
												style={{ width: `${(usersByRole.admins / totalUsers) * 100}%` }}
											></div>
										</div>
										<span className="text-sm text-gray-600 w-8">{usersByRole.admins}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Venue Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Venue Overview</CardTitle>
							<CardDescription>
								Performance by venue
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{allVenues.map((venue: Venue) => (
									<div key={venue.id} className="border rounded-lg p-4">
										<div className="flex justify-between items-start mb-2">
											<div>
												<h4 className="font-medium text-gray-900">{venue.name}</h4>
												<p className="text-sm text-gray-600">{venue.address}</p>
											</div>
											<div className={`px-2 py-1 rounded text-xs font-medium ${
												venue.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
											}`}>
												{venue.isActive ? 'Active' : 'Inactive'}
											</div>
										</div>
										<div className="flex justify-between items-center text-sm text-gray-600">
											<span>Capacity: {venue.capacity}</span>
											<span>Occupancy: {venue.currentOccupancy} ({Math.round((venue.currentOccupancy / venue.capacity) * 100)}%)</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Activity */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Recent Sessions</CardTitle>
						<CardDescription>
							Latest valet sessions across all venues
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{allSessions.slice(0, 8).map((session: ValetSession) => {
								const venue = allVenues.find((v: Venue) => v.id === session.venueId)
								return (
									<div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex-1">
											<div className="flex items-center gap-3">
												<div>
													<h4 className="font-medium text-gray-900">
														{session.guestName}
													</h4>
													<p className="text-sm text-gray-600">
														{session.licensePlate} • {session.carMake} {session.carModel}
													</p>
													<p className="text-xs text-gray-500">
														{venue?.name || 'Unknown Venue'} • {session.dropOffTime.toLocaleString()}
													</p>
												</div>
											</div>
										</div>
										<div className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[session.status]}`}>
											{session.status}
										</div>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>

				{/* Admin Actions */}
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Management</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">User Management</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Manage users, roles, and permissions
								</p>
								<Link href="/admin/users">
									<Button className="w-full">
										Manage Users
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Venue Management</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Add, edit, and monitor venues
								</p>
								<Link href="/admin/venues">
									<Button variant="outline" className="w-full">
										Manage Venues
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">System Logs</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									View system activity and audit trails
								</p>
								<Link href="/admin/logs">
									<Button variant="outline" className="w-full">
										View Logs
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Analytics</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Detailed reports and insights
								</p>
								<Link href="/admin/analytics">
									<Button variant="outline" className="w-full">
										View Analytics
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	)
} 