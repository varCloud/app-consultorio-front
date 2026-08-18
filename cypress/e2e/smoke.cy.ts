function loginBypass() {
  cy.intercept('https://crm-consultorio-api.onrender.com/**', {
    statusCode: 200,
    body: { estatus: 200, mensaje: 'ok', modelo: [] },
  }).as('api');

  cy.visit('/pacientes/paciente', {
    onBeforeLoad(win) {
      win.localStorage.setItem('sesionActiva', JSON.stringify(true));
      win.localStorage.setItem('tokenWs', JSON.stringify('fake-token'));
      win.localStorage.setItem('sesion', JSON.stringify({ nombre: 'Test', tipoUsuario: 1 }));
    },
  });
}

describe('Angular 20 smoke test', () => {
  const errors: string[] = [];

  beforeEach(() => {
    errors.length = 0;
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        errors.push(args.join(' '));
      });
    });
  });

  it('redirects unauthenticated users to login', () => {
    cy.visit('/pacientes/paciente');
    cy.location('pathname', { timeout: 10000 }).should('include', '/auth/login');
  });

  it('loads pacientes list with no console errors', () => {
    loginBypass();
    cy.location('pathname', { timeout: 10000 }).should('include', '/pacientes/paciente');
    cy.get('body').should('be.visible');
    cy.then(() => {
      expect(errors, errors.join('\n')).to.have.length(0);
    });
  });

  it('opens historial-medico and its ng-select dropdown', () => {
    loginBypass();
    cy.visit('/historial-medico/historial', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sesionActiva', JSON.stringify(true));
        win.localStorage.setItem('tokenWs', JSON.stringify('fake-token'));
      },
    });
    cy.get('ng-select', { timeout: 10000 }).first().click();
    cy.get('.ng-dropdown-panel', { timeout: 5000 }).should('exist');
    cy.then(() => {
      expect(errors, errors.join('\n')).to.have.length(0);
    });
  });

  it('loads notas-medicas / agregar-nota (Quill editor) with no console errors', () => {
    loginBypass();
    cy.visit('/notas/agregar-nota', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sesionActiva', JSON.stringify(true));
        win.localStorage.setItem('tokenWs', JSON.stringify('fake-token'));
      },
    });
    cy.get('.ql-editor', { timeout: 10000 }).first().should('exist').click().type('Hola prueba angular 20');
    cy.get('.ql-editor').first().should('contain.text', 'Hola prueba angular 20');
    cy.then(() => {
      expect(errors, errors.join('\n')).to.have.length(0);
    });
  });
});
