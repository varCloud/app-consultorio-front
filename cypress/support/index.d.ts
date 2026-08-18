/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /** Intercepts every call to the backend with a generic { estatus: 200, modelo: [] } envelope. */
      mockApi(): Chainable<void>;
      /** Mocks an authenticated session in localStorage and visits path, matching SesionService's real keys. Merge extra fields (e.g. { esDemo: 1 }) via the second argument. */
      loginBypass(path: string, sesion?: Record<string, unknown>): Chainable<void>;
      /** Just the session + visit half of loginBypass, for specs that need to register their own intercepts in between. */
      visitWithSession(path: string, sesion?: Record<string, unknown>): Chainable<void>;
      /** Opens the "Registrar pacientes" wizard modal from the pacientes list screen. */
      abrirModalRegistroPaciente(): Chainable<void>;
      /** Fills and submits the login form using selectors from fixtures/auth/login.json. */
      fillLoginForm(usuario: string, contrasena: string): Chainable<void>;
      /** Starts capturing console.error calls for the current test under the '@consoleErrors' alias. */
      trackConsoleErrors(): Chainable<void>;
      /** Asserts no console.error was captured since the last trackConsoleErrors() call. */
      assertNoConsoleErrors(): Chainable<void>;
      /** Opens an ng-select host and picks the first option. */
      ngSelectFirst(selector: string): Chainable<void>;
      /** Opens an ng-select host and picks the option matching the given text. */
      ngSelectByText(selector: string, text: string): Chainable<void>;
      /** Fills every required field of the agregar-nota-medica form with valid sample data. */
      fillNotaMedicaForm(): Chainable<void>;
    }
  }
}

export {};
