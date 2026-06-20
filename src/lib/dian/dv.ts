const PESOS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]

export function calcularDv(nit: string): number {
  const digitos = nit.replace(/\D/g, '')
  if (!digitos) return 0
  let suma = 0
  const invertido = digitos.split('').reverse()
  for (let i = 0; i < invertido.length; i++) {
    const peso = PESOS[i] ?? 0
    suma += Number(invertido[i]) * peso
  }
  const resto = suma % 11
  return resto > 1 ? 11 - resto : resto
}

export function dvEsValido(nit: string, dv: number): boolean {
  return calcularDv(nit) === dv
}
