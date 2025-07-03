'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
	ErrorBoundaryState
> {
	constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> }) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by ErrorBoundary:', error, errorInfo)
		// In a real app, send error to logging service
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return (
					<this.props.fallback 
						error={this.state.error!} 
						reset={() => this.setState({ hasError: false, error: undefined })} 
					/>
				)
			}

			return <DefaultErrorFallback error={this.state.error!} reset={() => this.setState({ hasError: false, error: undefined })} />
		}

		return this.props.children
	}
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-red-600">Something went wrong</CardTitle>
					<CardDescription>
						An unexpected error occurred. Please try refreshing the page.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<details className="text-sm text-gray-600">
						<summary className="cursor-pointer font-medium">Error details</summary>
						<pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
							{error.message}
						</pre>
					</details>
					<div className="flex gap-2">
						<Button onClick={reset} variant="outline">
							Try again
						</Button>
						<Button onClick={() => window.location.reload()}>
							Refresh page
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
} 