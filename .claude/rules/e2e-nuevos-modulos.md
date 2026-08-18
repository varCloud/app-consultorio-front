# E2E al crear o modificar un módulo

Al agregar un módulo nuevo bajo `src/app/views/pages/<modulo>/` o modificar uno existente, la cobertura de Cypress sigue esta estructura y este proceso (además de los límites de [testing.md](testing.md)).

## Estructura (una carpeta por módulo)

- Specs: `cypress/e2e/<modulo>/<pantalla>.cy.ts` — el nombre de carpeta coincide con el módulo real (`pacientes`, `notas-medicas`, `historial-medico`, `perfil-doc`, `auth`), no con el nombre de archivo Angular.
- Fixtures: `cypress/fixtures/<modulo>/<pantalla>.json` — ahí van selectores (`selectors.campoX`) y rutas (`routes.pantallaX`), nunca hardcodeados sueltos en el spec.
- Comandos reutilizables: antes de escribir un helper nuevo, revisar `cypress/support/commands/` — los cross-módulo (`loginBypass`, `mockApi`, `visitWithSession`, `trackConsoleErrors`/`assertNoConsoleErrors`) y los de componente (`cypress/support/commands/components/`, ej. `ngSelectFirst`) ya existen. Un comando específico de un módulo nuevo (ej. `fillNotaMedicaForm`) va en `cypress/support/commands/<modulo>-commands.ts`, se importa en `cypress/support/e2e.ts` y se tipa en `cypress/support/index.d.ts`.

## Antes de escribir el intercept: verificar el endpoint real

**No asumas el prefijo de la URL por el nombre de la clase del servicio.** Ya pasó dos veces: `UsuarioService` (`src/app/servicios/usuario/usuario.service.ts`) apunta a `environment.baseurl + 'paciente/'`, no `'usuario/'`. Antes de escribir `cy.intercept(...)`, abrir el `.service.ts` real y leer el campo `url` — no inferirlo del nombre de archivo/carpeta.

Si un `cy.wait('@alias')` da "No request ever occurred" y el endpoint parece correcto, diagnosticar con un intercept espía de una sola vez en vez de seguir adivinando:

```ts
cy.intercept('POST', '**/*').as('anyPost');
// ...disparar la acción...
cy.get('@anyPost.all').then((calls) => { throw new Error(JSON.stringify(calls.map(c => c.request.url))); });
```

Borrar el spec de diagnóstico apenas se confirma la URL real - no se commitea.

## Orden de los `cy.intercept()`

Cypress prioriza el intercept **más recientemente registrado** entre los que matchean una misma request. `cy.mockApi()` registra un wildcard genérico; cualquier intercept más específico de un test debe registrarse **después** de `cy.mockApi()`/`cy.loginBypass()` para ganarle. Si una pantalla no hace ninguna llamada HTTP en `ngOnInit` (ej. `perfil-doc`), no llames a `loginBypass`/`mockApi` para nada — usá `cy.visitWithSession()` solo y registrá el intercept específico sin competencia.

Cuidado con registrar un intercept dentro de un `cy.fixture().then(cb)` cuando el resto del test ya encoló comandos fuera de ese callback: los comandos que `cb` encola en ese momento se insertan en la cola inmediatamente después del paso `then` actual, antes de lo que ya estaba encolado más abajo en el test. Si hace falta devolver un valor synced desde un callback que ya usó comandos `cy`, devolvé `cy.wrap(valor)`, nunca el valor plano (Cypress tira `CypressError: mixing up async and sync code`).

## No asumir el comportamiento del componente - correrlo

Este código tiene formularios que sí gatean el submit en `.valid` (login, pacientes wizard) y otros que no gatean nada y ni siquiera manejan errores del backend (`agregar-nota-medica.guardar()`, `perfil.guardar()` — ver hallazgos en testing.md). No se puede adivinar cuál es cuál solo leyendo el componente por encima: **levantar `npm run serve` y correr `npx cypress run` de verdad** antes de dar una prueba por terminada, y ajustar la aserción al comportamiento real observado (documentando el bug si el comportamiento real es incorrecto, no forzando el test a mentir).

## Gotchas puntuales ya encontrados

- **Quill** (`quill-editor` / `.ql-editor`): al tipear con `cy.type()`, los espacios llegan al payload como `&nbsp;`, no como espacio literal. Comparar con `.contain('palabra')` por fragmentos, no la frase completa.
- **`esDemo` en la sesión** (wizard de registro de paciente, `mdl-registra-paciente.component.ts`): con `sesion.esDemo = 1`, casi todos los campos del paso 1 dejan de ser requeridos excepto `nombres`. Útil para probar el guardado sin tener que interactuar con el `ngbDatepicker`.
- **`ng-select` con `<ng-option>` proyectado vía `*ngFor` sobre un arreglo sin inicializar** (ej. `historial-medico`): si la propiedad del arreglo no arranca en `[]` y se llena async, el `<span class="ng-option-label">` puede quedar vacío y la opción no se puede seleccionar ni por click ni por búsqueda - esto es un bug de la app, no del test; documentarlo como tal (ver el spec de `historial-medico` para el patrón de aserción).
