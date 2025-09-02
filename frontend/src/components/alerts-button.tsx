import { Button } from "@chakra-ui/react";
import { BellRing } from 'lucide-react'

export function AlertsButton() {
  return (
    <Button variant="plain">
      <BellRing size={18} />
    </Button>
  )
}