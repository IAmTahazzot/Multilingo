import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { UserNavigation } from '@/components/Navigation/UserNavigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='pl-64'>
      <BaseNavigation>
        <UserNavigation />
      </BaseNavigation>
      <div className='m-6'>{children}</div>
    </div>
  )
}