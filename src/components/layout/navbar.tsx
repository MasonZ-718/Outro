'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/lib/auth'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import type { User } from '@/lib/types'
import { useEffect, useState } from 'react'

interface NavigationItem {
	href: string
	label: string
}

export function Navbar() {
	const [user, setUser] = useState<User | null>(null)
	const router = useRouter()

	useEffect(() => {
		const currentUser = auth.getCurrentUser()
		setUser(currentUser)
	}, [])

	const handleLogout = () => {
		auth.logout()
		router.push('/')
	}

	if (!user) {
		return null
	}

	const navigationItems: NavigationItem[] = NAVIGATION_ITEMS[user.role] || []

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo and Title */}
					<div className="flex items-center space-x-4">
						<Link href="/" className="text-xl font-bold text-gray-900">
							ValetPro
						</Link>
						<Badge variant="secondary">
							{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
						</Badge>
					</div>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						{navigationItems.map((item: NavigationItem) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* User Info and Logout */}
					<div className="flex items-center space-x-4">
						<div className="hidden md:block text-sm text-gray-700">
							{user.name}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleLogout}
						>
							Logout
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden pb-4">
					<div className="flex flex-wrap gap-2">
						{navigationItems.map((item: NavigationItem) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	)
} 