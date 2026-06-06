import { setupServer } from 'msw/node'
import { eventHandlers } from './handlers/events.handlers'
import { personHandlers } from './handlers/persons.handlers'
import { collaboratorHandlers } from './handlers/collaborators.handlers'
import { developerHandlers } from './handlers/developers.handlers'
import { organizerHandlers } from './handlers/organizers.handlers'
import { speakerHandlers } from './handlers/speakers.handlers'
import { sponsorHandlers } from './handlers/sponsors.handlers'
import { trackHandlers } from './handlers/tracks.handlers'

export const server = setupServer(
  ...eventHandlers,
  ...personHandlers,
  ...collaboratorHandlers,
  ...developerHandlers,
  ...organizerHandlers,
  ...speakerHandlers,
  ...sponsorHandlers,
  ...trackHandlers,
)
