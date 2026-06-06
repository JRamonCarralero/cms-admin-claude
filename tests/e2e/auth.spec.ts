import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Autenticación', () => {
  test('muestra el formulario de login al acceder a la raíz sin sesión', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'CMS Admin' })).toBeVisible()
    await expect(page.getByLabel(/correo/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña/i)).toBeVisible()
  })

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/correo/i).fill('wrong@test.com')
    await page.getByLabel(/contraseña/i).fill('wrong')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirige a /events tras login correcto', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/correo/i).fill('admin@gdg-aranjuez.com')
    await page.getByLabel(/contraseña/i).fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/\/events/)
    await expect(page.getByRole('navigation', { name: /navegación principal/i })).toBeVisible()
  })

  test('el logout redirige a /login', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByLabel(/correo/i).fill('admin@gdg-aranjuez.com')
    await page.getByLabel(/contraseña/i).fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/\/events/)

    // Logout
    await page.getByRole('button', { name: /cerrar sesión|salir/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('la página de login no tiene violaciones de accesibilidad críticas', async ({ page }) => {
    await page.goto('/login')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
