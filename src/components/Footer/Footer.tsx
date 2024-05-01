import Link from 'next/link'

export const Footer = () => {
  return (
    <div>
      <div className='flex items-center justify-center flex-wrap gap-4 p-4'>
        <Link href='/about' className='text-black/40 font-display uppercase text-sm'>About</Link>
        <Link href='https://tahazzot.me/contact' className='text-black/40 font-display uppercase text-sm'>Contact</Link>
        <Link href='/terms' className='text-black/40 font-display uppercase text-sm'>Terms</Link>
        <Link href='/privacy' className='text-black/40 font-display uppercase text-sm'>Privacy & Policy</Link>
        <Link href='https://tahazzot.me' className='text-black/40 font-display uppercase text-sm'>Portfolio</Link>
        <Link href='https://tahazzot.me/about' className='text-black/40 font-display uppercase text-sm'>About me</Link>
      </div>
    </div>
  )
}
