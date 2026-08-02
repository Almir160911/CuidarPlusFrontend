export interface ElderlyPhotoMetadata {
  elderlyPersonId: string
  hasPhoto: boolean
  hasConsent: boolean
  contentType?: string | null
  sizeInBytes?: number | null
  uploadedAt?: string | null
}
