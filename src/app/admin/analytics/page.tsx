import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { findUserByEmail, mockData } from '@/lib/mock-data'
import { ValetSession, User, Venue, AnalyticsData } from '@/lib/types'
import Link from 'next/link'

export default function AdminAnalyticsPage() {
	// In a real app, get admin from session/auth
	const admin = findUserByEmail('admin@company.com')
	const allSessions = mockData.sessions
	const allUsers = mockData.users
	const allVenues = mockData.venues
	const analyticsData = mockData.analytics[0] // Using first analytics entry

	// Calculate metrics
	const totalSessions = allSessions.length
	const completedSessions = allSessions.filter(session => session.status === 'completed').length
	const activeSessions = allSessions.filter(session => !['completed'].includes(session.status)).length
	const totalUsers = allUsers.length
	const activeVenues = allVenues.filter(venue => venue.isActive).length

	// Calculate revenue (mock calculation)
	const totalRevenue = allSessions.reduce((sum, session) => sum + (session.tip || 0), 0)
	const avgSessionValue = totalSessions > 0 ? totalRevenue / totalSessions : 0

	// User role distribution
	const usersByRole = allUsers.reduce((acc, user) => {
		acc[user.role] = (acc[user.role] || 0) + 1
		return acc
	}, {} as Record<string, number>)

	// Session status distribution
	const sessionsByStatus = allSessions.reduce((acc, session) => {
		acc[session.status] = (acc[session.status] || 0) + 1
		return acc
	}, {} as Record<string, number>)

	// Top performing venues
	const venueSessionCounts = allSessions.reduce((acc, session) => {
		acc[session.venueId] = (acc[session.venueId] || 0) + 1
		return acc
	}, {} as Record<string, number>)

	const topVenues = Object.entries(venueSessionCounts)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5)
		.map(([venueId, count]) => {
			const venue = allVenues.find(v => v.id === venueId)
			return { venue: venue?.name || venueId, count }
		})

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-7xl mx-auto p-6">
				<div className="mb-6">
					<Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
						← Back to Dashboard
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mt-2">Analytics Dashboard</h1>
					<p className="text-gray-600">Platform-wide performance metrics and insights</p>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
							<p className="text-sm text-gray-600">Total Sessions</p>
							<div className="text-xs text-green-600 mt-1">+12% from last month</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-green-600">{completedSessions}</div>
							<p className="text-sm text-gray-600">Completed Sessions</p>
							<div className="text-xs text-green-600 mt-1">
								{totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}% completion rate
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</div>
							<p className="text-sm text-gray-600">Total Revenue</p>
							<div className="text-xs text-green-600 mt-1">+8% from last month</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-orange-600">${avgSessionValue.toFixed(2)}</div>
							<p className="text-sm text-gray-600">Avg. Session Value</p>
							<div className="text-xs text-red-600 mt-1">-2% from last month</div>
						</CardContent>
					</Card>
				</div>

				{/* Charts Row */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Session Status Distribution */}
					<Card>
						<CardHeader>
							<CardTitle>Session Status Distribution</CardTitle>
							<CardDescription>Current session status breakdown</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{Object.entries(sessionsByStatus).map(([status, count]) => {
									const percentage = Math.round((count / totalSessions) * 100)
									const colorMap: Record<string, string> = {
										completed: 'bg-green-500',
										pending: 'bg-yellow-500',
										validated: 'bg-blue-500',
										parked: 'bg-purple-500',
										requested: 'bg-orange-500',
										retrieving: 'bg-pink-500',
										ready: 'bg-indigo-500'
									}
									
									return (
										<div key={status} className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className={`w-3 h-3 rounded ${colorMap[status] || 'bg-gray-500'}`} />
												<span className="text-sm font-medium capitalize">{status.replace('-', ' ')}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm text-gray-600">{count}</span>
												<span className="text-xs text-gray-500">({percentage}%)</span>
											</div>
										</div>
									)
								})}
							</div>
						</CardContent>
					</Card>

					{/* User Role Distribution */}
					<Card>
						<CardHeader>
							<CardTitle>User Distribution</CardTitle>
							<CardDescription>Platform users by role</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{Object.entries(usersByRole).map(([role, count]) => {
									const percentage = Math.round((count / totalUsers) * 100)
									const colorMap: Record<string, string> = {
										admin: 'bg-red-500',
										manager: 'bg-blue-500',
										valet: 'bg-green-500',
										guest: 'bg-purple-500'
									}
									
									return (
										<div key={role} className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className={`w-3 h-3 rounded ${colorMap[role] || 'bg-gray-500'}`} />
												<span className="text-sm font-medium capitalize">{role}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm text-gray-600">{count}</span>
												<span className="text-xs text-gray-500">({percentage}%)</span>
											</div>
										</div>
									)
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Performance Metrics */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Top Venues */}
					<Card>
						<CardHeader>
							<CardTitle>Top Performing Venues</CardTitle>
							<CardDescription>By session volume</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{topVenues.map((item, index) => (
									<div key={item.venue} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-lg font-bold text-gray-400">#{index + 1}</span>
											<span className="text-sm font-medium">{item.venue}</span>
										</div>
										<span className="text-sm font-bold text-blue-600">{item.count} sessions</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* System Health */}
					<Card>
						<CardHeader>
							<CardTitle>System Health</CardTitle>
							<CardDescription>Platform status overview</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm">Active Venues</span>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full" />
										<span className="font-bold">{activeVenues}/{allVenues.length}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Active Sessions</span>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full" />
										<span className="font-bold">{activeSessions}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">System Uptime</span>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full" />
										<span className="font-bold">99.9%</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Avg Response Time</span>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-yellow-500 rounded-full" />
										<span className="font-bold">120ms</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest system events</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="text-sm">
									<div className="font-medium">New venue registered</div>
									<div className="text-gray-500">Downtown Plaza - 2 hours ago</div>
								</div>
								<div className="text-sm">
									<div className="font-medium">Peak traffic detected</div>
									<div className="text-gray-500">Mall venue - 4 hours ago</div>
								</div>
								<div className="text-sm">
									<div className="font-medium">System maintenance completed</div>
									<div className="text-gray-500">All systems - 6 hours ago</div>
								</div>
								<div className="text-sm">
									<div className="font-medium">New valet onboarded</div>
									<div className="text-gray-500">Sarah Johnson - 8 hours ago</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Export Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Data Export & Reports</CardTitle>
						<CardDescription>Generate detailed reports and export data</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Button>
								Export Session Data
							</Button>
							<Button variant="outline">
								Download User Report
							</Button>
							<Button variant="outline">
								Venue Performance Report
							</Button>
							<Button variant="outline">
								Financial Summary
							</Button>
							<Button variant="outline">
								System Logs
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	)
} 