import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPerson, updatePerson, deletePerson } from '../services/personsService'
import { personsKeys } from './usePersons'

export function useCreatePerson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPerson,
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}

export function useUpdatePerson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePerson>[1] }) =>
      updatePerson(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}

export function useDeletePerson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePerson,
    onSuccess: () => qc.invalidateQueries({ queryKey: personsKeys.all }),
  })
}
