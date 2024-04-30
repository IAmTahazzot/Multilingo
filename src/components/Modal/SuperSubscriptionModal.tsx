'use client'

import { ModalType, useModal } from '@/hooks/useModal'
import { Button } from '../Button/Button'
import { ICONS } from '@/lib/Icons'
import { useGlobalState } from '@/hooks/useGlobalState'
import { subscribeToSuperTier } from '@/actions/global'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { useState } from 'react'

export const SuperSubscriptionModal = () => {
  const [subscribing, setSubscribing] = useState(false)
  const { isOpen, closeModal, data, type } = useModal()
  const { user: globalUser, setUser } = useGlobalState()
  const { user } = useUser()

  if (!isOpen || type !== ModalType.SUPER_SUBSCRIPTION) {
    return null
  }

  if (!user || !globalUser) {
    return null
  }

  const subscribeToSuper = async () => {
    try {
      setSubscribing(true)
      await subscribeToSuperTier(user.id)

      await new Promise(resolve => {
        setTimeout(() => {
          setUser({
            ...globalUser,
            tier: 'PREMIUM'
          })
          toast.success('You have successfully subscribed to Super!')
          resolve(null)
        }, 3000)

      })
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSubscribing(false)
      closeModal()
    }
  }

  return (
    <div
      className='z-[1000] fixed top-0 left-0 h-screen w-full overflow-auto'
      style={{
        background:
          'radial-gradient(216% 106% at 6% 3%,rgb(38,246,99,.3) 0,rgb(38,138,255,.3) 52%,rgb(252,85,255,.3) 100%),rgb(0,4,55)'
      }}>
      <div className='absolute top-0 left-0 w-full p-6 flex items-center justify-between'>
        <button onClick={closeModal}>
          <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M2.62126 0.792893C2.23074 0.402369 1.59757 0.402369 1.20705 0.792893C0.816525 1.18342 0.816525 1.81658 1.20705 2.20711L8.58588 9.58594L0.793137 17.3787C0.402613 17.7692 0.402613 18.4024 0.793137 18.7929C1.18366 19.1834 1.81683 19.1834 2.20735 18.7929L10.0001 11.0002L17.7928 18.7929C18.1834 19.1834 18.8165 19.1834 19.207 18.7929C19.5976 18.4024 19.5976 17.7692 19.207 17.3787L11.4143 9.58594L18.7931 2.20711C19.1837 1.81658 19.1837 1.18342 18.7931 0.792893C18.4026 0.402369 17.7694 0.402369 17.3789 0.792893L10.0001 8.17172L2.62126 0.792893Z'
              fill='#FFF'
            />
          </svg>
        </button>

        <div>{ICONS.premiumText}</div>
      </div>

      <div className='max-w-[600px] mx-auto mt-14'>
        <h1 className='font-display text-[42px] text-white text-center leading-[48px]'>
          Progress faster in your course with Super!
        </h1>

        <div className='grid grid-cols-[1fr_150px_150px] grid-rows-[repeat(5,50px)] p-8 bg-white/10 mt-20 rounded-3xl'>
          <div className='asbolute bg-white/20 h-full w-full rounded-2xl' style={{ gridArea: '1 / 3 / -1 / 3' }}></div>

          <div className='grid place-content-center col-start-2 text-white font-display text-lg'>Free</div>
          <div className='grid place-content-center col-start-3 row-start-1'>{ICONS.premiumText}</div>

          <div className='grid items-center text-white font-body text-lg border-b-2 border-white/30'>
            Learning content
          </div>
          <div className='grid place-content-center border-b-2 border-white/30'>{ICONS.check}</div>
          <div className='grid place-content-center col-start-3 row-start-2 border-b-2 border-white/30'>
            {ICONS.check}
          </div>

          <div className='grid items-center text-white font-body text-lg border-b-2 border-white/30'>
            Unlimited hearts
          </div>
          <div className='col-start-2 row-start-3 border-b-2 border-white/30'></div>
          <div className='grid place-content-center col-start-3 row-start-3 border-b-2 border-white/30'>
            {ICONS.check}
          </div>

          <div className='grid items-center text-white font-body text-lg cols-start-1 row-start-4'>No ads</div>
          <div className='grid place-content-center col-start-3 row-start-4'>{ICONS.check}</div>
        </div>
        <p className='text-white/40 text-sm mt-4'>
          Stripe, paypal or any other payment gateway can be integrated here. This is just for demonstration purposes.
        </p>

        <Button onClick={subscribeToSuper} theme='white' className='w-1/2 my-10 mx-auto text-black'>
          {subscribing ? <div className='loader'></div> : 'Subscribe to Super'}
        </Button>
      </div>
    </div>
  )
}
