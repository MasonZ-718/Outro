import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STATUS_COLORS, TASK_STATUS_COLORS, PRIORITY_COLORS } from '@/lib/constants'
import { findUserByEmail, getSessionsByUser, mockData } from '@/lib/mock-data'
import { ValetSession, ValetTask, User } from '@/lib/types'
import Link from 'next/link'

export default function ManagerDashboard() {
	// In a real app, get manager from session/auth
	const manager = findUserByEmail('alex.manager@company.com')
	const allSessions = manager ? getSessionsByUser(manager.id) : []
	const allTasks = mockData.tasks
	const allValets = mockData.users.filter((user: User) => user.role === 'valet')
	
	const activeSessions = allSessions.filter((session: ValetSession) => 
		!['completed'].includes(session.status)
	)
	const pendingTasks = allTasks.filter((task: ValetTask) => 
		task.status === 'pending'
	)
	const todaysSessions = allSessions.filter((session: ValetSession) => {
		const today = new Date()
		const sessionDate = new Date(session.dropOffTime)
		return sessionDate.toDateString() === today.toDateString()
	})

	// Calculate occupancy rate
	const venueCapacity = 150 // This would come from venue data
	const currentOccupancy = activeSessions.length
	const occupancyRate = Math.round((currentOccupancy / venueCapacity) * 100)

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-7xl mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Manager Overview
					</h1>
					<p className="text-gray-600">
						Welcome back, {manager?.name || 'Manager'}! Here's your venue overview
					</p>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Today's Sessions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-gray-900">
								{todaysSessions.length}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								+12% from yesterday
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Occupancy Rate
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{occupancyRate}%
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{currentOccupancy}/{venueCapacity} spaces
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Pending Tasks
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-orange-600">
								{pendingTasks.length}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								Require attention
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Active Valets
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{allValets.filter((valet: User) => valet.isActive).length}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								On duty now
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Recent Sessions */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Recent Sessions</CardTitle>
							<CardDescription>
								Latest valet sessions at your venue
							</CardDescription>
						</CardHeader>
						<CardContent>
							{allSessions.length > 0 ? (
								<div className="space-y-4">
									{allSessions.slice(0, 5).map((session: ValetSession) => (
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
													</div>
												</div>
												<div className="mt-2 text-xs text-gray-500">
													Drop-off: {session.dropOffTime.toLocaleString()}
													{session.locationSlot && ` • Location: ${session.locationSlot}`}
												</div>
											</div>
											<div className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[session.status]}`}>
												{session.status}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-8">
									No sessions yet today
								</p>
							)}
						</CardContent>
					</Card>

					{/* Task Assignment */}
					<Card>
						<CardHeader>
							<CardTitle>Task Management</CardTitle>
							<CardDescription>
								Assign and monitor valet tasks
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{pendingTasks.length > 0 ? (
									pendingTasks.map((task: ValetTask) => {
										const session = allSessions.find((s: ValetSession) => s.id === task.sessionId)
										const assignedValet = allValets.find((v: User) => v.id === task.valetId)
										return (
											<div key={task.id} className="border rounded-lg p-3">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h5 className="font-medium text-sm">
															{task.type === 'pickup' ? 'Pickup' : 'Drop-off'}
														</h5>
														<p className="text-xs text-gray-600">
															{session?.licensePlate}
														</p>
													</div>
													<div className={`px-2 py-1 rounded text-xs ${PRIORITY_COLORS[task.priority]}`}>
														{task.priority}
													</div>
												</div>
												<p className="text-xs text-gray-500">
													Assigned to: {assignedValet?.name || 'Unassigned'}
												</p>
											</div>
										)
									})
								) : (
									<p className="text-gray-500 text-sm">No pending tasks</p>
								)}
								
								<Link href="/manager/assign">
									<Button className="w-full mt-4">
										Manage Tasks
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Staff Overview */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Valet Staff Overview</CardTitle>
						<CardDescription>
							Current staff status and performance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{allValets.map((valet: User) => (
								<div key={valet.id} className="border rounded-lg p-4">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h4 className="font-medium text-gray-900">{valet.name}</h4>
											<p className="text-sm text-gray-600">{valet.email}</p>
										</div>
										<div className={`px-2 py-1 rounded text-xs font-medium ${
											valet.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
											{valet.isActive ? 'Active' : 'Inactive'}
										</div>
									</div>
									<div className="text-sm text-gray-500">
										<p>Tasks: {allTasks.filter((t: ValetTask) => t.valetId === valet.id).length}</p>
										<p>Sessions: {allSessions.filter((s: ValetSession) => s.valetId === valet.id).length}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Assign Tasks</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Assign pending tasks to available valets
								</p>
								<Link href="/manager/assign">
									<Button className="w-full">
										Assign Tasks
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Staff Management</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Manage valet staff and schedules
								</p>
								<Link href="/manager/staff">
									<Button variant="outline" className="w-full">
										Manage Staff
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Settings</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Configure venue settings and preferences
								</p>
								<Link href="/manager/settings">
									<Button variant="outline" className="w-full">
										Settings
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Reports</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									View detailed reports and analytics
								</p>
								<Button variant="outline" className="w-full">
									View Reports
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	)
} 