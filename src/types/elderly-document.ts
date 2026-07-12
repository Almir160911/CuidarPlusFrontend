export const DocumentType = {
  Prescription: 1,
  MedicalExam: 2,
  HospitalDischarge: 3,
  IdentityDocument: 4,
  HealthInsuranceCard: 5,
  ConsentTerm: 6,
  Other: 99,
} as const

export type DocumentType =
  (typeof DocumentType)[keyof typeof DocumentType]

export interface ElderlyDocument {
  id: string
  elderlyPersonId: string
  fileName: string
  originalFileName: string
  contentType: string
  filePath: string
  type: DocumentType
  description?: string | null
  uploadedAt: string
  uploadedByUserId: string
}

export interface UploadElderlyDocumentRequest {
  elderlyPersonId: string
  type: DocumentType
  description?: string
  file: File
}

export interface ElderlyDocumentListResult {
  items: ElderlyDocument[]
  totalItems: number
}
