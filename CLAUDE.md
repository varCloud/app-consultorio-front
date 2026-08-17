# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Angular CLI 17 app (incrementally migrated from 11; see [.claude memory]/project history for the per-major bump log). There is no local `ng` wrapper script, so use `npx ng`.

```bash
nvm use                          # Node 18.20.4 (see .nvmrc) — see below
npm install
npm run serve                    # dev server on http://localhost:4200
npm run build                    # -> dist/ (dev config; aot: true)
npm test                         # karma + jasmine (Chrome), watch mode
npm run lint                     # tslint + codelyzer
npm start                        # NOT a dev server — express (server.js) serving dist/ on PORT || 8888
npx ng e2e                       # protractor
```

**Node >=18.13.0 or >=20.9.0 is required** (`engines` in [package.json](package.json); pinned to 18.20.4 in [.nvmrc](.nvmrc)). The old Node 16 pin and the webpack4/md4/`ERR_OSSL_EVP_UNSUPPORTED`/`--openssl-legacy-provider` constraint documented here previously no longer apply — they were specific to the Angular 11-12 builder and were already moot by the time the app reached Angular 16/17. If your machine doesn't have 18.20.4 installed via nvm, any Node satisfying the `engines` range above (e.g. 20.19.x) works fine too.

A production build is `npx ng build --configuration production` (AOT + `environment.prod.ts`, same AOT compiler the default `npm run build` now uses too). The `--prod` alias was removed in Angular 14 (`ng build --prod` now errors with `Unknown argument: prod`) — use `--configuration production` instead. The wizard forms in `mdl-registra-paciente.component.ts/.html` use getter-based casts (`getFrmPreguntaFam`, `getFrmPreguntaPersonales`, `getFrmPreguntaGineco`, `getFrmPreguntaPatologicos`) to work around `FormArray.controls` not typechecking through `AbstractControl` — copy that pattern for any new nested-`FormArray` template.

Run a single unit test: karma has no name filter flag here — either narrow the `require.context` regex in [src/test.ts](src/test.ts), or use `fdescribe` / `fit` in the spec. Note the 7 `.spec.ts` files are unmodified CLI stubs (mostly failing with `NullInjectorError` for missing `RouterTestingModule`); there is effectively no test suite.

Deployment is Heroku (`git push heroku master`, see [README.md](README.md)); `server.js` is the Heroku web process and rewrites all paths to `dist/index.html`.

The repo has a CodeGraph index (`.codegraph/`, 117 files / 1924 nodes). Prefer `codegraph_explore` over Grep/Read loops for structural questions and before edits.

## Architecture

### One domain now — the MVNO/telephony code was removed

This started as the **NobleUI** admin template wired to an **MVNO/telephony CRM** (SIMs, distributors, clients, sales reports) and was repurposed into a **medical consultorio** app (patients, medical notes, clinical history). The MVNO tree (`telefonia/`, `cliente/`, `usuario/` (the views module), `reporteria/`, `dashboard/` feature modules, their routes, `ColoresService`, the `EnumAsignacionSim`/`EnumEstatusSim` enums, and the dead menu arrays in `navegacion.service.ts`) was deleted as prep for the Angular version migration — it was never reachable from the UI in the first place ([navegacion.service.ts](src/app/servicios/navegacion/navegacion.service.ts) `getNavigationItems()` always returned only the consultorio menu). What remains is a single live domain: `pacientes`, `notas-medicas`, `historial-medico`, `perfil-doc`, `componentes-compartidos`, `auth`.

The app's default route (`{ path: '', redirectTo: ... }` in [app-routing.module.ts](src/app/app-routing.module.ts)) now points at `pacientes/paciente` — it used to redirect to the deleted MVNO dashboard module.

### Layout and routing shell

`AppComponent` → `BaseComponent` ([views/layout/base/](src/app/views/layout/base/)) is the authenticated shell (navbar + sidebar + footer) and the `canActivate: [AuthGuard]` boundary. Every feature is a lazy-loaded `NgModule` child of it with its own `*-routing.module.ts` using `RouterModule.forChild`. `auth` is the only module outside the shell.

### Session, auth, and the HTTP interceptor

Session lives entirely in `localStorage`, mediated by [SesionService](src/app/utils/sesion.service.ts) with keys `sesion`, `sesionActiva`, `tokenWs`.

[CifrarService](src/app/utils/Cifrar.service.ts) is the "encryption" layer, but `setEnc`/`getDec` **return early with plain `JSON.stringify`/`JSON.parse`** — the CryptoJS AES path below the `return` is unreachable. Values in localStorage are plaintext. `generarContrasena` (HmacSHA256) *is* live: the login form hashes the password client-side before POSTing.

