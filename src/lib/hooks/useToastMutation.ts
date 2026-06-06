import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from '@/store/toastStore'

type ToastMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> & {
  successMessage?: string
  errorMessage?: string
}

/**
 * Thin wrapper around useMutation that auto-shows toast notifications
 * on success and error. Extra options `successMessage` / `errorMessage`
 * are intercepted and not forwarded to TanStack Query.
 */
export function useToastMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(options: ToastMutationOptions<TData, TError, TVariables, TContext>) {
  const { successMessage, errorMessage, onSuccess, onError, ...rest } = options

  return useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    // Spread args so we stay compatible with TanStack Query v5 callback signatures
    onSuccess: (...args) => {
      if (successMessage) toast.success(successMessage)
      ;(onSuccess as (...a: typeof args) => void)?.(...args)
    },
    onError: (...args) => {
      toast.error(errorMessage ?? 'Ha ocurrido un error. Inténtalo de nuevo.')
      ;(onError as (...a: typeof args) => void)?.(...args)
    },
  })
}
