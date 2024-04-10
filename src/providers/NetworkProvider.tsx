import { Network } from "@/components/Network/Network"

export const NetworkProvider = ({
  children
}: {
  children?: React.ReactNode
}) => {
  return (
    <div>
      <Network />
      {children}
    </div>
  )
}