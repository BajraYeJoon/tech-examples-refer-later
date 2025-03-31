import React from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
  className?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  className
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const displayValue = hoverValue ?? value

  return (
    <div 
      className={cn(
        "flex items-center gap-1",
        className
      )}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1
        const isActive = starValue <= displayValue
        const isHalf = !Number.isInteger(displayValue) && 
          Math.ceil(displayValue) === starValue

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "text-2xl transition-colors",
              isActive ? "text-yellow-400" : "text-gray-300",
              "hover:text-yellow-400"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
          >
            {isHalf ? <StarHalf /> : <Star />}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating 