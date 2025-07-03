import { cn } from '@/lib/utils'
import { Badge } from './badge'

interface StatusIndicatorProps {
	status: string
	variant?: 'default' | 'secondary' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

export function StatusIndicator({ status, variant = 'default', size = 'md', className }: StatusIndicatorProps) {
	const getStatusColor = (status: string) => {
		const statusLower = status.toLowerCase()
		
		// Status color mapping
		if (statusLower.includes('active') || statusLower.includes('completed') || statusLower.includes('success')) {
			return 'bg-green-100 text-green-800 border-green-200'
		}
		if (statusLower.includes('pending') || statusLower.includes('waiting') || statusLower.includes('assigned')) {
			return 'bg-yellow-100 text-yellow-800 border-yellow-200'
		}
		if (statusLower.includes('in-progress') || statusLower.includes('ongoing') || statusLower.includes('processing')) {
			return 'bg-blue-100 text-blue-800 border-blue-200'
		}
		if (statusLower.includes('failed') || statusLower.includes('error') || statusLower.includes('rejected')) {
			return 'bg-red-100 text-red-800 border-red-200'
		}
		if (statusLower.includes('cancelled') || statusLower.includes('paused') || statusLower.includes('inactive')) {
			return 'bg-gray-100 text-gray-800 border-gray-200'
		}
		
		// Default
		return 'bg-gray-100 text-gray-800 border-gray-200'
	}

	const getSizeClass = (size: string) => {
		switch (size) {
			case 'sm':
				return 'text-xs px-2 py-1'
			case 'lg':
				return 'text-sm px-3 py-2'
			default:
				return 'text-xs px-2.5 py-1.5'
		}
	}

	return (
		<div className={cn(
			'inline-flex items-center gap-1.5 rounded-full border font-medium',
			getStatusColor(status),
			getSizeClass(size),
			className
		)}>
			<div className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
			<span className="capitalize">{status.replace(/-/g, ' ')}</span>
		</div>
	)
}

export function StatusDot({ status, className }: { status: string; className?: string }) {
	const getStatusColor = (status: string) => {
		const statusLower = status.toLowerCase()
		
		if (statusLower.includes('active') || statusLower.includes('completed')) {
			return 'bg-green-500'
		}
		if (statusLower.includes('available') || statusLower.includes('pending')) {
			return 'bg-yellow-500'
		}
		if (statusLower.includes('idle') || statusLower.includes('offline')) {
			return 'bg-gray-400'
		}
		if (statusLower.includes('busy') || statusLower.includes('error')) {
			return 'bg-red-500'
		}
		
		return 'bg-blue-500'
	}

	return (
		<div 
			className={cn(
				'w-2 h-2 rounded-full',
				getStatusColor(status),
				className
			)}
		/>
	)
} 