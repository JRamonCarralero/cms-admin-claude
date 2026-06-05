import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

const meta = { total: 100, page: 1, pageSize: 10 }

describe('Pagination', () => {
  it('muestra el resumen de resultados', () => {
    render(<Pagination meta={meta} onPageChange={vi.fn()} />)
    expect(screen.getByText('1–10 de 100')).toBeInTheDocument()
  })

  it('llama a onPageChange al avanzar página', async () => {
    const onPageChange = vi.fn()
    render(<Pagination meta={meta} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: /página siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('botón anterior deshabilitado en la primera página', () => {
    render(<Pagination meta={meta} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botón siguiente deshabilitado en la última página', () => {
    const lastMeta = { total: 10, page: 1, pageSize: 10 }
    render(<Pagination meta={lastMeta} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /página siguiente/i })).toBeDisabled()
  })

  it('marca la página actual con aria-current=page', () => {
    render(<Pagination meta={{ ...meta, page: 3 }} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('muestra "Sin resultados" cuando total=0', () => {
    render(<Pagination meta={{ total: 0, page: 1, pageSize: 10 }} onPageChange={vi.fn()} />)
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
  })
})
