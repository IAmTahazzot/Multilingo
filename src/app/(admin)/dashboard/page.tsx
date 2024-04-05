'use client'

import { Button } from '@/components/Button/Button'
import { Card } from '@/components/Card/Card'
import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Page() {
  const { user, isLoaded, isSignedIn } = useUser()
  const path = usePathname()

  return (
    <div>
      <Card theme={'premium'}>
        Dashboard Overview
      </Card>
    </div>
  )
}
