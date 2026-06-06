import { setupServer } from 'msw/node'
import { eventHandlers } from './handlers/events.handlers'
import { personHandlers } from './handlers/persons.handlers'

export const server = setupServer(...eventHandlers, ...personHandlers)
