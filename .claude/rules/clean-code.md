# Clean code y SOLID — con criterio

Clean code siempre: nombres claros, funciones cortas y con un solo propósito, sin duplicación evidente.

SOLID **solo cuando el problema lo pide** — no por defecto:

- Si la solución simple (un servicio, un método, un `if`) resuelve el caso real sin forzar nada, se deja simple. No se crean interfaces, abstracciones ni inyección de estrategias para un solo caso de uso hipotético.
- Aplicar un patrón SOLID (ej. extraer una interface para poder intercambiar implementaciones, separar responsabilidades en clases distintas) cuando ya hay evidencia real de que se necesita — variación real, no imaginada: dos o más implementaciones reales, una clase que ya está haciendo demasiado y se nota al leerla, o un caso de prueba que exige poder mockear una dependencia.
- Preferir 3 líneas repetidas y legibles antes que una abstracción prematura que las reemplace "por si acaso".

**Por qué**: este proyecto ya tiene ejemplos de sobre-ingeniería a medias y de la abstracción opuesta (services con `any` en todos lados) — la meta es código legible primero, no "aplicar todos los principios" por regla.
