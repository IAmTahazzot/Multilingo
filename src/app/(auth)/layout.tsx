import Image from 'next/image'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen grid place-content-center lg:place-content-stretch lg:grid-cols-[30vw_1fr]'>
      <div className='bg-green-100 hidden lg:block'>
        <div className='h-full flex flex-col items-center justify-center gap-4'>
          <Image
            src='/bird.svg'
            width={120}
            height={120}
            alt='brand'
          />
          <h1 className='text-xl'>
            Login to <strong>Multilingo</strong>
          </h1>
        </div>
      </div>
      <div className='self-center justify-place-center'>{children}</div>
      <a
        target='_blank'
        href='https://clerk.com/'
        className='fixed bottom-4 right-2 text-xs text-neutral-400'>
        Thanks to clerk auth
      </a>
    </div>
  )
}
