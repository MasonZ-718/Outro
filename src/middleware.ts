import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from './lib/types'

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
	'/guest': ['guest'],
	'/valet': ['valet'],
	'/manager': ['manager'], 
	'/admin': ['admin'],
}

// Define public routes that don't require authentication
const PUBLIC_GUEST_ROUTES = [
	'/guest/session/',
	'/guest/login',
	'/guest/session-complete'
]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	
	// Get user data from cookies (in a real app, this would be a JWT token)
	const userData = request.cookies.get('user')?.value
	
	// If no user data and trying to access protected route, redirect to login
	if (!userData && isProtectedRoute(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}
	
	// If user data exists, parse and check role permissions
	if (userData) {
		try {
			const user = JSON.parse(userData)
			const userRole = user.role as UserRole
			
			// Check if user has permission to access this route
			if (isProtectedRoute(pathname) && !hasRoleAccess(pathname, userRole)) {
				// Redirect to appropriate dashboard based on role
				const redirectUrl = getRoleBasedRedirect(userRole)
				return NextResponse.redirect(new URL(redirectUrl, request.url))
			}
		} catch (error) {
			// Invalid user data, redirect to login
			return NextResponse.redirect(new URL('/', request.url))
		}
	}
	
	return NextResponse.next()
}

function isProtectedRoute(pathname: string): boolean {
	// First check if it's a public guest route
	const isPublicGuestRoute = PUBLIC_GUEST_ROUTES.some(route => 
		pathname.startsWith(route))
	
	if (isPublicGuestRoute) {
		return false
	}
	
	// Then check if it's a protected route
	return Object.keys(PROTECTED_ROUTES).some(route => 
		pathname.startsWith(route))
}

function hasRoleAccess(pathname: string, userRole: UserRole): boolean {
	const matchingRoute = Object.keys(PROTECTED_ROUTES).find(route => 
		pathname.startsWith(route))
	
	if (!matchingRoute) return true
	
	return PROTECTED_ROUTES[matchingRoute].includes(userRole)
}

function getRoleBasedRedirect(role: UserRole): string {
	switch (role) {
		case 'guest':
			return '/guest'
		case 'valet':
			return '/valet'
		case 'manager':
			return '/manager'
		case 'admin':
			return '/admin'
		default:
			return '/'
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
} 