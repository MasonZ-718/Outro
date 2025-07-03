import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS } from '@/lib/constants'
import { findUserByEmail, getSessionsByUser } from '@/lib/mock-data'
import { ValetSession } from '@/lib/types'
import Link from 'next/link'

export default function GuestDashboard() {
	// In a real app, get guest from session/auth
	const guest = findUserByEmail('john.doe@example.com')
	const guestSessions = guest ? getSessionsByUser(guest.id) : []
	const activeSession = guestSessions.find((session: ValetSession) => 
		!['completed'].includes(session.status)
	)

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<main className="max-w-4xl mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome, {guest?.name || 'Guest'}
					</h1>
					<p className="text-gray-600">
						Manage your valet session and track your vehicle status
					</p>
				</div>

				{activeSession ? (
					<div className="space-y-6">
						{/* Active Session Card */}
						<Card>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>Current Session</CardTitle>
										<CardDescription>
											{activeSession.licensePlate} • {activeSession.carMake} {activeSession.carModel}
										</CardDescription>
									</div>
									<div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[activeSession.status]}`}>
										{activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div>
										<h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
										<div className="space-y-1 text-sm text-gray-600">
											<p>Drop-off: {activeSession.dropOffTime.toLocaleString()}</p>
											{activeSession.locationSlot && (
												<p>Location: {activeSession.locationSlot}</p>
											)}
											{activeSession.validationPin && (
												<p>PIN: {activeSession.validationPin}</p>
											)}
										</div>
									</div>
									<div>
										<h4 className="font-medium text-gray-900 mb-2">Estimated Return</h4>
										<p className="text-sm text-gray-600">
											{activeSession.estimatedReturnTime 
												? activeSession.estimatedReturnTime.toLocaleString()
												: 'Not scheduled yet'
											}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-3">
									{activeSession.status === 'pending' && (
										<Link href="/guest/validate">
											<Button>Validate Session</Button>
										</Link>
									)}
									{['validated', 'parked'].includes(activeSession.status) && (
										<Link href="/guest/request">
											<Button>Request Return</Button>
										</Link>
									)}
									{activeSession.status === 'ready' && (
										<Link href="/guest/tip">
											<Button>Rate & Tip</Button>
										</Link>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-lg">Session Status</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 mb-3">
										View detailed status and tracking information
									</p>
									<Link href="/guest/session">
										<Button variant="outline" className="w-full">
											View Details
										</Button>
									</Link>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-lg">Validation</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 mb-3">
										Validate your session with PIN or QR code
									</p>
									<Link href="/guest/validate">
										<Button variant="outline" className="w-full">
											Validate Now
										</Button>
									</Link>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-lg">Need Help?</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 mb-3">
										Contact support or view session history
									</p>
									<Button variant="outline" className="w-full">
										Contact Support
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				) : (
					<Card>
						<CardHeader>
							<CardTitle>No Active Session</CardTitle>
							<CardDescription>
								You don't have any active valet sessions at the moment.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								To start a new valet session, please visit one of our participating venues 
								and drop off your vehicle with a valet operator.
							</p>
							<Button variant="outline">
								Find Locations
							</Button>
						</CardContent>
					</Card>
				)}
			</main>
		</div>
	)
} 