import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './Table'
import type { ColumnDef } from './Table'

interface Row {
  id: string
  name: string
}

const columns: ColumnDef<Row>[] = [{ key: 'name', header: 'Nombre', cell: (r) => r.name }]

const data: Row[] = [
  { id: '1', name: 'Evento A' },
  { id: '2', name: 'Evento B' },
]

describe('Table', () => {
  it('renderiza cabeceras y filas', () => {
    render(<Table data={data} columns={columns} keyExtractor={(r) => r.id} />)
    expect(screen.getByRole('columnheader', { name: /nombre/i })).toBeInTheDocument()
    expect(screen.getByText('Evento A')).toBeInTheDocument()
    expect(screen.getByText('Evento B')).toBeInTheDocument()
  })

  it('muestra EmptyState cuando no hay datos', () => {
    render(
      <Table data={[]} columns={columns} keyExtractor={(r) => r.id} emptyTitle="No hay eventos" />,
    )
    expect(screen.getByText('No hay eventos')).toBeInTheDocument()
  })

  it('muestra spinner mientras carga', () => {
    render(<Table data={[]} columns={columns} keyExtractor={(r) => r.id} isLoading />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('las cabeceras tienen scope=col', () => {
    render(<Table data={data} columns={columns} keyExtractor={(r) => r.id} />)
    const th = screen.getByRole('columnheader', { name: /nombre/i })
    expect(th).toHaveAttribute('scope', 'col')
  })
})
