# Constantes

Nada de valores mágicos escritos a mano en el código (strings de endpoints, keys de `localStorage`, códigos de estatus, nombres de headers, límites numéricos, etc.). Todo eso vive en un **único archivo general de constantes**: [src/app/constantes/constantes.ts](../../src/app/constantes/constantes.ts).

- Un archivo, agrupado por sección con objetos `as const` (no uno por dominio/feature) — es el punto único donde buscar "¿ya existe esta constante?" antes de escribir un literal nuevo.
- Al tocar código existente que use un valor mágico, si el cambio ya te tiene tocando esa línea, súbelo a `constantes.ts` de una vez. No hace falta una pasada retroactiva dedicada a limpiar todo el código viejo salvo que se pida explícitamente.
- Los `enum` existentes (ej. `EnumTipoUsuario` en [enumeraciones.ts](../../src/app/entidades/enumeraciones.ts)) siguen viviendo ahí — `constantes.ts` es para literales sueltos (strings, números, keys), no reemplaza los enums.

**Por qué**: los valores mágicos duplicados son la fuente más común de bugs silenciosos en este proyecto (ver el desacuerdo `data.model` vs `data.modelo` documentado en CLAUDE.md) — centralizarlos hace que un typo se note una sola vez, no en cada copia.
