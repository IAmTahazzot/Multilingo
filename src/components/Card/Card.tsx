import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const Variants = cva('rounded-xl p-6', {
  variants: {
    theme: {
      primary: 'bg-primary-default text-white',
      secondary: 'bg-secondary-default text-white',
      tertiary: 'bg-tertiary-default text-white',
      success: 'bg-success-default text-white',
      premium: 'bg-premium-default text-white',
      danger: 'bg-red-500 text-white',
      smallCard:
        'border-x-2 border-b-4 border-t-2 border-neutral-200 hover:bg-neutral-100 transition-colors duration-200',
      default: 'border-2 border-neutral-200 bg-white',
      disabled: 'bg-neutral-100 text-neutral-400'
    }
  },
  defaultVariants: {
    theme: 'primary'
  }
})

type CardProps = {
  children?: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
} & VariantProps<typeof Variants>

export const Card = ({ children, theme, className, onClick }: CardProps) => {
  return (
    <div
      className={cn(Variants({ theme }), className)}
      onClick={onClick}>
      {children}
    </div>
  )
}
