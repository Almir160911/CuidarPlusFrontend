import type { ReactNode } from 'react'
import { Modal } from '../ui/Modal'

interface ElderlyModalProps {
  title: string
  description?: string
  open: boolean
  children: ReactNode
  onClose: () => void
}

export function ElderlyModal(props: ElderlyModalProps) {
  return <Modal {...props} maxWidth="max-w-4xl" />
}