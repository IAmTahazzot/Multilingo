import { cn } from '@/lib/utils'

type InputProps = {
  placeholder?: string
  className?: string
}

export const Input = ({ placeholder, className }: InputProps) => {
  return (
    <input
      placeholder={placeholder && placeholder}
      className={cn(
        'h-12 min-w-[300px] pl-3 py-2 pr-2 text-[20px] border-2 border-slate-300 outline-none focus-within:border-[var(--color-secondary)] rounded-xl caret-[var(--color-secondary)] font-body text-neutral-700',
        className
      )}
    />
  )
}
