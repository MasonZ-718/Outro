'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'

function GuestLoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSignupMode, setIsSignupMode] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const signup = searchParams.get('signup')
		setIsSignupMode(signup === 'true')
	}, [searchParams])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!email.trim() || !password.trim()) {
			alert(`Please enter both email and password`)
			return
		}

		if (isSignupMode && password !== confirmPassword) {
			alert('Passwords do not match')
			return
		}

		setIsLoading(true)
		try {
			if (isSignupMode) {
				// In a real app, this would be a signup API call
				alert('Account created successfully! Please log in.')
				setIsSignupMode(false)
				setConfirmPassword('')
			} else {
				await auth.login(email, password)
				router.push('/guest')
			}
		} catch (error) {
			console.error('Auth error:', error)
			const errorMessage = error instanceof Error ? error.message : `${isSignupMode ? 'Signup' : 'Login'} failed. Please try again.`
			alert(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="flex flex-col items-center justify-center min-h-screen p-6">
				<div className="text-center mb-8">
					<Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
						← Back to Homepage
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{isSignupMode ? 'Create Your Account' : 'Guest Login'}
					</h1>
					<p className="text-gray-600">
						{isSignupMode 
							? 'Join thousands of guests enjoying faster, smarter valet service'
							: 'Access your account to view session history and manage preferences'
						}
					</p>
				</div>

				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>{isSignupMode ? 'Create Account' : 'Sign In'}</CardTitle>
						<CardDescription>
							{isSignupMode 
								? 'Create your account to access enhanced valet features'
								: 'Enter your credentials to access your guest account'
							}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>

							{isSignupMode && (
								<div className="space-y-2">
									<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
										Confirm Password
									</label>
									<input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="Confirm your password"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>
							)}

							<Button 
								type="submit" 
								className="w-full"
								disabled={isLoading}
							>
								{isLoading 
									? (isSignupMode ? 'Creating Account...' : 'Signing In...') 
									: (isSignupMode ? 'Create Account' : 'Sign In')
								}
							</Button>
						</form>

						{isSignupMode && (
							<div className="mt-6 pt-4 border-t">
								<h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
									What you'll get with an account:
								</h4>
								<div className="space-y-2">
									<div className="flex items-center space-x-3 text-sm text-gray-600">
										<span className="text-green-600">⚡</span>
										<span>Instant access - no more license plate entry</span>
									</div>
									<div className="flex items-center space-x-3 text-sm text-gray-600">
										<span className="text-blue-600">📱</span>
										<span>Mobile push notifications for car status</span>
									</div>
									<div className="flex items-center space-x-3 text-sm text-gray-600">
										<span className="text-purple-600">💾</span>
										<span>Saved vehicles and payment methods</span>
									</div>
									<div className="flex items-center space-x-3 text-sm text-gray-600">
										<span className="text-orange-600">🎯</span>
										<span>Session history and digital receipts</span>
									</div>
								</div>
							</div>
						)}

						{!isSignupMode && (
							<div className="mt-6 pt-4 border-t">
								<div className="text-center text-sm text-gray-600">
									<p className="mb-2">Demo Credentials:</p>
									<p><strong>Email:</strong> john.doe@example.com</p>
									<p><strong>Password:</strong> guest123</p>
								</div>
							</div>
						)}

						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								{isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
								<button 
									type="button"
									onClick={() => {
										setIsSignupMode(!isSignupMode)
										setConfirmPassword('')
									}}
									className="text-blue-600 hover:text-blue-800"
								>
									{isSignupMode ? 'Sign in here' : 'Create one here'}
								</button>
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="mt-6 text-center">
					<Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
						Staff/Manager Login
					</Link>
				</div>
			</div>
		</div>
	)
}

export default function GuestLoginPage() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">Loading...</div>}>
			<GuestLoginForm />
		</Suspense>
	)
} 