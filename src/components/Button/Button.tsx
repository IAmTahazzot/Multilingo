import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'

const Variants = cva(
  'flex items-center relative px-4 uppercase rounded-2xl font-display border-b-[4px] active:translate-y-[4px] hover:brightness-110 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      theme: {
        default:
          'bg-white border-t border-l border-r border-neutral-200 text-neutral-500 active:border-2 hover:brightness-100 hover:bg-neutral-100 active:bg-neutral-100',
        primary: 'bg-primary-default border-primary-deep text-white active:border-none',
        secondary: 'bg-secondary-default border-secondary-deep text-white active:border-none',
        tertiary: 'bg-tertiary-default border-tertiary-deep text-white active:border-none',
        success: 'bg-success-default border-success-deep text-white active:border-none',
        premium: 'bg-premium-default border-premium-deep text-white active:border-none',
        white: 'bg-white text-primary-default border-slate-300 active:border-none',
        danger: 'bg-red-500 border-red-700 text-white active:border-none',
        outline:
          'border-2 border-[#84d8ff] bg-sky-50 text-sky-500 hover:brightness-100 active:border-2 active:translate-y-0',
        ghost:
          'bg-transparent border-2 border-transparent text-neutral-600 active:translate-y-0 hover:brightness-100 hover:bg-neutral-100',
        disabled: 'bg-neutral-300 text-neutral-600 border-none hover:brightness-100 cursor-not-allowed'
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
  children?: React.ReactNode
  text?: string
  icon?: React.ReactNode
  type?: 'button' | 'link' | 'submit' | 'reset'
  href?: string
  disabled?: boolean
  onClick?: () => void

  // button height in pixels
  height?: number

  // button width in pixels
  width?: number

  className?: string
  style?: React.CSSProperties
} & VariantProps<typeof Variants>

export const Button = ({
  children,
  height,
  width,
  text,
  icon,
  onClick,
  type = 'button',
  href,
  className,
  theme,
  size,
  disabled,
  style
}: ButtonProps) => {
  if (type === 'link') {
    return (
      <Link
        href={href || '#-----------------void-link-is-forbidden-----------------#'}
        className={cn(
          'flex items-center',
          Variants({ theme, size }),
          'rounded-[12px]',
          icon ? 'text-left' : 'justify-center',
          className
        )}
        style={{
          height: height && `${height}px`,
          width: width && `${width}px`,
          ...style
        }}>
        {icon && <div className='w-8 h-8 mr-3 flex items-center'>{icon}</div>}
        {text && <span className={cn(text && 'h-5')}>{text}</span>}
        {children}
      </Link>
    )
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={cn('flex items-center', Variants({ theme, size }), icon ? 'text-left' : 'justify-center', className)}
      style={{
        height: height && `${height}px`,
        width: width && `${width}px`,
        ...style
      }}>
      <div>{icon}</div>
      <span>{text ? text : children ? children : 'Empty button is forbidden'}</span>
    </button>
  )
}
