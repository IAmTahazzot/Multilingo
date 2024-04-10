import { CourseSetupModal } from '@/components/Modal/CourseSetupModal'

export const ModalProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      {children}

      <div className='------------------------------------- MODAL --------------------------------------'>
        {/* Modal will be rendered here */}
        <CourseSetupModal />
      </div>
    </div>
  )
}
