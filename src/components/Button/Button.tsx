import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const Variants = cva(
  'flex items-center justify-center relative px-4 uppercase rounded-2xl font-display border-b-[4px] active:border-none active:translate-y-[4px] hover:brightness-110 transition-colors',
  {
    variants: {
      theme: {
        primary: 'bg-primary-default border-primary-shadow text-white',
        premium: 'bg-premium-default border-premium-shadow text-white',
        white: 'bg-white text-primary-default border-slate-300'
      },
      size: {
        default: 'h-[50px]',
        lg: 'h-[54px]'
      }
    },
    defaultVariants: {
      theme: 'primary',
      size: 'default'
    }
  }
)

type ButtonProps = {
  children: string
  text?: string

  // button height in pixels
  height?: number

  // button width in pixels
  width?: number

  className?: string
} & VariantProps<typeof Variants>

export const Button = ({
  children,
  height,
  width,
  text,
  className,
  theme,
  size
}: ButtonProps) => {
  return (
    <button
      className={cn(Variants({ theme, size }), className)}
      style={{
        height: height && `${height}px`,
        width: width && `${width}px`
      }}>
      <span>{text ? text : children}</span>
    </button>
  )
}
