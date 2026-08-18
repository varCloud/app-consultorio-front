# Reglas de testing (Cypress e2e)

No se crean pruebas sin límite ("a lo loco"). Por cada pantalla/flujo, el spec correspondiente tiene un **máximo de 6 `it()`**. Si una pantalla necesita más cobertura que eso, es señal de que hay que dividir el flujo en specs más chicos, no de romper el límite.

Dentro de ese presupuesto de 6, priorizar en este orden:

1. **Validaciones de formulario** — campos requeridos, formatos inválidos que bloquean el submit, mensajes de error visibles.
2. **Inserción correcta en base de datos** — mockear la respuesta 200 del backend y verificar que el payload enviado (`cy.wait('@alias').its('request.body')`) tiene la forma esperada, y que la UI refleja el éxito (toast, redirect, refresco de tabla).
3. **Errores que puede regresar la base de datos** — mockear respuestas de error (`estatus != 200`, 4xx/5xx, payload malformado) y verificar que la UI los maneja sin romperse (toast de error vía `ToastService`, no un crash ni un estado colgado).

No agregar pruebas de "humo" adicionales (clicks sueltos, existencia de elementos sin assertion de negocio) si ya se cubrieron los tres puntos de arriba y queda presupuesto — mejor dejarlo sin usar que rellenar con pruebas de bajo valor.

**Por qué**: cobertura amplia pero superficial genera mantenimiento caro sin atrapar bugs reales. Estos tres puntos (validación, persistencia correcta, manejo de errores del backend) son donde de verdad se rompen las pantallas de este proyecto — no en que un botón exista.
