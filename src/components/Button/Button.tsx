import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'

const Variants = cva(
  'flex items-center relative px-4 uppercase rounded-2xl font-display border-b-[4px] active:border-none active:translate-y-[4px] hover:brightness-110 transition-colors uppercase',
  {
    variants: {
      theme: {
        primary: 'bg-primary-default border-primary-deep text-white',
        secondary: 'bg-secondary-default border-secondary-deep text-white',
        tertiary: 'bg-tertiary-default border-tertiary-deep text-white',
        success: 'bg-success-default border-success-deep text-white',
        premium: 'bg-premium-default border-premium-deep text-white',
        white: 'bg-white text-primary-default border-slate-300',
        outline:
          'border-2 border-[#84d8ff] bg-sky-50 text-sky-400 hover:brightness-100 active:border-2 active:translate-y-0',
        ghost:
          'bg-transparent text-neutral-600 border-b-0 active:translate-y-0 hover:brightness-100 hover:bg-neutral-100'
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
  children?: string
  text?: string
  icon?: React.ReactNode
  type?: 'button' | 'link' | 'submit' | 'reset'
  href?: string

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
  icon,
  type = 'button',
  href,
  className,
  theme,
  size
}: ButtonProps) => {
  if (type === 'link') {
    return (
      <Link
        href={
          href || '#-----------------void-link-is-forbidden-----------------#'
        }
        className={cn(
          'flex items-center',
          Variants({ theme, size }),
          'rounded-[12px]',
          icon ? 'text-left' : 'justify-center',
          className
        )}
        style={{
          height: height && `${height}px`,
          width: width && `${width}px`
        }}>
        {icon && <div className='w-8 h-8 mr-3 flex items-center'>{icon}</div>}
        <span>
          {text ? text : children ? children : 'Empty button is forbidden'}
        </span>
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={cn('flex items-center', Variants({ theme, size }), className)}
      style={{
        height: height && `${height}px`,
        width: width && `${width}px`
      }}>
      <div>{icon}</div>
      <span>
        {text ? text : children ? children : 'Empty button is forbidden'}
      </span>
    </button>
  )
}
