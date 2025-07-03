import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusIndicator, StatusDot } from '@/components/ui/status-indicator'
import { findUserByEmail, mockData } from '@/lib/mock-data'
import { User, ValetTask } from '@/lib/types'
import Link from 'next/link'

export default function ManagerStaffPage() {
	// In a real app, get manager from session/auth
	const manager = findUserByEmail('alex.manager@company.com')
	const allStaff = mockData.users.filter((user: User) => user.role === 'valet')
	const allTasks = mockData.tasks

	const getStaffStats = (staffId: string) => {
		const staffTasks = allTasks.filter(task => task.valetId === staffId)
		const completedTasks = staffTasks.filter(task => task.status === 'completed')
		const pendingTasks = staffTasks.filter(task => task.status === 'pending')
		const inProgressTasks = staffTasks.filter(task => task.status === 'in-progress')
		
		return {
			total: staffTasks.length,
			completed: completedTasks.length,
			pending: pendingTasks.length,
			inProgress: inProgressTasks.length,
			completionRate: staffTasks.length > 0 ? Math.round((completedTasks.length / staffTasks.length) * 100) : 0
		}
	}

	const getStaffStatus = (staff: User) => {
		const stats = getStaffStats(staff.id)
		if (stats.inProgress > 0) return 'active'
		if (stats.pending > 0) return 'available'
		return 'idle'
	}

	const StaffCard = ({ staff }: { staff: User }) => {
		const stats = getStaffStats(staff.id)
		const status = getStaffStatus(staff)

		return (
			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								{staff.name}
								<StatusDot status={status} />
							</CardTitle>
							<CardDescription>{staff.email}</CardDescription>
						</div>
						<StatusIndicator status={status} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4 mb-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
							<p className="text-xs text-gray-600">Active</p>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
							<p className="text-xs text-gray-600">Pending</p>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">{stats.completed}</div>
							<p className="text-xs text-gray-600">Completed</p>
						</div>
					</div>

					<div className="mb-4">
						<div className="flex justify-between text-sm mb-1">
							<span>Completion Rate</span>
							<span>{stats.completionRate}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div 
								className="bg-green-600 h-2 rounded-full" 
								style={{ width: `${stats.completionRate}%` }}
							></div>
						</div>
					</div>

					<div className="flex gap-2">
						<Button size="sm" variant="outline">
							Assign Task
						</Button>
						<Button size="sm" variant="outline">
							View Details
						</Button>
						<Button size="sm" variant="outline">
							Contact
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}

	const activeStaff = allStaff.filter(staff => getStaffStatus(staff) === 'active')
	const availableStaff = allStaff.filter(staff => getStaffStatus(staff) === 'available')
	const idleStaff = allStaff.filter(staff => getStaffStatus(staff) === 'idle')

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-7xl mx-auto p-6">
				<div className="mb-6">
					<Link href="/manager" className="text-blue-600 hover:text-blue-800 text-sm">
						← Back to Dashboard
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mt-2">Staff Management</h1>
					<p className="text-gray-600">Monitor and manage your valet staff performance</p>
				</div>

				{/* Staff Overview Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-gray-900">{allStaff.length}</div>
							<p className="text-sm text-gray-600">Total Staff</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-green-600">{activeStaff.length}</div>
							<p className="text-sm text-gray-600">Currently Active</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-blue-600">{availableStaff.length}</div>
							<p className="text-sm text-gray-600">Available</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-gray-600">{idleStaff.length}</div>
							<p className="text-sm text-gray-600">Idle</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common staff management tasks</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Button>
								Assign New Task
							</Button>
							<Button variant="outline">
								Broadcast Message
							</Button>
							<Button variant="outline">
								Schedule Shift
							</Button>
							<Button variant="outline">
								View Performance Reports
							</Button>
							<Button variant="outline">
								Add New Staff Member
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Active Staff */}
				{activeStaff.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Currently Active ({activeStaff.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{activeStaff.map((staff) => (
								<StaffCard key={staff.id} staff={staff} />
							))}
						</div>
					</div>
				)}

				{/* Available Staff */}
				{availableStaff.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Available Staff ({availableStaff.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{availableStaff.map((staff) => (
								<StaffCard key={staff.id} staff={staff} />
							))}
						</div>
					</div>
				)}

				{/* Idle Staff */}
				{idleStaff.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Idle Staff ({idleStaff.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{idleStaff.map((staff) => (
								<StaffCard key={staff.id} staff={staff} />
							))}
						</div>
					</div>
				)}

				{/* Performance Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Today's Performance Summary</CardTitle>
						<CardDescription>Overview of staff performance metrics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<h3 className="font-semibold mb-3">Top Performers</h3>
								<div className="space-y-2">
									{allStaff
										.sort((a, b) => getStaffStats(b.id).completed - getStaffStats(a.id).completed)
										.slice(0, 3)
										.map((staff, index) => (
											<div key={staff.id} className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="text-lg font-bold text-gray-400">#{index + 1}</span>
													<span className="text-sm font-medium">{staff.name}</span>
												</div>
												<span className="text-sm text-green-600 font-bold">
													{getStaffStats(staff.id).completed} tasks
												</span>
											</div>
										))}
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-3">Task Distribution</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm">Total Tasks</span>
										<span className="font-bold">{allTasks.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">Completed</span>
										<span className="font-bold text-green-600">
											{allTasks.filter(task => task.status === 'completed').length}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">In Progress</span>
										<span className="font-bold text-blue-600">
											{allTasks.filter(task => task.status === 'in-progress').length}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">Pending</span>
										<span className="font-bold text-yellow-600">
											{allTasks.filter(task => task.status === 'pending').length}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-3">Average Response Time</h3>
								<div className="text-2xl font-bold text-blue-600 mb-2">12 min</div>
								<p className="text-sm text-gray-600">
									Average time from task assignment to completion
								</p>
								<div className="mt-3">
									<div className="text-sm font-medium text-green-600">↓ 2min from yesterday</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	)
} 