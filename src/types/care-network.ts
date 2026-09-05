export interface CareNetworkPerson {
  id: string
  fullName: string
  relationshipType: number
  accessRole: number
}

export interface CareNetworkShift {
  id: string
  elderlyPersonId: string
  elderlyPersonName: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: number
}

export interface CareNetworkMember {
  id: string
  fullName: string
  email: string
  role: number
  isActive: boolean
  hasPhoto: boolean
  isCurrentUser: boolean
  assistedPeople: CareNetworkPerson[]
  nextShift?: CareNetworkShift | null
}

export interface CareNetwork {
  familyMembersCount: number
  caregiversCount: number
  activeMembersCount: number
  members: CareNetworkMember[]
}
