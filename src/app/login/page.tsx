'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/lib/auth'
import { UserRole } from '@/lib/types'
import Link from 'next/link'

export default function LoginPage() {
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const roles = [
		{
			role: 'guest' as UserRole,
			title: 'Registered Guest',
			description: 'Access your account to view session history and manage preferences',
			email: 'john.doe@example.com',
			password: 'guest123',
			features: ['Session History', 'Saved Preferences', 'Quick Access', 'Account Settings']
		},
		{
			role: 'valet' as UserRole,
			title: 'Valet Operator',
			description: 'Handle vehicle parking, retrieval, and customer service tasks',
			email: 'mike.wilson@company.com',
			password: 'valet123',
			features: ['Task Management', 'Session Handling', 'Customer Service', 'Vehicle Operations']
		},
		{
			role: 'manager' as UserRole,
			title: 'Valet Manager',
			description: 'Oversee operations, assign tasks, and manage staff',
			email: 'alex.manager@company.com',
			password: 'manager123',
			features: ['Staff Management', 'Task Assignment', 'Performance Analytics', 'Venue Settings']
		},
		{
			role: 'admin' as UserRole,
			title: 'Platform Admin',
			description: 'Platform-wide analytics, user management, and system configuration',
			email: 'admin@company.com',
			password: 'admin123',
			features: ['User Management', 'Venue Management', 'System Analytics', 'Audit Logs']
		}
	]

	const handleLogin = async (role: UserRole, email: string, password: string) => {
		console.log('handleLogin called with:', { role, email, password })
		setIsLoading(true)
		try {
			console.log('Attempting to login...')
			await auth.login(email, password)
			console.log('Login successful, redirecting...')
			// Redirect based on role
			const roleRoutes: Record<UserRole, string> = {
				guest: '/guest',
				valet: '/valet',
				manager: '/manager',
				admin: '/admin'
			}
			console.log('Redirecting to:', roleRoutes[role])
			router.push(roleRoutes[role])
		} catch (error) {
			console.error('Login error:', error)
			const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
			alert(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const getRoleBadgeColor = (role: UserRole) => {
		const colors: Record<UserRole, string> = {
			guest: 'bg-blue-100 text-blue-800',
			valet: 'bg-green-100 text-green-800',
			manager: 'bg-orange-100 text-orange-800',
			admin: 'bg-purple-100 text-purple-800'
		}
		return colors[role]
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="flex flex-col items-center justify-center min-h-screen p-6">
				<div className="text-center mb-8">
					<Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
						← Back to Homepage
					</Link>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Login to Valet System
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl">
						Choose your role below to access the appropriate dashboard and features.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
					{roles.map((roleData) => (
						<Card key={roleData.role} className="relative overflow-hidden hover:shadow-lg transition-shadow">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between mb-2">
									<CardTitle className="text-lg">{roleData.title}</CardTitle>
									<div className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(roleData.role)}`}>
										{roleData.role}
									</div>
								</div>
								<CardDescription className="text-sm">
									{roleData.description}
								</CardDescription>
							</CardHeader>
							
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-sm text-gray-900 mb-2">Key Features:</h4>
										<ul className="space-y-1">
											{roleData.features.map((feature, index) => (
												<li key={index} className="text-xs text-gray-600 flex items-center">
													<span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
													{feature}
												</li>
											))}
										</ul>
									</div>
									
									<div className="pt-2 border-t">
										<p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
										<div className="text-xs text-gray-600 space-y-1">
											<p><strong>Email:</strong> {roleData.email}</p>
											<p><strong>Password:</strong> {roleData.password}</p>
										</div>
									</div>

									<Button 
										className="w-full mt-4" 
										onClick={() => handleLogin(roleData.role, roleData.email, roleData.password)}
										disabled={isLoading}
									>
										{isLoading ? 'Signing In...' : `Sign In as ${roleData.title}`}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mt-12 text-center max-w-4xl">
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-3">
							About This Demo
						</h2>
						<p className="text-sm text-gray-600 mb-4">
							This is a full-featured valet management system demo showcasing role-based access control, 
							comprehensive dashboards, and modern web development practices. Built with Next.js 14, 
							TypeScript, and Tailwind CSS.
						</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
							<div>
								<strong>Frontend:</strong> Next.js 14, React
							</div>
							<div>
								<strong>Styling:</strong> Tailwind CSS, Radix UI
							</div>
							<div>
								<strong>Type Safety:</strong> TypeScript
							</div>
							<div>
								<strong>Architecture:</strong> Component-driven
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 