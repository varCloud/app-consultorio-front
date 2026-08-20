function visitConPaciente() {
  return cy.fixture('pacientes/paciente').then((paciente) => {
    cy.loginBypass(paciente.routes.list);
    cy.intercept('POST', '**/paciente/obtenerPacientes', {
      statusCode: 200,
      body: { estatus: 200, mensaje: 'ok', modelo: [paciente.mockPaciente] },
    }).as('obtenerPacientes');
    cy.wait('@obtenerPacientes');
    return cy.wrap(paciente, { log: false });
  });
}

describe('Pacientes - listado', () => {
  it('carga el listado de pacientes sin errores en consola', () => {
    cy.trackConsoleErrors();
    cy.fixture('pacientes/paciente').then((paciente) => {
      cy.loginBypass(paciente.routes.list);
      cy.location('pathname', { timeout: 10000 }).should('include', paciente.routes.list);
    });
    cy.get('body').should('be.visible');
    cy.assertNoConsoleErrors();
  });

  it('elimina un paciente (idPaciente, no idUsuario) y refresca el listado', () => {
    visitConPaciente().then((paciente) => {
      cy.intercept('POST', '**/paciente/eliminarPaciente', {
        statusCode: 200,
        body: { estatus: 200, mensaje: 'Paciente eliminado' },
      }).as('eliminarPaciente');

      cy.get(paciente.selectors.btnEliminar).first().click();
      cy.get('.swal2-confirm').click();

      cy.wait('@eliminarPaciente').its('request.body').should('deep.equal', { idPaciente: paciente.mockPaciente.idPaciente });
      cy.get('.swal2-toast', { timeout: 5000 }).should('contain.text', 'Paciente eliminado');
      cy.wait('@obtenerPacientes');
    });
  });

  it('muestra un toast de error cuando el backend rechaza la eliminación', () => {
    visitConPaciente().then((paciente) => {
      cy.intercept('POST', '**/paciente/eliminarPaciente', {
        statusCode: 200,
        body: { estatus: -1, mensaje: 'El paciente no existe' },
      }).as('eliminarPacienteRechazado');

      cy.get(paciente.selectors.btnEliminar).first().click();
      cy.get('.swal2-confirm').click();

      cy.wait('@eliminarPacienteRechazado');
      cy.get('.swal2-toast', { timeout: 5000 }).should('contain.text', 'El paciente no existe');
    });
  });
});
