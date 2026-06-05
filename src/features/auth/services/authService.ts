const HARDCODED_CREDENTIALS = [{ email: 'admin@gdg-aranjuez.com', password: 'admin123' }]

const FAKE_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.fake-signature'

export function loginWithCredentials(email: string, password: string): string {
  const valid = HARDCODED_CREDENTIALS.find((c) => c.email === email && c.password === password)
  if (!valid) throw new Error('Credenciales incorrectas')
  return FAKE_JWT_TOKEN
}
