import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const EVENT_ID = 'a1b2c3d4-0001-0001-0001-000000000001'

async function login(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
  await page.goto('/login')
  await page.getByLabel(/correo/i).fill('admin@gdg-aranjuez.com')
  await page.getByLabel(/contraseña/i).fill('admin123')
  await page.getByRole('button', { name: /entrar/i }).click()
  await expect(page).toHaveURL(/\/events/)
}

test.describe('Gestión de Eventos', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('lista de eventos muestra al menos un evento del mock', async ({ page }) => {
    await expect(page.getByRole('table', { name: /lista de eventos/i })).toBeVisible()
    await expect(page.getByText('GDG Aranjuez DevFest 2024')).toBeVisible()
  })

  test('crea un nuevo evento y aparece en la lista', async ({ page }) => {
    await page.getByRole('button', { name: /nuevo evento/i }).click()
    await page.getByLabel(/nombre/i).fill('Test Event E2E')
    await page.getByLabel(/slug/i).fill('test-event-e2e')
    await page.getByRole('button', { name: /guardar|crear/i }).click()

    // Toast de éxito
    await expect(page.getByText(/evento creado/i)).toBeVisible()
    // Evento en la lista
    await expect(page.getByText('Test Event E2E')).toBeVisible()
  })

  test('navega al detalle del evento y muestra las tabs', async ({ page }) => {
    await page.getByText('GDG Aranjuez DevFest 2024').click()
    await expect(page).toHaveURL(new RegExp(EVENT_ID))

    // Tabs visibles
    await expect(page.getByRole('tab', { name: /colaboradores/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /ponentes/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /patrocinadores/i })).toBeVisible()
  })

  test('el botón Editar evento abre el modal de edición', async ({ page }) => {
    await page.goto(`/events/${EVENT_ID}`)
    await page.getByRole('button', { name: /editar evento/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
  })

  test('la lista de eventos no tiene violaciones de accesibilidad críticas', async ({ page }) => {
    // Esperar a que cargue la tabla
    await expect(page.getByRole('table')).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[aria-hidden="true"]') // excluir skeleton/decorative
      .analyze()
    expect(results.violations).toHaveLength(0)
  })

  test('la página de detalle de evento no tiene violaciones de accesibilidad críticas', async ({
    page,
  }) => {
    await page.goto(`/events/${EVENT_ID}`)
    await expect(page.getByRole('tablist')).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[aria-hidden="true"]')
      .analyze()
    expect(results.violations).toHaveLength(0)
  })
})
