import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { findUserByEmail, getTasksByValet, mockData } from '@/lib/mock-data'
import { ValetTask, ValetSession } from '@/lib/types'
import Link from 'next/link'

export default function ValetTasksPage() {
	// In a real app, get valet from session/auth
	const valet = findUserByEmail('mike.wilson@company.com')
	const valetTasks = valet ? getTasksByValet(valet.id) : []
	
	const pendingTasks = valetTasks.filter((task: ValetTask) => task.status === 'pending')
	const inProgressTasks = valetTasks.filter((task: ValetTask) => task.status === 'in-progress')
	const completedTasks = valetTasks.filter((task: ValetTask) => task.status === 'completed')

	const getTaskSession = (sessionId: string): ValetSession | undefined => {
		return mockData.sessions.find(session => session.id === sessionId)
	}

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'border-l-red-500 bg-red-50'
			case 'medium':
				return 'border-l-yellow-500 bg-yellow-50'
			default:
				return 'border-l-green-500 bg-green-50'
		}
	}

	const TaskCard = ({ task }: { task: ValetTask }) => {
		const session = getTaskSession(task.sessionId)
		if (!session) return null

		return (
			<Card className={`border-l-4 ${getPriorityColor(task.priority)}`}>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">
								{task.type === 'dropoff' ? 'Park Vehicle' : 'Retrieve Vehicle'}
							</CardTitle>
							<CardDescription>
								{session.carMake} {session.carModel} • {session.licensePlate}
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<StatusIndicator status={task.priority} size="sm" />
							<StatusIndicator status={task.status} />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div>
							<p className="text-sm text-gray-600">Guest</p>
							<p className="font-medium">{session.guestName}</p>
							<p className="text-sm text-gray-500">{session.guestPhone}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Location</p>
							<p className="font-medium">{session.locationSlot || 'TBD'}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Assigned</p>
							<p className="font-medium">{new Date(task.assignedAt).toLocaleString()}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Est. Duration</p>
							<p className="font-medium">{task.estimatedDuration} min</p>
						</div>
					</div>

					{session.notes && (
						<div className="bg-blue-50 p-3 rounded-md mb-4">
							<p className="text-sm font-medium text-blue-900">Notes:</p>
							<p className="text-sm text-blue-800">{session.notes}</p>
						</div>
					)}

					<div className="flex gap-2">
						{task.status === 'pending' && (
							<Button size="sm">
								Start Task
							</Button>
						)}
						{task.status === 'in-progress' && (
							<Button size="sm">
								Complete Task
							</Button>
						)}
						{task.status === 'completed' && (
							<Button size="sm" variant="outline" disabled>
								Completed ✓
							</Button>
						)}
						<Button size="sm" variant="outline">
							Contact Guest
						</Button>
						<Button size="sm" variant="outline">
							Update Status
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-6xl mx-auto p-6">
				<div className="mb-6">
					<Link href="/valet" className="text-blue-600 hover:text-blue-800 text-sm">
						← Back to Dashboard
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mt-2">Task Management</h1>
					<p className="text-gray-600">Manage your assigned valet tasks and workflow</p>
				</div>

				{/* Task Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
							<p className="text-sm text-gray-600">Pending Tasks</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
							<p className="text-sm text-gray-600">In Progress</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
							<p className="text-sm text-gray-600">Completed Today</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-purple-600">
								{Math.round(valetTasks.reduce((acc, task) => acc + task.estimatedDuration, 0) / 60 * 10) / 10}h
							</div>
							<p className="text-sm text-gray-600">Total Est. Time</p>
						</CardContent>
					</Card>
				</div>

				{/* In Progress Tasks */}
				{inProgressTasks.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Working On</h2>
						<div className="space-y-4">
							{inProgressTasks.map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
						</div>
					</div>
				)}

				{/* Pending Tasks */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Pending Tasks ({pendingTasks.length})
					</h2>
					{pendingTasks.length === 0 ? (
						<Card>
							<CardContent className="pt-6 text-center">
								<p className="text-gray-500">No pending tasks at the moment.</p>
								<p className="text-sm text-gray-400 mt-1">New tasks will appear here when assigned.</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{pendingTasks.map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
						</div>
					)}
				</div>

				{/* Completed Tasks */}
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Completed Today ({completedTasks.length})
					</h2>
					{completedTasks.length === 0 ? (
						<Card>
							<CardContent className="pt-6 text-center">
								<p className="text-gray-500">No completed tasks yet today.</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{completedTasks.slice(0, 5).map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
							{completedTasks.length > 5 && (
								<Card>
									<CardContent className="pt-6 text-center">
										<Button variant="outline">
											View All Completed Tasks ({completedTasks.length - 5} more)
										</Button>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	)
} 