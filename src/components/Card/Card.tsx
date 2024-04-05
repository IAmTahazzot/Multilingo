import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const Variants = cva('rounded-xl p-6', {
  variants: {
    theme: {
      primary: 'bg-primary-default text-white',
      secondary: 'bg-secondary-default text-white',
      tertiary: 'bg-tertiary-default text-white',
      success: 'bg-success-default text-white',
      premium: 'bg-premium-default text-white'
    }
  },
  defaultVariants: {
    theme: 'primary'
  }
})

type CardProps = {
  children?: React.ReactNode
} & VariantProps<typeof Variants>

export const Card = ({ children, theme }: CardProps) => {
  return <div className={cn(Variants({ theme }))}>{children}</div>
}
