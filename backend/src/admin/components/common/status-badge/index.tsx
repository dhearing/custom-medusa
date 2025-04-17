import { Badge } from "@medusajs/ui"

type Status = "idle" | "loading" | "success" | "error"

interface StatusBadgeProps {
  status: Status
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === "success") {
    return <Badge color="green">Saved successfully</Badge>
  }
  
  if (status === "error") {
    return <Badge color="red">Error saving</Badge>
  }
  
  return null
}

export default StatusBadge 