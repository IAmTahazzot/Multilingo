import { CourseSetupModal } from '@/components/Modal/CourseSetupModal'
import { SuperSubscriptionModal } from '@/components/Modal/SuperSubscriptionModal'

export const ModalProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      {children}

      <div className='------------------------------------- MODAL --------------------------------------'>
        {/* Modal will be rendered here */}
        <CourseSetupModal />
        <SuperSubscriptionModal />
      </div>
    </div>
  )
}
