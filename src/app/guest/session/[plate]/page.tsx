'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS } from '@/lib/constants'
import { findSessionByLicensePlate, findUserById } from '@/lib/mock-data'

// Mock validation function
const VALIDATION_CODES = ['SUNSET10', 'MALL2025']
function isValidCode(code: string): boolean { 
	return VALIDATION_CODES.includes(code.toUpperCase()) 
}

export default function GuestSessionPage() {
	const params = useParams()
	const licensePlate = decodeURIComponent(params.plate as string).toUpperCase()
	console.log('License plate:', licensePlate)

	const session = findSessionByLicensePlate(licensePlate)
	console.log('Session lookup result:', session)

	// State for dynamic session status
	const [sessionStatus, setSessionStatus] = useState(session?.status || '')
	const [isRequestDisabled, setIsRequestDisabled] = useState(false)
	const [showToast, setShowToast] = useState(false)
	const [isValidated, setIsValidated] = useState(session?.validatedAt !== undefined)
	const [validatedAt, setValidatedAt] = useState(session?.validatedAt)
	const [showValidationInput, setShowValidationInput] = useState(false)
	const [validationCode, setValidationCode] = useState('')
	const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)
	const [showStatusTooltip, setShowStatusTooltip] = useState(false)
	const [showValidationTooltip, setShowValidationTooltip] = useState(false)
	const [requestTime, setRequestTime] = useState<Date | null>(null)
	const [countdown, setCountdown] = useState(0)
	const [showReportModal, setShowReportModal] = useState(false)

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<main className="max-w-4xl mx-auto p-4 sm:p-6">
					<Card className="text-center">
						<CardHeader>
							<CardTitle className="text-xl text-red-600">Session Not Found</CardTitle>
							<CardDescription>
								No active valet session found for license plate: {licensePlate}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								This could mean:
							</p>
							<ul className="text-sm text-gray-600 space-y-1 mb-6">
								<li>• The session may have been completed</li>
								<li>• The license plate was entered incorrectly</li>
								<li>• The session hasn't been created yet</li>
							</ul>
							<div className="space-y-3">
								<Link href="/">
									<Button className="w-full sm:w-auto">
										Try Another Plate
									</Button>
								</Link>
								<Link href="/guest/login">
									<Button variant="outline" className="w-full sm:w-auto">
										Login as Guest
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</main>
			</div>
		)
	}

	const valet = session?.valetId ? findUserById(session.valetId) : null

	// Countdown timer effect
	useEffect(() => {
		if (sessionStatus === 'requested' && countdown > 0) {
			const timer = setInterval(() => {
				setCountdown(prev => prev - 1)
			}, 1000)
			return () => clearInterval(timer)
		}
	}, [sessionStatus, countdown])

	// Close tooltips when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element
			if (!target.closest('.status-tooltip-container') && !target.closest('.validation-tooltip-container')) {
				setShowStatusTooltip(false)
				setShowValidationTooltip(false)
			}
		}

		if (showStatusTooltip || showValidationTooltip) {
			document.addEventListener('click', handleClickOutside)
			return () => document.removeEventListener('click', handleClickOutside)
		}
	}, [showStatusTooltip, showValidationTooltip])

	// Get status explanation for tooltip
	const getStatusExplanation = (status: string) => {
		switch (status) {
			case 'pending':
				return 'Your vehicle has been handed to a valet and is being processed.'
			case 'validated':
				return 'A valet has been assigned and is currently parking your vehicle in a secure location.'
			case 'parked':
				return 'Your vehicle is safely parked. You can request its return anytime from this page.'
			case 'requested':
				return 'A valet has been notified to retrieve your car. This usually takes 5-10 minutes.'
			case 'retrieving':
				return 'A valet is currently retrieving your vehicle from the parking location.'
			case 'ready':
				return 'Your vehicle is at the pickup location and ready for collection.'
			case 'completed':
				return 'Your valet session has been completed. Thank you for using our service!'
			default:
				return 'Status information unavailable.'
		}
	}

	// Format countdown time
	const formatCountdown = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	// Get estimated return time
	const getEstimatedReturnTime = () => {
		if (!requestTime) return null
		const estimatedTime = new Date(requestTime.getTime() + 5 * 60 * 1000) // 5 minutes
		return estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}



	// Handle report issue
	const handleReportIssue = () => {
		setShowReportModal(true)
	}

	// Submit report (mock function)
	const submitReport = (message: string) => {
		// Mock API call
		console.log('Report submitted:', message)
		setShowReportModal(false)
		setShowToast(true)
		setTimeout(() => setShowToast(false), 3000)
	}

	// Request car function
	const requestCar = () => {
		setSessionStatus('requested')
		setIsRequestDisabled(true)
		setRequestTime(new Date())
		setCountdown(5 * 60) // 5 minutes in seconds
		setShowToast(true)
		// Hide toast after 3 seconds
		setTimeout(() => setShowToast(false), 3000)
		
		// Simulate progression: requested → retrieving after 30 seconds (for demo)
		setTimeout(() => {
			if (sessionStatus === 'requested') {
				setSessionStatus('retrieving')
			}
		}, 30000)
	}

	// Validate parking function
	const validateParking = () => {
		if (isValidCode(validationCode)) {
			const now = new Date()
			setIsValidated(true)
			setValidatedAt(now)
			setShowValidationInput(false)
			setValidationCode('')
			setShowToast(true)
			// Hide toast after 3 seconds
			setTimeout(() => setShowToast(false), 3000)
		} else {
			alert('Invalid validation code. Try: SUNSET10 or MALL2025')
		}
	}

	const getStatusMessage = (status: string) => {
		switch (status) {
			case 'pending':
				return 'Handed to valet'
			case 'validated':
				return 'Being parked'
			case 'parked':
				return 'Parked'
			case 'requested':
				return 'Requested'
			case 'retrieving':
				return 'Retrieving'
			case 'ready':
				return 'Ready at valet'
			case 'completed':
				return 'Session completed'
			default:
				return 'Status unknown'
		}
	}

	const getParkingDuration = () => {
		const now = new Date()
		const dropOffTime = new Date(session.dropOffTime)
		const diffInMinutes = Math.floor((now.getTime() - dropOffTime.getTime()) / (1000 * 60))
		
		if (diffInMinutes < 60) {
			return `${diffInMinutes}m`
		} else {
			const hours = Math.floor(diffInMinutes / 60)
			const minutes = diffInMinutes % 60
			return `${hours}h ${minutes}m`
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			{/* Toast Notification */}
			{showToast && (
				<div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
					{sessionStatus === 'requested' ? '🚗 Your vehicle is being retrieved!' : 
					 isValidated && !showReportModal ? '✅ Parking validated successfully!' : 
					 '📨 Issue reported successfully! We\'ll contact you shortly.'}
				</div>
			)}
			
			<main className="max-w-2xl mx-auto p-4 sm:p-6">
				{/* Back Button */}
				<div className="mb-6">
					<Link href="/">
						<Button variant="outline" className="mb-4">
							← Back to Search
						</Button>
					</Link>
				</div>

				{/* Guest Access Banner */}
				<Card className="mb-6 bg-blue-50 border-blue-200">
					<CardContent className="p-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center space-x-2 mb-2">
									<span className="text-blue-600">👤</span>
									<span className="text-sm font-medium text-blue-900">Guest Access</span>
									<span className="text-blue-500 text-xs">ℹ️</span>
								</div>
								<p className="text-sm text-blue-800">
									You're viewing as a guest. To access past sessions, receipts, and manage your account, please log in.
								</p>
							</div>
							<Link href="/guest/login">
								<Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700">
									Log In
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* ACTION-FIRST TOP SECTION */}
				<Card className="mb-6">
					<CardContent className="p-6">
						{/* Vehicle Header */}
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
									{session.licensePlate}
								</h1>
								<p className="text-lg text-gray-600">
									{session.carMake} {session.carModel}
								</p>
							</div>
							<div className="relative flex items-center space-x-2 status-tooltip-container">
								<Badge className={`text-sm px-3 py-2 transition-all duration-300 ${STATUS_COLORS[sessionStatus as keyof typeof STATUS_COLORS]}`}>
									{getStatusMessage(sessionStatus)}
								</Badge>
								<button
									onClick={() => setShowStatusTooltip(!showStatusTooltip)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									ℹ️
								</button>
								{showStatusTooltip && (
									<div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-700 z-10">
										{getStatusExplanation(sessionStatus)}
										<div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
									</div>
								)}
							</div>
						</div>

						{/* Quick Stats Row */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="text-center p-3 bg-blue-50 rounded-lg">
								<p className="text-xs text-gray-600 mb-1">Parking Duration</p>
								<p className="text-xl font-bold text-blue-600">⏳ {getParkingDuration()}</p>
							</div>
							<div className="text-center p-3 bg-green-50 rounded-lg relative validation-tooltip-container">
								<p className="text-xs text-gray-600 mb-1">Validation Status</p>
								{isValidated ? (
									<div className="flex items-center justify-center space-x-1">
										<p className="text-sm font-medium text-green-600">
											✅ {validatedAt?.toLocaleTimeString()}
										</p>
										<button
											onClick={() => setShowValidationTooltip(!showValidationTooltip)}
											className="text-gray-400 hover:text-gray-600 transition-colors text-xs"
										>
											ℹ️
										</button>
									</div>
								) : (
									<p className="text-sm font-medium text-orange-600">
										❌ Not Validated
									</p>
								)}
								{showValidationTooltip && (
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 z-10">
										Your parking has been validated. No charges will apply if you leave within the time limit.
										<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
									</div>
								)}
							</div>
						</div>

						{/* Primary Action Buttons */}
						<div className="space-y-3">
							{/* Request My Car Button - Only show when car status is "parked" */}
							{sessionStatus === 'parked' && (
								<Button 
									className="w-full h-12 text-lg"
									onClick={requestCar}
									disabled={isRequestDisabled}
								>
									🚗 Request My Car
								</Button>
							)}
							
							{/* Vehicle Being Retrieved - Show when status is "requested" or "retrieving" */}
							{(sessionStatus === 'requested' || sessionStatus === 'retrieving') && (
								<div className="space-y-3">
									<Button className="w-full h-12 text-lg" disabled>
										🔄 Vehicle Being Retrieved...
									</Button>
									<div className="text-center p-3 bg-blue-50 rounded-lg">
										<p className="text-sm text-gray-600 mb-1">Estimated Return</p>
										<div className="flex items-center justify-center space-x-2">
											<span className="text-lg font-bold text-blue-600">
												🚗 ~{Math.ceil(countdown / 60)} min
											</span>
											{getEstimatedReturnTime() && (
												<span className="text-sm text-gray-500">
													({getEstimatedReturnTime()})
												</span>
											)}
										</div>
										{countdown > 0 && (
											<p className="text-xs text-gray-500 mt-1">
												{formatCountdown(countdown)} remaining
											</p>
										)}
									</div>
								</div>
							)}

							{/* Ready for Pickup */}
							{sessionStatus === 'ready' && (
								<Link href="/guest/session-complete">
									<Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
										✅ I'm Here - Get My Car
									</Button>
								</Link>
							)}

							{/* Validate Parking Button - Only show when validation status is "not validated" */}
							{!isValidated && (
								<div className="space-y-3">
									{!showValidationInput ? (
										<Button 
											variant="outline" 
											className="w-full h-12 text-lg"
											onClick={() => setShowValidationInput(true)}
										>
											🎫 Validate Parking
										</Button>
									) : (
										<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
											<p className="text-sm text-gray-600 text-center">
												Enter your validation code:
											</p>
											<div className="flex space-x-2">
												<input
													type="text"
													placeholder="Validation code"
													value={validationCode}
													onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
													className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													maxLength={20}
												/>
												<Button onClick={validateParking}>
													Apply
												</Button>
											</div>
											<div className="flex space-x-2">
												<Button 
													variant="outline" 
													size="sm" 
													className="flex-1"
													onClick={() => setValidationCode('SUNSET10')}
												>
													SUNSET10
												</Button>
												<Button 
													variant="outline" 
													size="sm" 
													className="flex-1"
													onClick={() => setValidationCode('MALL2025')}
												>
													MALL2025
												</Button>
											</div>
											<Button 
												variant="ghost" 
												size="sm" 
												className="w-full"
												onClick={() => {
													setShowValidationInput(false)
													setValidationCode('')
												}}
											>
												Cancel
											</Button>
										</div>
									)}
								</div>
							)}


						</div>


					</CardContent>
				</Card>

				{/* COLLAPSIBLE DETAILS CARD */}
				<Card>
					<CardHeader 
						className="cursor-pointer"
						onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
					>
						<CardTitle className="flex justify-between items-center">
							<span>Vehicle & Session Details</span>
							<span className={`transition-transform duration-200 ${isDetailsExpanded ? 'rotate-180' : ''}`}>
								⌄
							</span>
						</CardTitle>
					</CardHeader>
					
					{isDetailsExpanded && (
						<CardContent className="pt-0">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{/* Vehicle Information */}
								<div>
									<h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
										Vehicle Information
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600">Make/Model</span>
											<span className="font-medium">{session.carMake} {session.carModel}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Color</span>
											<span className="font-medium">{session.carColor}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">License Plate</span>
											<span className="font-mono font-medium">{session.licensePlate}</span>
										</div>
										{session.locationSlot && (
											<div className="flex justify-between">
												<span className="text-gray-600">Parking Location</span>
												<span className="font-medium">{session.locationSlot}</span>
											</div>
										)}
									</div>
								</div>

								{/* Session Information */}
								<div>
									<h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
										Session Information
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600">Guest Name</span>
											<span className="font-medium">{session.guestName}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Drop-off Time</span>
											<span className="font-medium">{session.dropOffTime.toLocaleTimeString()}</span>
										</div>
										{validatedAt && (
											<div className="flex justify-between">
												<span className="text-gray-600">Validated At</span>
												<span className="font-medium text-green-600">{validatedAt.toLocaleTimeString()}</span>
											</div>
										)}
										{valet && (
											<div className="flex justify-between">
												<span className="text-gray-600">Assigned Valet</span>
												<span className="font-medium">{valet.name}</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Contact Actions */}
							<div className="mt-6 pt-4 border-t border-gray-200">
								<div className="flex flex-col sm:flex-row gap-3">
									<Button variant="outline" className="flex-1">
										📞 Contact Valet
									</Button>
									<Button variant="outline" className="flex-1">
										💬 Send Message
									</Button>
								</div>
							</div>

							{/* Limited Access Notice */}
							<div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
								<div className="flex items-start space-x-2">
									<span className="text-gray-400 text-sm">🔒</span>
									<div className="flex-1">
										<p className="text-xs font-medium text-gray-600 mb-1">
											Limited Guest Access
										</p>
										<p className="text-xs text-gray-500 mb-2">
											With an account, you'd also have access to:
										</p>
										<ul className="text-xs text-gray-500 space-y-1">
											<li>• Session history & digital receipts</li>
											<li>• Saved vehicles & payment methods</li>
											<li>• Faster future bookings</li>
											<li>• Loyalty rewards & preferences</li>
										</ul>
									</div>
								</div>
							</div>
						</CardContent>
					)}
				</Card>

				{/* Always Visible Report Issue Section */}
				<Card className="mt-6">
					<CardContent className="p-4">
						<div className="text-center">
							<p className="text-sm text-gray-600 mb-3">
								Need assistance or experiencing an issue?
							</p>
							<Button 
								variant="outline" 
								onClick={handleReportIssue}
								className="w-full sm:w-auto"
							>
								📋 Report Issue
							</Button>
						</div>
					</CardContent>
				</Card>


			</main>

			{/* Report Issue Modal */}
			{showReportModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full">
						<div className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Report an Issue
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Let us know what's wrong and we'll help resolve it quickly.
							</p>
							<div className="space-y-3">
								<button
									onClick={() => submitReport('Vehicle taking too long to retrieve')}
									className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<div className="font-medium text-gray-900">⏰ Taking too long</div>
									<div className="text-sm text-gray-600">Vehicle retrieval is delayed</div>
								</button>
								<button
									onClick={() => submitReport('Cannot locate my vehicle')}
									className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<div className="font-medium text-gray-900">🔍 Can't find vehicle</div>
									<div className="text-sm text-gray-600">Vehicle not at expected location</div>
								</button>
								<button
									onClick={() => submitReport('Emergency - need immediate assistance')}
									className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
								>
									<div className="font-medium text-red-900">🚨 Emergency</div>
									<div className="text-sm text-red-600">Need immediate assistance</div>
								</button>
								<button
									onClick={() => submitReport('Other issue - please contact me')}
									className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<div className="font-medium text-gray-900">💬 Other issue</div>
									<div className="text-sm text-gray-600">Something else needs attention</div>
								</button>
							</div>
							<div className="flex space-x-3 mt-6">
								<Button 
									variant="outline" 
									onClick={() => setShowReportModal(false)}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button 
									onClick={() => window.location.href = 'tel:+1-555-0199'}
									className="flex-1"
								>
									📞 Call Now
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
} 