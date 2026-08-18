/**
 * Archivo general de constantes del sistema. Ver .claude/rules/constantes.md:
 * nada de valores mágicos sueltos en componentes/servicios, todo entra aquí.
 */

export const StorageKeys = {
  sesion: 'sesion',
  sesionActiva: 'sesionActiva',
  tokenWs: 'tokenWs',
} as const;

export const ApiEnvelope = {
  estatusExito: 200,
} as const;
