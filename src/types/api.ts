export interface PagedMeta {
  total: number
  page: number
  pageSize: number
}

export interface PagedResponse<T> {
  data: T[]
  meta: PagedMeta
}

export interface AppError {
  type: string
  message: string
  code: string
  trace_id: string
}

export interface AuditFields {
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface PersonFields {
  first_name: string
  last_name: string
  email: string
  avatar_url?: string
  github_user?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
}

export interface EventResponse extends AuditFields {
  id: string
  name: string
  slug: string
  is_active: boolean
}

export interface PersonResponse extends PersonFields, AuditFields {
  id: string
}

export interface CollaboratorResponse extends AuditFields {
  id: string
  person_id: string
  event_id: string
  area?: string
}

export interface CollaboratorDetailResponse extends CollaboratorResponse, PersonFields {}

export interface DeveloperResponse extends AuditFields {
  id: string
  person_id: string
  event_id: string
  role_description?: string
}

export interface DeveloperDetailResponse extends DeveloperResponse, PersonFields {}

export interface OrganizerResponse extends AuditFields {
  id: string
  person_id: string
  event_id: string
  company?: string
  role_description?: string
}

export interface OrganizerDetailResponse extends OrganizerResponse, PersonFields {}

export interface SpeakerResponse extends AuditFields {
  id: string
  person_id: string
  event_id: string
  bio?: string
  company?: string
}

export interface SpeakerDetailResponse extends SpeakerResponse, PersonFields {}

export interface SponsorResponse extends AuditFields {
  id: string
  event_id: string
  name: string
  logo_url: string
  website_url: string
  tier: string
  order_priority?: number
}

export interface TrackResponse extends AuditFields {
  id: string
  event_id: string
  name: string
  event_date: string
}

export interface SpeakerTrackResponse {
  first_name: string
  last_name: string
  avatar_url?: string
  company?: string
}

export interface TalkTrackResponse {
  id: string
  title: string
  description?: string
  speakers: SpeakerTrackResponse[]
}

export interface ScheduleEntryTrackResponse {
  schedule_id: string
  start_time: string
  end_time: string
  room?: string
  talk: TalkTrackResponse
}

export interface FullTrackScheduleResponse {
  track_id: string
  track_name: string
  event_date: string
  entries: ScheduleEntryTrackResponse[]
}