[InterceptorRediectService](src/app/core/http/interceptorRediect.service.ts) is registered as the single `HTTP_INTERCEPTORS` provider and handles all auth headers:
- Header is `authorization-pp: Bearer-PP <token>` (not the standard `Authorization`).
- URLs containing `crm/` get `environment.apiKeyReporteria` instead of the session token.
- `paciente/login` is skipped — that is the real login endpoint (`LoginService` posts to `paciente/`, not `usuario/`).
- `sim/registrarMasivoSim` gets the token without `Content-Type` (multipart upload).
- **Token lifetime is the server's call.** The front does not track expiry: it attaches whatever token it has, and a `401` means end of session — `cerrarSesion()` plus a redirect to `/auth/login`. There is no silent token refresh. `crm/` and `paciente/login` are excluded from that rule, since neither uses the session.

`AuthGuard` only checks the `sesionActiva` localStorage flag.

### API layer

One service per backend controller under [src/app/servicios/](src/app/servicios/), each building `url = environment.baseurl + '<controller>/'` and exposing thin `httpClient.post(this.url + '<action>', data)` methods returning raw `Observable`s — no typing, no mapping, no error handling in the service. Components subscribe directly and handle everything.

Two backends in [environments/](src/environments/): `baseurl` (main API, currently `https://crm-consultorio-api.onrender.com/`) and `baseurlReporteria` (was the legacy MVNO reporting backend; the `ReporteriaService` that used it was deleted along with the rest of the MVNO code, so this env var and the interceptor's `crm/`/`apiKeyReporteria` branch are now vestigial — safe to remove in a follow-up).

**Response envelope:** `{ estatus: 200, mensaje: string, modelo: any }`. Components branch on `data.estatus == 200` and read `data.modelo`. [login.component.ts](src/app/views/pages/auth/login/login.component.ts) reads `data.model` (no `o`) while the interceptor's refresh path reads `data.modelo.tokenWs` — these two disagree; verify against the API before touching login.

### Cross-cutting utilities ([src/app/utils/](src/app/utils/))

| Service | Role |
| --- | --- |
| `ToastService` | All user feedback. `mostrar(mensaje, EnumTipoToast.x)` → SweetAlert2 toast. Use this rather than raw `Swal`. |
| `ObservableService` | Global `isLoading` `BehaviorSubject` driven by the interceptor's in-flight request counter. |
| `NotaMedicaUtilsService` | Builds pdfmake document definitions for medical notes (html-to-pdfmake + jspdf/pdfmake). |
| `ExportarInfoXlsService` | XLSX export via `xlsx` + `file-saver`. Currently unused after the MVNO dashboard was deleted, but kept as general-purpose infra. |

[entidades/enumeraciones.ts](src/app/entidades/enumeraciones.ts) now only has `EnumTipoUsuario` (used live by `paciente`, `login`, `historial` components) — the MVNO-only enums were deleted. The consultorio side otherwise has no entity/model types — everything is `any`.

## Conventions

- Domain naming is Spanish (`servicios`, `entidades`, `pacientes`, `obtenerX`, `guardarX`); Angular/framework identifiers stay English. Backend endpoints are Spanish camelCase and sometimes carry typos that must be matched exactly (`obteneNotasMedicas`, `obtenerTiposHitoriasClinicas`).
- Feature modules import their UI dependencies individually — there is no `SharedModule`. Copy the import list from a sibling module ([pacientes.module.ts](src/app/views/pages/pacientes/pacientes.module.ts) is representative: ngx-datatable, ng-select, ngx-mask, ng-bootstrap, archwizard, ngx-skeleton-loader, `FeahterIconModule`, `ComponentesCompartidosModule`).
- `FeahterIconModule` ([core/feather-icon/](src/app/core/feather-icon/)) — the typo is in the real class name.
- Modal components are prefixed `mdl-` and declared in the owning feature module.
- Forms use `FormBuilder` reactive forms; tables use `@swimlane/ngx-datatable`.
- Styles are SCSS (`schematics.style: scss`); global theme is [src/assets/scss/style.scss](src/assets/scss/style.scss) — a vendored NobleUI/Bootstrap 4 theme, not project code.
- tslint config enforces single quotes, 140-char lines, `app` selector prefix, and `member-ordering`; the existing code violates it broadly, so `npm run lint` is noisy.

## Gotchas

- `HashLocationStrategy` is imported in `AppModule` but never provided; routing is path-based, which is why `server.js` needs the catch-all rewrite.
- `TokenService` is injected by the interceptor but is an empty stub.
- `console.log` calls are left in production paths (guard, session, interceptor, base component).
- `environment.prod.ts` hardcodes `baseurlReporteria: 'http://localhost:3013/'` and an API key — reporting is broken in production by construction.
