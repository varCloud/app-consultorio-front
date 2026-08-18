function abrirWizard(sesion: Record<string, unknown> = {}) {
  return cy.fixture('pacientes/paciente').then((paciente) => {
    cy.loginBypass(paciente.routes.list, sesion);
    cy.abrirModalRegistroPaciente();
    return cy.wrap(paciente, { log: false });
  });
}

describe('Pacientes - registro (wizard, paso 1: datos generales)', () => {
  it('muestra "Este campo es requerido" en los campos obligatorios vacíos', () => {
    abrirWizard().then((paciente) => {
      cy.contains(paciente.selectors.btnSiguiente, 'Siguiente').click();
      cy.get(paciente.selectors.invalidFeedback).should('have.length.greaterThan', 0);
      cy.get(paciente.selectors.invalidFeedback).first().should('be.visible').and('contain.text', 'Este campo es requerido');
    });
  });

  it('registra al paciente con los datos capturados', () => {
    // esDemo:1 exime de required a los campos que no son relevantes para este caso
    // (apellidos, telefono, correo, etc. - ver .claude/rules/testing.md: solo nos
    // interesa probar el envío correcto del payload, no recorrer todo el wizard).
    abrirWizard({ esDemo: 1 }).then((paciente) => {
      cy.intercept('POST', '**/paciente/registrarPaciente', {
        statusCode: 200,
        body: { estatus: 200, mensaje: 'Paciente registrado con éxito', modelo: { idPaciente: 55 } },
      }).as('registrar');

      cy.get('#nombres').type('Juan Pérez');
      cy.contains(paciente.selectors.btnSiguiente, 'Siguiente').click();

      cy.wait('@registrar').its('request.body').then((body) => {
        expect(body.nombres).to.eq('Juan Pérez');
      });
      cy.get('.swal2-toast', { timeout: 5000 }).should('contain.text', 'Paciente registrado con éxito');
    });
  });

  it('muestra un toast y permanece en el paso 1 cuando el backend rechaza el registro', () => {
    abrirWizard({ esDemo: 1 }).then((paciente) => {
      cy.intercept('POST', '**/paciente/registrarPaciente', {
        statusCode: 200,
        body: { estatus: 400, mensaje: 'No se pudo registrar el paciente', modelo: null },
      }).as('registrarRechazado');

      cy.get('#nombres').type('Juan Pérez');
      cy.contains(paciente.selectors.btnSiguiente, 'Siguiente').click();

      cy.wait('@registrarRechazado');
      cy.get('.swal2-toast', { timeout: 5000 }).should('contain.text', 'No se pudo registrar el paciente');
      cy.get('#nombres').should('exist');
    });
  });

  it('muestra un toast de error cuando la petición de registro falla (500)', () => {
    abrirWizard({ esDemo: 1 }).then((paciente) => {
      cy.intercept('POST', '**/paciente/registrarPaciente', { statusCode: 500, body: {} }).as('registrarError');

      cy.get('#nombres').type('Juan Pérez');
      cy.contains(paciente.selectors.btnSiguiente, 'Siguiente').click();

      cy.wait('@registrarError');
      cy.get('.swal2-toast', { timeout: 5000 }).should('exist');
      cy.get('#nombres').should('exist');
    });
  });
});
