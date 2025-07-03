import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STATUS_COLORS, TASK_STATUS_COLORS, PRIORITY_COLORS } from '@/lib/constants'
import { findUserByEmail, getSessionsByUser, getTasksByValet } from '@/lib/mock-data'
import { ValetSession, ValetTask } from '@/lib/types'
import Link from 'next/link'

export default function ValetDashboard() {
	// In a real app, get valet from session/auth
	const valet = findUserByEmail('mike.wilson@company.com')
	const valetSessions = valet ? getSessionsByUser(valet.id) : []
	const valetTasks = valet ? getTasksByValet(valet.id) : []
	
	const activeSessions = valetSessions.filter((session: ValetSession) => 
		!['completed'].includes(session.status)
	)
	const pendingTasks = valetTasks.filter((task: ValetTask) => 
		task.status === 'pending'
	)
	const inProgressTasks = valetTasks.filter((task: ValetTask) => 
		task.status === 'in-progress'
	)

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-6xl mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Valet Dashboard
					</h1>
					<p className="text-gray-600">
						Welcome back, {valet?.name || 'Valet'}! Manage your tasks and sessions
					</p>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Active Sessions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-gray-900">
								{activeSessions.length}
							</div>
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
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								In Progress
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{inProgressTasks.length}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Completed Today
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								3
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Current Tasks */}
					<Card>
						<CardHeader>
							<CardTitle>Current Tasks</CardTitle>
							<CardDescription>
								Your assigned tasks for today
							</CardDescription>
						</CardHeader>
						<CardContent>
							{valetTasks.length > 0 ? (
								<div className="space-y-4">
									{valetTasks.map((task: ValetTask) => {
										const session = valetSessions.find((s: ValetSession) => s.id === task.sessionId)
										return (
											<div key={task.id} className="border rounded-lg p-4">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h4 className="font-medium">
															{task.type === 'pickup' ? 'Vehicle Pickup' : 'Vehicle Drop-off'}
														</h4>
														<p className="text-sm text-gray-600">
															{session?.licensePlate} • {session?.carMake} {session?.carModel}
														</p>
													</div>
													<div className="flex gap-2">
														<div className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
															{task.priority}
														</div>
														<div className={`px-2 py-1 rounded text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
															{task.status}
														</div>
													</div>
												</div>
												<div className="flex justify-between items-center text-sm text-gray-600">
													<span>Est. {task.estimatedDuration} min</span>
													<span>
														{session?.locationSlot && `Location: ${session.locationSlot}`}
													</span>
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<p className="text-gray-500 text-center py-8">
									No tasks assigned yet
								</p>
							)}
						</CardContent>
					</Card>

					{/* Active Sessions */}
					<Card>
						<CardHeader>
							<CardTitle>Active Sessions</CardTitle>
							<CardDescription>
								Sessions you're currently handling
							</CardDescription>
						</CardHeader>
						<CardContent>
							{activeSessions.length > 0 ? (
								<div className="space-y-4">
									{activeSessions.map((session: ValetSession) => (
										<div key={session.id} className="border rounded-lg p-4">
											<div className="flex justify-between items-start mb-2">
												<div>
													<h4 className="font-medium">
														{session.guestName}
													</h4>
													<p className="text-sm text-gray-600">
														{session.licensePlate} • {session.carMake} {session.carModel}
													</p>
												</div>
												<div className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[session.status]}`}>
													{session.status}
												</div>
											</div>
											<div className="flex justify-between items-center text-sm text-gray-600">
												<span>
													Drop-off: {session.dropOffTime.toLocaleTimeString()}
												</span>
												{session.locationSlot && (
													<span>Location: {session.locationSlot}</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-8">
									No active sessions
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div className="mt-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Create Session</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									Start a new valet session for a guest
								</p>
								<Link href="/valet/create">
									<Button className="w-full">
										New Session
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">View All Tasks</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									See all your assigned tasks and update status
								</p>
								<Link href="/valet/tasks">
									<Button variant="outline" className="w-full">
										Manage Tasks
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Session History</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600 mb-3">
									View completed sessions and performance metrics
								</p>
								<Button variant="outline" className="w-full">
									View History
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	)
} 