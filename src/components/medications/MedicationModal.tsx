import type { ReactNode } from 'react'
import { Modal } from '../ui/Modal'

interface MedicationModalProps {
  title: string
  description?: string
  open: boolean
  children: ReactNode
  onClose: () => void
}

export function MedicationModal(props: MedicationModalProps) {
  return <Modal {...props} maxWidth="max-w-3xl" />
}