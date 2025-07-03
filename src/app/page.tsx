'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { findSessionByLicensePlate } from '@/lib/mock-data'

export default function HomePage() {
	const [licensePlate, setLicensePlate] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	// Load saved guest profile on component mount
	React.useEffect(() => {
		const savedProfile = localStorage.getItem('guestProfile')
		if (savedProfile) {
			try {
				const profile = JSON.parse(savedProfile)
				if (profile.licensePlate) {
					setLicensePlate(profile.licensePlate)
				}
				if (profile.phoneNumber) {
					setPhoneNumber(profile.phoneNumber)
				}
			} catch (error) {
				console.error('Error parsing saved guest profile:', error)
			}
		}
	}, [])

	const handleFindMyCar = async () => {
		if (!licensePlate.trim()) {
			showErrorToast('Please enter a license plate')
			return
		}

		setIsLoading(true)
		try {
			// Normalize the license plate
			const normalizedPlate = licensePlate.trim().toUpperCase()
			
			// Simulate API call with a small delay
			await new Promise(resolve => setTimeout(resolve, 500))
			
			// Look up the session
			const session = findSessionByLicensePlate(normalizedPlate)
			
			if (session) {
				// Redirect to the session page
				router.push(`/guest/session/${encodeURIComponent(normalizedPlate)}`)
			} else {
				showErrorToast('No active valet session found for this plate.')
			}
		} catch (error) {
			console.error('Error looking up session:', error)
			showErrorToast('An error occurred while looking up your vehicle.')
		} finally {
			setIsLoading(false)
		}
	}

	const showErrorToast = (message: string) => {
		// Simple alert for now - could be replaced with a proper toast library
		alert(message)
	}

	const showSuccessToast = (message: string) => {
		// Simple alert for now - could be replaced with a proper toast library
		alert(message)
	}

	const handleLinkMyPlate = () => {
		if (!licensePlate.trim() || !phoneNumber.trim()) {
			showErrorToast('Please enter both license plate and phone number')
			return
		}

		try {
			// Save guest profile to localStorage
			const guestProfile = {
				licensePlate: licensePlate.trim().toUpperCase(),
				phoneNumber: phoneNumber.trim(),
				savedAt: new Date().toISOString()
			}
			localStorage.setItem('guestProfile', JSON.stringify(guestProfile))
			
			// Show success toast
			showSuccessToast('Your info is saved for future visits.')
			
			console.log('Guest profile saved:', guestProfile)
		} catch (error) {
			console.error('Error saving guest profile:', error)
			showErrorToast('Failed to save your information. Please try again.')
		}
	}

	const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Convert to uppercase and remove spaces
		const value = e.target.value.toUpperCase().replace(/\s/g, '')
		setLicensePlate(value)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="flex flex-col items-center justify-center min-h-screen p-4">
				{/* Hero Section */}
				<div className="text-center mb-8 max-w-2xl">
					<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
						Fetch Your Vehicle
					</h1>
					<p className="text-lg sm:text-xl text-gray-600 mb-4">
						Enter your license plate to check session or request return
					</p>
					<div className="text-sm text-gray-500 mb-4">
						<p>Test plates: ABC-1234, XYZ-9876, DEF-5555</p>
					</div>
				</div>

				{/* Main Card */}
				<Card className="w-full max-w-md mx-auto shadow-lg">
					<CardContent className="p-6 space-y-6">
						{/* License Plate Input */}
						<div className="space-y-2">
							<label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
								License Plate
							</label>
							<input
								id="licensePlate"
								type="text"
								value={licensePlate}
								onChange={handleLicensePlateChange}
								placeholder="Enter your license plate"
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono uppercase"
								maxLength={10}
							/>
						</div>

						{/* Primary Button */}
						<Button 
							onClick={handleFindMyCar}
							className="w-full py-3 text-lg font-semibold"
							disabled={!licensePlate.trim() || isLoading}
						>
							{isLoading ? 'Looking up...' : 'Find My Car'}
						</Button>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Optional</span>
							</div>
						</div>

						{/* Optional Section */}
						<div className="space-y-4">
							<p className="text-sm text-gray-600 text-center">
								Want updates and receipts?
							</p>
							
							<div className="space-y-2">
								<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
									Phone Number
								</label>
								<input
									id="phoneNumber"
									type="tel"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder="Optional"
									className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<Button 
								onClick={handleLinkMyPlate}
								variant="outline"
								className="w-full py-3"
								disabled={!licensePlate.trim() || !phoneNumber.trim()}
							>
								Link My Plate
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Login Links */}
				<div className="mt-8 text-center space-y-4">
					<Link href="/guest/login">
						<Button variant="outline" className="px-6 py-2">
							Log in as Registered Guest
						</Button>
					</Link>
				</div>
			</div>

			{/* Footer */}
			<footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
				<Link 
					href="/login" 
					className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
				>
					Staff/Manager Login
				</Link>
			</footer>
		</div>
	)
} 