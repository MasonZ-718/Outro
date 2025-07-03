import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SessionCompletePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<main className="max-w-2xl mx-auto p-4 sm:p-6 pt-16">
				{/* Header Section */}
				<div className="text-center mb-8">
					<div className="mb-6">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
							<span className="text-4xl">🎉</span>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-3">
							Thanks for Using Our Valet!
						</h1>
						<p className="text-lg text-gray-600">
							We hope you enjoyed our service. Your car has been safely returned.
						</p>
					</div>
				</div>

				{/* Service Summary */}
				<Card className="mb-8 bg-white border-green-200">
					<CardContent className="p-6">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Your Valet Service Summary
							</h3>
							<div className="grid grid-cols-2 gap-6 text-sm">
								<div>
									<div className="text-gray-500">Service Status</div>
									<div className="font-medium text-green-600">✅ Completed</div>
								</div>
								<div>
									<div className="text-gray-500">Total Time</div>
									<div className="font-medium">2h 45m</div>
								</div>
							</div>
							<div className="mt-4 p-3 bg-green-50 rounded-lg">
								<p className="text-sm text-green-800">
									🚗 Vehicle safely returned to pickup location
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Conversion Section */}
				<Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
					<CardContent className="p-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								Make Valet Even Easier Next Time
							</h2>
							<p className="text-gray-600 mb-6">
								Join thousands of guests who've upgraded to faster, smarter valet service
							</p>
							
							{/* Benefits Grid */}
							<div className="grid grid-cols-2 gap-6 mb-6">
								<div className="text-center">
									<div className="text-blue-600 text-3xl mb-2">⚡</div>
									<div className="font-semibold text-gray-900">Instant Access</div>
									<div className="text-sm text-gray-600">No more license plate entry</div>
								</div>
								<div className="text-center">
									<div className="text-purple-600 text-3xl mb-2">💾</div>
									<div className="font-semibold text-gray-900">Saved Info</div>
									<div className="text-sm text-gray-600">Cars & payment methods</div>
								</div>
								<div className="text-center">
									<div className="text-green-600 text-3xl mb-2">📱</div>
									<div className="font-semibold text-gray-900">Push Notifications</div>
									<div className="text-sm text-gray-600">Real-time car status updates</div>
								</div>
								<div className="text-center">
									<div className="text-orange-600 text-3xl mb-2">📋</div>
									<div className="font-semibold text-gray-900">Digital Receipts</div>
									<div className="text-sm text-gray-600">History & expense tracking</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/guest/login?signup=true" className="flex-1">
									<Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
										Create Free Account
									</Button>
								</Link>
								<Link href="/guest/login" className="flex-1">
									<Button variant="outline" className="w-full h-12 text-lg border-blue-300 text-blue-700 hover:bg-blue-50">
										Log In
									</Button>
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Alternative Actions */}
				<div className="text-center space-y-4">
					<div className="text-sm text-gray-500">
						Not ready to sign up? No problem!
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<Link href="/" className="flex-1">
							<Button variant="outline" className="w-full">
								← Return to Homepage
							</Button>
						</Link>
						<Link href="/guest/feedback" className="flex-1">
							<Button variant="outline" className="w-full">
								📝 Leave Feedback
							</Button>
						</Link>
					</div>
				</div>

				{/* Footer Note */}
				<div className="mt-8 text-center">
					<p className="text-xs text-gray-500">
						Creating an account is free and takes less than 30 seconds
					</p>
				</div>
			</main>
		</div>
	)
} 