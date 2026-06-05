import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

function renderModal(open = true, onClose = vi.fn()) {
  return render(
    <Modal open={open} onClose={onClose} title="Título de prueba">
      <button type="button">Primer elemento</button>
      <button type="button">Último elemento</button>
    </Modal>,
  )
}

describe('Modal', () => {
  it('no renderiza nada cuando open=false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza con role=dialog y aria-modal cuando open=true', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('muestra el título y lo asocia con aria-labelledby', () => {
    renderModal()
    expect(screen.getByText('Título de prueba')).toBeInTheDocument()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('llama a onClose al pulsar Escape', async () => {
    const onClose = vi.fn()
    renderModal(true, onClose)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('llama a onClose al pulsar el botón de cerrar', async () => {
    const onClose = vi.fn()
    renderModal(true, onClose)
    await userEvent.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
