'use client'

import { Button } from '@/components/Button/Button'
import { useGlobalState } from '@/hooks/useGlobalState'
import { ICONS } from '@/lib/Icons'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { fillHearts } from '@/actions/global'

export default function ShopPage() {
  const { user } = useGlobalState()
  const router = useRouter()

  if (!user) {
    return null
  }

  const requiredDimonds = (5 - user.hearts) * 100 // 100 dimonds per heart

  const fillMyHearts = async () => {
    const userHearts = user.hearts
    const heartsToFill = 5 - userHearts
    const dimondCost = 100 * heartsToFill
    const userDimonds = user.dimond

    if (userDimonds < dimondCost) {
      return toast.error('Insufficient dimonds!')
    }

    try {
      await fillHearts(user.id)
    } catch (e) {
      toast.error(e.message)
    }

    router.refresh()
  }

  return (
    <div>
      {user.tier === 'FREE' && (
        <div
          className='relative p-6 rounded-2xl mt-6'
          style={{
            background:
              'radial-gradient(216% 106% at 6% 3%,rgb(38,246,99,.3) 0,rgb(38,138,255,.3) 52%,rgb(252,85,255,.3) 100%),rgb(0,4,55)'
          }}>
          <div className='absolute top-6 right-6'>{ICONS.premiumText}</div>
          <div className='flex gap-6'>
            <div>{ICONS.premiumBird}</div>
            <p className='text-white font-display self-end text-2xl'>
              Start a 2 week free trial to enjoy exclusive Super benefits
            </p>
          </div>
          <Button theme='white' className='w-full mt-8 text-black'>
            Upgrade to premium
          </Button>
        </div>
      )}

      {/* OTHER THINGS ON SHOPS */}
      <div>
        <h1 className='font-display text-2xl my-6'>Hearts</h1>

        <div className='grid grid-cols-[100px_1fr] border-t-2 py-4'>
          <div>{ICONS.heart}</div>
          <div className='flex justify-between gap-3 p-4'>
            <div>
              <h3 className='text-lg font-display'>Refill Hearts</h3>
              <p className='text-muted-foreground leading-6'>
                Get full hearts so you can worry less about making mistakes in a lesson
              </p>
            </div>
            <Button
              theme='default'
              className='w-[250px] text-secondary-default'
              onClick={fillMyHearts}
              disabled={requiredDimonds === 0}>
              <div className='flex items-center gap-1'>
                {requiredDimonds !== 0 ? (
                  <>
                    <span className='text-neutral-300'>Full</span>
                  </>
                ) : (
                  <>
                    <span>GET FOR: </span>
                    <span className='scale-75'>{ICONS.dimond}</span>
                    <span>{requiredDimonds}</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-[100px_1fr] border-t-2 py-4'>
          <div>{ICONS.infiniteHeart}</div>
          <div className='flex justify-between gap-3 p-4'>
            <div>
              <h3 className='text-lg font-display'>Unlimited Hearts</h3>
              <p className='text-muted-foreground leading-6'>Never run out of hearts with super!</p>
            </div>
            <Button theme='default' className='w-[150px] text-secondary-default'>
              <div className='flex items-center gap-1'>Buy super!</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
