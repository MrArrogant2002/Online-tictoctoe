interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6'
      case 'lg':
        return 'w-16 h-16'
      default:
        return 'w-10 h-10'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-xl'
      default:
        return 'text-base'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner */}
      <div className={`${getSizeClasses()} animate-spin`}>
        <div className="border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full w-full h-full"></div>
      </div>
      
      {/* Loading Message */}
      <p className={`mt-4 font-medium text-gray-600 dark:text-gray-400 ${getTextSize()}`}>
        {message}
      </p>
      
      {/* Pulsing Dots */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}