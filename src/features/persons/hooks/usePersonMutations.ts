import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createPerson, updatePerson, deletePerson } from '../services/personsService'
import { personsKeys } from './usePersons'

export function useCreatePerson() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: createPerson,
    successMessage: 'Persona creada correctamente',
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}

export function useUpdatePerson() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePerson>[1] }) =>
      updatePerson(id, data),
    successMessage: 'Persona actualizada correctamente',
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}

export function useDeletePerson() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deletePerson,
    successMessage: 'Persona eliminada',
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}
