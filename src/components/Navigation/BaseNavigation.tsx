import { cn } from '@/lib/utils'
import Link from 'next/link'

type BaseNavigationProps = {
  children: React.ReactNode
  className?: string
}

export const BaseNavigation = ({
  children,
  className
}: BaseNavigationProps) => {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full px-4 border-r-2 border-neutral-200 bg-white z-10',
        'w-64', // default width
        className
      )}>
      <div className='py-6 px-4'>
        <Link
          href='/'
          className='text-3xl font-display text-primary-default tracking-tight'>
          Multilingo
        </Link>
      </div>
      <div>{children}</div>
    </aside>
  )
}
