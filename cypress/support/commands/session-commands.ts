// sesionActiva/tokenWs/sesion are the real localStorage keys SesionService reads
// (see src/app/utils/sesion.service.ts) - CifrarService.setEnc/getDec is a plain
// JSON.stringify/parse passthrough in this app, so plaintext JSON is what's expected.
const defaultSesion = { nombre: 'Test', tipoUsuario: 1 };

Cypress.Commands.add('visitWithSession', (path: string, sesion: Record<string, unknown> = {}) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('sesionActiva', JSON.stringify(true));
      win.localStorage.setItem('tokenWs', JSON.stringify('fake-token'));
      win.localStorage.setItem('sesion', JSON.stringify({ ...defaultSesion, ...sesion }));
    },
  });
});

// For specs that need a more specific intercept than mockApi()'s wildcard to win,
// register it after cy.mockApi() and before cy.visitWithSession() directly (Cypress
// gives precedence to the most recently defined matching intercept), instead of
// calling this all-in-one command.
Cypress.Commands.add('loginBypass', (path: string, sesion: Record<string, unknown> = {}) => {
  cy.mockApi();
  cy.visitWithSession(path, sesion);
});
